package com.devmaniac.app.auth

import com.clerk.api.Clerk
import com.clerk.api.network.serialization.ClerkResult
import com.devmaniac.app.data.settings.AppSettings
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

sealed interface AuthState {
    data object SignedOut : AuthState
    data class DevUser(val clerkUserId: String) : AuthState
    data class ClerkUser(val clerkUserId: String, val email: String?) : AuthState
}

/**
 * Single source of truth for "who is making requests".
 *
 * Priority: a signed-in Clerk session wins; otherwise demo mode acts as the
 * bundled demo builder; otherwise the Settings dev user id; otherwise
 * signed out. All Clerk SDK symbols are confined to this file (plus the
 * sign-in ViewModel) so the rest of the app only sees [AuthState].
 */
class AuthManager(
    settings: AppSettings,
    scope: CoroutineScope,
    private val clerkEnabled: Boolean,
) {

    companion object {
        // clerk_user_id of the bundled demo profile (assets/fixtures/profile_nishchal.json).
        const val DEMO_CLERK_USER_ID = "user_demo_nishchal"
    }

    private val clerkUser: StateFlow<ClerkUserInfo?> =
        if (clerkEnabled) {
            val flow = MutableStateFlow<ClerkUserInfo?>(null)
            scope.launch {
                Clerk.userFlow.collect { user ->
                    flow.value = user?.let {
                        ClerkUserInfo(
                            id = it.id,
                            email = it.emailAddresses?.firstOrNull()?.emailAddress,
                            displayName = it.firstName ?: it.username,
                            avatarUrl = it.imageUrl,
                        )
                    }
                }
            }
            flow
        } else {
            MutableStateFlow(null)
        }

    val state: StateFlow<AuthState> =
        combine(clerkUser, settings.snapshots) { clerk, snapshot ->
            when {
                clerk != null -> AuthState.ClerkUser(clerk.id, clerk.email)
                snapshot.demoMode -> AuthState.DevUser(DEMO_CLERK_USER_ID)
                snapshot.devClerkUserId != null -> AuthState.DevUser(snapshot.devClerkUserId)
                else -> AuthState.SignedOut
            }
        }.stateIn(scope, SharingStarted.Eagerly, AuthState.SignedOut)

    fun currentClerkUserId(): String? = when (val current = state.value) {
        is AuthState.ClerkUser -> current.clerkUserId
        is AuthState.DevUser -> current.clerkUserId
        AuthState.SignedOut -> null
    }

    fun currentClerkUser(): ClerkUserInfo? =
        if (clerkEnabled) clerkUser.value else null

    /** Session JWT for Authorization: Bearer. Clerk caches and refreshes it. */
    suspend fun bearerToken(): String? {
        if (!clerkEnabled || clerkUser.value == null) return null
        return when (val result = Clerk.auth.getToken()) {
            is ClerkResult.Success -> result.value
            is ClerkResult.Failure -> null
        }
    }

    /** Email+password sign-in through Clerk. Returns an error message or null. */
    suspend fun signIn(email: String, password: String): String? {
        if (!clerkEnabled) return "Clerk is not configured for this build"
        return when (val result = Clerk.auth.signInWithPassword {
            identifier = email
            this.password = password
        }) {
            is ClerkResult.Success -> null
            is ClerkResult.Failure -> result.error?.toString() ?: "Sign-in failed"
        }
    }

    suspend fun signOut(): String? {
        if (!clerkEnabled) return null
        return when (val result = Clerk.auth.signOut()) {
            is ClerkResult.Success -> null
            is ClerkResult.Failure -> result.error?.toString() ?: "Sign-out failed"
        }
    }
}

data class ClerkUserInfo(
    val id: String,
    val email: String?,
    val displayName: String?,
    val avatarUrl: String?,
)
