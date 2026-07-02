package com.devmaniac.app.ui.projects

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.devmaniac.app.data.dto.ProjectDto
import com.devmaniac.app.di.AppContainer
import com.devmaniac.app.ui.common.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class ProjectsContent(
    val projects: List<ProjectDto>,
    val hasMore: Boolean,
    val loadingMore: Boolean = false,
)

class ProjectsViewModel(private val container: AppContainer) : ViewModel() {

    private val _state = MutableStateFlow<UiState<ProjectsContent>>(UiState.Loading)
    val state: StateFlow<UiState<ProjectsContent>> = _state

    private var nextCursor: String? = null

    init {
        load()
    }

    fun load() {
        _state.value = UiState.Loading
        viewModelScope.launch {
            _state.value = try {
                val page = container.repository().projects()
                nextCursor = page.next_cursor
                UiState.Content(ProjectsContent(page.items, page.has_more))
            } catch (e: Exception) {
                UiState.Error(e.message ?: "Failed to load projects")
            }
        }
    }

    fun loadMore() {
        val current = (_state.value as? UiState.Content)?.value ?: return
        if (!current.hasMore || current.loadingMore) return
        _state.value = UiState.Content(current.copy(loadingMore = true))
        viewModelScope.launch {
            try {
                val page = container.repository().projects(cursor = nextCursor)
                nextCursor = page.next_cursor
                _state.value = UiState.Content(
                    ProjectsContent(
                        projects = current.projects + page.items,
                        hasMore = page.has_more,
                    )
                )
            } catch (e: Exception) {
                // Keep what we have; just stop the load-more spinner.
                _state.value = UiState.Content(current.copy(loadingMore = false))
            }
        }
    }
}
