package com.devmaniac.app.ui.projectdetail

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.devmaniac.app.data.dto.CommentDto
import com.devmaniac.app.data.dto.ProjectDto
import com.devmaniac.app.di.AppContainer
import com.devmaniac.app.ui.common.UiState
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class ProjectDetailContent(
    val project: ProjectDto,
    val comments: List<CommentDto>,
)

class ProjectDetailViewModel(
    private val container: AppContainer,
    private val slug: String,
) : ViewModel() {

    private val _state = MutableStateFlow<UiState<ProjectDetailContent>>(UiState.Loading)
    val state: StateFlow<UiState<ProjectDetailContent>> = _state

    init {
        load()
    }

    fun load() {
        _state.value = UiState.Loading
        viewModelScope.launch {
            _state.value = try {
                val repo = container.repository()
                val project = async { repo.project(slug) }
                val comments = async { repo.projectComments(slug) }
                UiState.Content(ProjectDetailContent(project.await(), comments.await()))
            } catch (e: Exception) {
                UiState.Error(e.message ?: "Failed to load project")
            }
        }
    }
}
