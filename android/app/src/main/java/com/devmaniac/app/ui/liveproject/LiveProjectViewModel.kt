package com.devmaniac.app.ui.liveproject

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
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
)

class LiveProjectViewModel(
    private val container: AppContainer,
    private val slug: String,
) : ViewModel() {

    private val _state = MutableStateFlow<UiState<LiveProjectContent>>(UiState.Loading)
    val state: StateFlow<UiState<LiveProjectContent>> = _state

    init {
        load()
    }

    fun load() {
        _state.value = UiState.Loading
        viewModelScope.launch {
            _state.value = try {
                val repo = container.repository()
                val project = async { repo.liveProject(slug) }
                val journals = async { repo.journals(slug) }
                UiState.Content(
                    LiveProjectContent(
                        project = project.await(),
                        // Newest first, like the web timeline.
                        journals = journals.await().sortedByDescending { it.day_number },
                    )
                )
            } catch (e: Exception) {
                UiState.Error(e.message ?: "Failed to load live project")
            }
        }
    }
}
