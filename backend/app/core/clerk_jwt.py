"""Optional Clerk JWT verification.

When CLERK_JWT_ISSUER is configured, requests carrying an
``Authorization: Bearer <jwt>`` header are verified against the issuer's
JWKS. On success the token's ``sub`` claim (the Clerk user id) replaces any
client-supplied ``clerk-user-id`` header and ``clerk_user_id`` query
parameter, so every existing endpoint keeps working unchanged while the
identity becomes cryptographically trustworthy. Invalid tokens are rejected
with 401.

With CLERK_REQUIRE_JWT=true, raw identity claims (header/query without a
verified token) are rejected too — legacy trust-the-client mode is off.

Unset CLERK_JWT_ISSUER keeps the middleware as a pass-through, preserving
current behavior.
"""

import asyncio
import json
import time
from urllib.parse import parse_qsl, urlencode

import httpx
import jwt

from app.core.config import settings

JWKS_CACHE_TTL_SECONDS = 3600.0


class ClerkJWTMiddleware:
    """Pure-ASGI middleware (avoids BaseHTTPMiddleware's buffering issues)."""

    def __init__(self, app):
        self.app = app
        self._keys: dict[str, object] = {}
        self._fetched_at = 0.0
        self._lock = asyncio.Lock()

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or not settings.CLERK_JWT_ISSUER:
            return await self.app(scope, receive, send)

        token = _bearer_token(scope)

        if token:
            try:
                sub = await self._verified_subject(token)
            except jwt.PyJWTError:
                return await _send_json(send, 401, {"detail": "Invalid or expired token"})
            except httpx.HTTPError:
                return await _send_json(send, 401, {"detail": "Unable to verify token"})
            _replace_identity(scope, sub)
        elif settings.CLERK_REQUIRE_JWT and _claims_identity(scope):
            return await _send_json(send, 401, {"detail": "Bearer token required"})

        await self.app(scope, receive, send)

    async def _verified_subject(self, token: str) -> str:
        kid = jwt.get_unverified_header(token).get("kid")
        key = await self._key_for(kid)
        if key is None:
            # Unknown kid: force one refetch in case of key rotation.
            key = await self._key_for(kid, force_refresh=True)
        if key is None:
            raise jwt.InvalidKeyError(f"No JWKS key for kid {kid!r}")

        payload = jwt.decode(
            token,
            key=key,
            algorithms=["RS256"],
            issuer=settings.CLERK_JWT_ISSUER,
            leeway=5,
            options={"require": ["exp", "iss", "sub"]},
        )
        return payload["sub"]

    async def _key_for(self, kid: str | None, force_refresh: bool = False):
        async with self._lock:
            stale = (time.monotonic() - self._fetched_at) > JWKS_CACHE_TTL_SECONDS
            if force_refresh or stale or not self._keys:
                await self._refresh_keys()
            return self._keys.get(kid)

    async def _refresh_keys(self):
        url = f"{settings.CLERK_JWT_ISSUER.rstrip('/')}/.well-known/jwks.json"
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
        jwks = response.json()
        self._keys = {
            entry["kid"]: jwt.PyJWK(entry).key
            for entry in jwks.get("keys", [])
            if entry.get("kid")
        }
        self._fetched_at = time.monotonic()


def _bearer_token(scope) -> str | None:
    for name, value in scope.get("headers", []):
        if name == b"authorization":
            text = value.decode("latin-1")
            if text.lower().startswith("bearer "):
                return text[7:].strip()
    return None


def _claims_identity(scope) -> bool:
    for name, _ in scope.get("headers", []):
        if name == b"clerk-user-id":
            return True
    query = scope.get("query_string", b"").decode("latin-1")
    return any(k == "clerk_user_id" for k, _ in parse_qsl(query, keep_blank_values=True))


def _replace_identity(scope, sub: str):
    # Replace — never append alongside — so a valid token for user A cannot
    # smuggle a clerk_user_id=B query param past verification.
    headers = [(k, v) for k, v in scope.get("headers", []) if k != b"clerk-user-id"]
    headers.append((b"clerk-user-id", sub.encode("latin-1")))
    scope["headers"] = headers

    query = scope.get("query_string", b"").decode("latin-1")
    pairs = [
        (k, v)
        for k, v in parse_qsl(query, keep_blank_values=True)
        if k != "clerk_user_id"
    ]
    pairs.append(("clerk_user_id", sub))
    scope["query_string"] = urlencode(pairs).encode("latin-1")


async def _send_json(send, status_code: int, payload: dict):
    body = json.dumps(payload).encode("utf-8")
    await send(
        {
            "type": "http.response.start",
            "status": status_code,
            "headers": [
                (b"content-type", b"application/json"),
                (b"content-length", str(len(body)).encode("latin-1")),
            ],
        }
    )
    await send({"type": "http.response.body", "body": body})
