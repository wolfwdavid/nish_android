package com.devmaniac.app.ui.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.devmaniac.app.auth.AuthState
import com.devmaniac.app.data.dto.ProfileDto
import com.devmaniac.app.di.AppContainer
import com.devmaniac.app.ui.common.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class ProfileContent(
    val profile: ProfileDto?,
    // Only set for other users' profiles while signed in.
    val isFollowing: Boolean? = null,
    val isSelf: Boolean = false,
    val followBusy: Boolean = false,
)

class ProfileViewModel(
    private val container: AppContainer,
    private val username: String?,
) : ViewModel() {

    private val _state = MutableStateFlow<UiState<ProfileContent>>(UiState.Loading)
    val state: StateFlow<UiState<ProfileContent>> = _state

    val authState: StateFlow<AuthState> = container.authManager.state

    init {
        load()
    }

    fun load() {
        _state.value = UiState.Loading
        viewModelScope.launch {
            _state.value = try {
                val repo = container.repository()
                if (username == null) {
                    UiState.Content(ProfileContent(profile = repo.myProfile(), isSelf = true))
                } else {
                    val profile = repo.profile(username)
                    val me = runCatching { repo.myProfile() }.getOrNull()
                    val isSelf = me?.id == profile.id
                    val canFollow = !isSelf && authState.value != AuthState.SignedOut
                    val following = if (canFollow) {
                        runCatching { repo.followStatus(username).is_following }.getOrNull()
                    } else {
                        null
                    }
                    UiState.Content(ProfileContent(profile = profile, isFollowing = following, isSelf = isSelf))
                }
            } catch (e: Exception) {
                UiState.Error(e.message ?: "Failed to load profile")
            }
        }
    }

    fun toggleFollow() {
        val current = (_state.value as? UiState.Content)?.value ?: return
        val target = username ?: return
        val following = current.isFollowing ?: return
        if (current.followBusy) return

        _state.value = UiState.Content(current.copy(followBusy = true, isFollowing = !following))
        viewModelScope.launch {
            try {
                val repo = container.repository()
                val status = repo.setFollow(target, !following)
                // Refetch the profile: some deployments return wrong counts
                // from the follow endpoint itself.
                val profile = repo.profile(target)
                _state.value = UiState.Content(
                    ProfileContent(
                        profile = profile,
                        isFollowing = status.is_following,
                        isSelf = current.isSelf,
                    )
                )
            } catch (e: Exception) {
                _state.value = UiState.Content(current.copy(followBusy = false))
            }
        }
    }
}
