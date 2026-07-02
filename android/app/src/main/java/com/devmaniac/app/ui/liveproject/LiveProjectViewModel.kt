package com.devmaniac.app.ui.liveproject

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.devmaniac.app.auth.AuthState
import com.devmaniac.app.data.dto.JournalDto
import com.devmaniac.app.data.dto.LiveProjectDto
import com.devmaniac.app.di.AppContainer
import com.devmaniac.app.ui.common.UiState
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class LiveProjectContent(
    val project: LiveProjectDto,
    val journals: List<JournalDto>,
    val isOwner: Boolean = false,
    // The journals endpoint carries no per-user like flag, so liked state is
    // session-local and reconciled through the like responses.
    val likedJournalIds: Set<String> = emptySet(),
)

class LiveProjectViewModel(
    private val container: AppContainer,
    private val slug: String,
) : ViewModel() {

    private val _state = MutableStateFlow<UiState<LiveProjectContent>>(UiState.Loading)
    val state: StateFlow<UiState<LiveProjectContent>> = _state

    val authState: StateFlow<AuthState> = container.authManager.state

    init {
        load()
    }

    fun load() {
        val previousLikes = (_state.value as? UiState.Content)?.value?.likedJournalIds ?: emptySet()
        _state.value = UiState.Loading
        viewModelScope.launch {
            _state.value = try {
                val repo = container.repository()
                val project = async { repo.liveProject(slug) }
                val journals = async { repo.journals(slug) }
                val myProfile = async { runCatching { repo.myProfile() }.getOrNull() }
                val loadedProject = project.await()
                UiState.Content(
                    LiveProjectContent(
                        project = loadedProject,
                        // Newest first, like the web timeline.
                        journals = journals.await().sortedByDescending { it.day_number },
                        isOwner = myProfile.await()?.id == loadedProject.user_id,
                        likedJournalIds = previousLikes,
                    )
                )
            } catch (e: Exception) {
                UiState.Error(e.message ?: "Failed to load live project")
            }
        }
    }

    fun toggleLike(journalId: String) {
        val current = (_state.value as? UiState.Content)?.value ?: return
        val desired = journalId !in current.likedJournalIds

        fun apply(content: LiveProjectContent, liked: Boolean, countOverride: Int?): LiveProjectContent {
            val likedIds = if (liked) content.likedJournalIds + journalId else content.likedJournalIds - journalId
            return content.copy(
                likedJournalIds = likedIds,
                journals = content.journals.map { entry ->
                    if (entry.id != journalId) {
                        entry
                    } else {
                        val fallback = (entry.likes_count + if (liked) 1 else -1).coerceAtLeast(0)
                        entry.copy(likes_count = countOverride ?: fallback)
                    }
                },
            )
        }

        _state.value = UiState.Content(apply(current, desired, countOverride = null))
        viewModelScope.launch {
            try {
                val result = container.repository().setJournalLike(journalId, desired)
                if (result.likes_count >= 0) {
                    val latest = (_state.value as? UiState.Content)?.value ?: return@launch
                    _state.value = UiState.Content(apply(latest, desired, countOverride = result.likes_count))
                }
            } catch (e: Exception) {
                val latest = (_state.value as? UiState.Content)?.value ?: return@launch
                _state.value = UiState.Content(apply(latest, !desired, countOverride = null))
            }
        }
    }
}
