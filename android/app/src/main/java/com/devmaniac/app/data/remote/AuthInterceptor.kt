package com.devmaniac.app.data.remote

import okhttp3.Interceptor
import okhttp3.Response

/**
 * The backend identifies callers by a raw `clerk-user-id` header
 * (see backend/app/core/auth.py) — there is no server-side token
 * verification. This is a dev-grade mechanism; a production release
 * needs the Clerk Android SDK plus backend JWT verification.
 */
class AuthInterceptor(private val clerkUserId: () -> String?) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val userId = clerkUserId()
        val request = if (userId.isNullOrBlank()) {
            chain.request()
        } else {
            chain.request().newBuilder()
                .header("clerk-user-id", userId)
                .build()
        }
        return chain.proceed(request)
    }
}
