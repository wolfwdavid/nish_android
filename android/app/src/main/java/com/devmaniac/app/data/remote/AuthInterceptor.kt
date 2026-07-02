package com.devmaniac.app.data.remote

import com.devmaniac.app.auth.AuthManager
import com.devmaniac.app.auth.AuthState
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response

/**
 * Attaches the caller's identity to every request.
 *
 * - Clerk session: `Authorization: Bearer <session JWT>` (verified by the
 *   backend when CLERK_JWT_ISSUER is configured) plus the legacy
 *   `clerk-user-id` header for backends without JWT verification.
 * - Dev user: `clerk-user-id` header only (the backend's trust-the-client
 *   dev mode; see backend/app/core/auth.py).
 *
 * runBlocking is safe here: Retrofit suspend calls run interceptors on
 * OkHttp dispatcher threads, and Clerk caches the session token so this is
 * almost always a cache hit.
 */
class AuthInterceptor(private val auth: AuthManager) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val builder = chain.request().newBuilder()
        when (val state = auth.state.value) {
            is AuthState.ClerkUser -> {
                runBlocking { auth.bearerToken() }?.let { jwt ->
                    builder.header("Authorization", "Bearer $jwt")
                }
                builder.header("clerk-user-id", state.clerkUserId)
            }
            is AuthState.DevUser -> builder.header("clerk-user-id", state.clerkUserId)
            AuthState.SignedOut -> Unit
        }
        return chain.proceed(builder.build())
    }
}
