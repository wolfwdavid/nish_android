package com.devmaniac.app.ui.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.devmaniac.app.auth.AuthState
import com.devmaniac.app.di.AppContainer
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class SignInUiState(
    val submitting: Boolean = false,
    val error: String? = null,
    val signedIn: Boolean = false,
)

class SignInViewModel(private val container: AppContainer) : ViewModel() {

    private val _state = MutableStateFlow(SignInUiState())
    val state: StateFlow<SignInUiState> = _state

    fun signIn(email: String, password: String) {
        if (email.isBlank() || password.isBlank()) {
            _state.value = SignInUiState(error = "Email and password are required")
            return
        }
        _state.value = SignInUiState(submitting = true)
        viewModelScope.launch {
            val error = container.authManager.signIn(email.trim(), password)
            if (error != null) {
                _state.value = SignInUiState(error = error)
                return@launch
            }
            // Provision the user row so the backend can resolve this identity.
            val clerkUser = container.authManager.currentClerkUser()
            if (clerkUser?.email != null) {
                runCatching {
                    container.repository().syncUser(
                        clerkUserId = clerkUser.id,
                        email = clerkUser.email,
                        displayName = clerkUser.displayName,
                        avatarUrl = clerkUser.avatarUrl,
                    )
                }
            }
            _state.value = SignInUiState(signedIn = true)
        }
    }

    fun isClerkSession(): Boolean = container.authManager.state.value is AuthState.ClerkUser
}
