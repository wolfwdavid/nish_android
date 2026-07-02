package com.devmaniac.app.ui.projectdetail

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.devmaniac.app.auth.AuthState
import com.devmaniac.app.data.dto.CommentDto
import com.devmaniac.app.data.dto.ProjectDto
import com.devmaniac.app.di.AppContainer
import com.devmaniac.app.ui.common.UiState
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class ProjectDetailContent(
    val project: ProjectDto,
    val comments: List<CommentDto>,
    val postingComment: Boolean = false,
)

class ProjectDetailViewModel(
    private val container: AppContainer,
    private val slug: String,
) : ViewModel() {

    private val _state = MutableStateFlow<UiState<ProjectDetailContent>>(UiState.Loading)
    val state: StateFlow<UiState<ProjectDetailContent>> = _state

    val authState: StateFlow<AuthState> = container.authManager.state

    init {
        load()
    }

    fun load() {
        _state.value = UiState.Loading
        viewModelScope.launch {
            _state.value = try {
                val repo = container.repository()
                // coroutineScope contains async child failures so the catch
                // below sees them instead of the app-level crash handler.
                val content = coroutineScope {
                    val project = async { repo.project(slug) }
                    val comments = async { repo.projectComments(slug) }
                    ProjectDetailContent(project.await(), comments.await())
                }
                UiState.Content(content)
            } catch (e: Exception) {
                UiState.Error(e.message ?: "Failed to load project")
            }
        }
    }

    private fun content(): ProjectDetailContent? = (_state.value as? UiState.Content)?.value

    private fun update(transform: (ProjectDetailContent) -> ProjectDetailContent) {
        val current = content() ?: return
        _state.value = UiState.Content(transform(current))
    }

    fun toggleStar() {
        val current = content() ?: return
        val desired = !current.project.is_starred
        // Optimistic flip; the response carries the authoritative count.
        update {
            it.copy(
                project = it.project.copy(
                    is_starred = desired,
                    stars_count = (it.project.stars_count + if (desired) 1 else -1).coerceAtLeast(0),
                )
            )
        }
        viewModelScope.launch {
            try {
                val updated = container.repository().setStar(slug, desired)
                update { it.copy(project = updated) }
            } catch (e: Exception) {
                update { it.copy(project = current.project) }
            }
        }
    }

    fun toggleBookmark() {
        val current = content() ?: return
        val desired = !current.project.is_bookmarked
        update { it.copy(project = it.project.copy(is_bookmarked = desired)) }
        viewModelScope.launch {
            try {
                container.repository().setBookmark(slug, desired)
            } catch (e: Exception) {
                update { it.copy(project = it.project.copy(is_bookmarked = !desired)) }
            }
        }
    }

    fun addComment(text: String, parentId: String?) {
        if (text.isBlank()) return
        update { it.copy(postingComment = true) }
        viewModelScope.launch {
            try {
                val repo = container.repository()
                repo.addComment(slug, text.trim(), parentId)
                val comments = repo.projectComments(slug)
                update {
                    it.copy(
                        comments = comments,
                        postingComment = false,
                        project = it.project.copy(comments_count = it.project.comments_count + 1),
                    )
                }
            } catch (e: Exception) {
                update { it.copy(postingComment = false) }
            }
        }
    }

    fun vote(commentId: String, voteType: String) {
        viewModelScope.launch {
            try {
                val repo = container.repository()
                repo.voteComment(commentId, voteType)
                // Refresh: vote semantics are toggle/switch server-side, so the
                // list re-read is the simplest correct reconciliation.
                val comments = repo.projectComments(slug)
                update { it.copy(comments = comments) }
            } catch (e: Exception) {
                // Leave state as-is; the next load reconciles.
            }
        }
    }
}
