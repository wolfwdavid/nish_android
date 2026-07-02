# Backend API Reference (as consumed by the Android app)

FastAPI backend under `backend/`. Interactive Swagger docs at `<base-url>/docs` when running. Default dev base URL: `http://localhost:8000` (from the Android emulator: `http://10.0.2.2:8000`).

## Auth model — important caveat

**The backend does not verify tokens.** `backend/app/core/auth.py` reads a raw `clerk-user-id` HTTP header (FastAPI's `Header` conversion of the `clerk_user_id` parameter) and looks that user up in the database. Several endpoints instead take `clerk_user_id` as a **query parameter**. There is no JWT validation, even though `CLERK_SECRET_KEY`/`CLERK_JWT_ISSUER` are provisioned in config.

Consequences for clients:
- The Android app's `AuthInterceptor` attaches `clerk-user-id: <id>` to every request, and passes `clerk_user_id=<id>` as a query param where an endpoint requires it (e.g. `/profile/me`).
- Anyone who knows a user id can act as that user. **Dev-grade only.** Before any real release the backend must verify Clerk-issued JWTs and the app must adopt the Clerk Android SDK.

## Pagination

- `GET /projects/` is the only cursor-paginated list: `?limit=<n>&cursor=<datetime>` → `{items, next_cursor, has_more}`. The cursor is a **datetime string**, not an opaque token. Note the **trailing slash** — without it the backend answers with a 307 redirect.
- `GET /feed-events` and `GET /live-projects` return plain unpaginated arrays (despite what the upstream README implies).

## Backend fixes shipped in this repo

Three defects in the upstream backend were fixed here (deployed instances that predate these fixes will still show the old behavior):

1. **Comment edit/delete/vote returned 500** — `router/project.py` passed a `clerk_user_id=` kwarg to service functions expecting `user_id`; every `PATCH/DELETE /projects/comments/{id}` and `POST .../vote` crashed with a `TypeError`. The handlers now resolve the `User` row first (mirroring the create-comment handler).
2. **Follow decremented counts** — `service/follow.py` subtracted 1 from `followers_count`/`following_count` on follow instead of adding. The Android app defensively refetches the profile after a follow toggle regardless.
3. **No token verification** — addressed by the optional JWT middleware below.

## Endpoints used by the Android MVP

| Method & path | Returns | Notes |
|---|---|---|
| `GET /feed-events` | `[GetFeedEvent]` | public feed, newest first |
| `GET /projects/` | `PaginatedProjects` | `limit`, `cursor` (datetime); auth header enables `is_starred`/`is_bookmarked` |
| `GET /projects/{slug}` | `GetProject` | optional `clerk_user_id` query |
| `GET /projects/{slug}/comments` | `[GetComment]` | two-level threading: top-level comments carry `replies` |
| `GET /live-projects` | `[GetLiveProject]` | unpaginated |
| `GET /live-projects/{slug}` | `GetLiveProject` | |
| `GET /live-projects/{slug}/journals` | `[GetLiveProjectJournal]` | `entry_type` ∈ progress, milestone, bugfix, deployment, architecture, announcement, failure |
| `GET /profile/{username}` | `get_profile_data` | |
| `GET /profile/me` | `get_profile_data` | requires `clerk_user_id` **query param** |
| `GET /search/users` | `[user dict]` | `q`, `limit` (≤ 30); empty `q` → `[]` |

## Write endpoints used by the Android app

All take `clerk_user_id` as a **required query parameter**.

| Method & path | Returns | Client semantics |
|---|---|---|
| `POST/DELETE /projects/{slug}/star` | full `GetProject` | fresh `stars_count`/`is_starred` reconciles the optimistic UI; 409/404 → refetch project |
| `POST/DELETE /projects/{slug}/bookmark` | `ProjectBookmarkStatus` | treated as opaque; 409/404 → already in desired state |
| `POST /projects/{slug}/comments` | `CommentOut` (201) | body `{content, parent_id?}`; `parent_id` set = reply (max two levels) |
| `POST /projects/comments/{id}/vote` | `CommentOut` | body `{vote_type: "up"\|"down"}`; toggle/switch semantics — client re-reads the list |
| `POST /live-projects/{slug}/journals` | `GetLiveProjectJournal` | owner-only (404 otherwise); `day_number` sent as 0, server recomputes |
| `POST/DELETE /live-projects/journals/{id}/like` | `{message, likes_count, is_liked}` | journals GET has no `is_liked`, so liked state is session-local |
| `POST/DELETE /users/{username}/follow` | `FollowStatus` | 409 already-following / 404 not-following → sync via follow-status |
| `GET /users/{username}/follow-status` | `FollowStatus` | |
| `POST /sync_user/` | `UserResponse` | provisions the user row after Clerk sign-in; **trailing slash required** (307 drops POST bodies) |

**409/404 as state-sync:** duplicate creates return 409 and missing deletes return 404; the Android repositories map both to "already in the requested state" so double-taps and stale UI never surface errors.

## JWT verification middleware (backend, optional)

`backend/app/core/clerk_jwt.py` — enabled by setting `CLERK_JWT_ISSUER` (e.g. `https://your-app.clerk.accounts.dev`):

- Requests with `Authorization: Bearer <jwt>` are verified (RS256 against the issuer's JWKS, cached ~1h with rotation refetch). The token's `sub` **replaces** any client-supplied `clerk-user-id` header / `clerk_user_id` query param, so all existing endpoints work unchanged but identity can no longer be spoofed alongside a valid token. Invalid tokens → 401.
- `CLERK_REQUIRE_JWT=true` additionally rejects raw identity claims without a token (turns off legacy trust-the-client mode).
- Unset issuer → middleware is a pass-through (fully backward compatible).
- New dependency: `pyjwt[crypto]` — run `poetry lock && poetry install` on the deploy machine.

## Remaining surface (not yet consumed by the app)

- `POST /sync_user/`, `POST/GET /sync_user/onboarding` — user provisioning after Clerk sign-up
- `PATCH /profile/me` — profile edit
- Projects: `POST /projects/`, `PATCH/DELETE /projects/{slug}`, `POST /projects/analyze-repo`, star (`POST/DELETE /projects/{slug}/star`), bookmark (`POST/DELETE /projects/{slug}/bookmark`), comment CRUD + `POST /projects/comments/{id}/vote`
- Live projects: create/update/delete, `GET /live-projects/{slug}/latest-commit`, journal CRUD, journal likes, journal comments
- `GET /dashboard`, `GET /dashboard/` — dashboard aggregates
- `GET /bookmarks/me`
- Follow: `POST/DELETE /users/{username}/follow`, `GET /users/{username}/follow-status`
- Changelog: `GET /changelog`, `GET /changelog/{slug}` (+ admin CRUD)
- `GET /app-notices/active`
- `POST /ideas`; `/support`, `/feedback`, `/admin` routers (under `app/api/v1`)
- Meta: `GET /`, `GET /health`

## Serialization notes

- Datetimes are **naive ISO strings** (no `Z`/offset) — treat as UTC.
- `GetComment.score` is a computed property (upvotes − downvotes) serialized as an int.
- Journal `code_snippets` is `list[str]` in the backend schema (the web TypeScript type disagrees; the backend wins).
- Media/upload flow: clients upload directly to Cloudinary; the backend stores URLs only — there is no upload endpoint.

## CORS

`backend/app/main.py` allowlists `localhost:3000` and `devmaniac.com` origins. Native clients are unaffected (no browser Origin), so the Android app needs no CORS accommodation.
