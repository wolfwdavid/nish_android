package com.devmaniac.app.ui.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.devmaniac.app.BuildConfig
import com.devmaniac.app.auth.AuthState
import com.devmaniac.app.data.settings.SettingsSnapshot
import com.devmaniac.app.di.AppContainer
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class SettingsViewModel(private val container: AppContainer) : ViewModel() {

    val snapshot: StateFlow<SettingsSnapshot?> = container.settings.snapshots
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), null)

    val authState: StateFlow<AuthState> = container.authManager.state

    val clerkConfigured: Boolean = BuildConfig.CLERK_PUBLISHABLE_KEY.isNotEmpty()

    fun signOut() {
        viewModelScope.launch { container.authManager.signOut() }
    }

    fun setDemoMode(enabled: Boolean) {
        viewModelScope.launch { container.settings.setDemoMode(enabled) }
    }

    fun setBaseUrl(value: String) {
        viewModelScope.launch { container.settings.setBaseUrl(value) }
    }

    fun setDevClerkUserId(value: String?) {
        viewModelScope.launch { container.settings.setDevClerkUserId(value) }
    }
}
