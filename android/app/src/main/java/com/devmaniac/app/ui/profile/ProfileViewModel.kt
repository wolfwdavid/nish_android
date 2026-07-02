package com.devmaniac.app.ui.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.devmaniac.app.data.dto.ProfileDto
import com.devmaniac.app.di.AppContainer
import com.devmaniac.app.ui.common.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

/** Profile state: null profile in Content means "not signed in" (own-profile tab only). */
class ProfileViewModel(
    private val container: AppContainer,
    private val username: String?,
) : ViewModel() {

    private val _state = MutableStateFlow<UiState<ProfileDto?>>(UiState.Loading)
    val state: StateFlow<UiState<ProfileDto?>> = _state

    init {
        load()
    }

    fun load() {
        _state.value = UiState.Loading
        viewModelScope.launch {
            _state.value = try {
                val repo = container.repository()
                val profile = if (username == null) repo.myProfile() else repo.profile(username)
                UiState.Content(profile)
            } catch (e: Exception) {
                UiState.Error(e.message ?: "Failed to load profile")
            }
        }
    }
}
