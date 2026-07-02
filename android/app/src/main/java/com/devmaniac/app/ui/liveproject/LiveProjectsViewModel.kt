package com.devmaniac.app.ui.liveproject

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.devmaniac.app.data.dto.LiveProjectDto
import com.devmaniac.app.di.AppContainer
import com.devmaniac.app.ui.common.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class LiveProjectsViewModel(private val container: AppContainer) : ViewModel() {

    private val _state = MutableStateFlow<UiState<List<LiveProjectDto>>>(UiState.Loading)
    val state: StateFlow<UiState<List<LiveProjectDto>>> = _state

    init {
        load()
    }

    fun load() {
        _state.value = UiState.Loading
        viewModelScope.launch {
            _state.value = try {
                UiState.Content(container.repository().liveProjects())
            } catch (e: Exception) {
                UiState.Error(e.message ?: "Failed to load live projects")
            }
        }
    }
}
