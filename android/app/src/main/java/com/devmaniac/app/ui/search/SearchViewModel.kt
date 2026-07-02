package com.devmaniac.app.ui.search

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.devmaniac.app.data.dto.SearchUserDto
import com.devmaniac.app.di.AppContainer
import com.devmaniac.app.ui.common.UiState
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.launch

class SearchViewModel(private val container: AppContainer) : ViewModel() {

    private val _query = MutableStateFlow("")
    val query: StateFlow<String> = _query

    private val _results = MutableStateFlow<UiState<List<SearchUserDto>>>(UiState.Content(emptyList()))
    val results: StateFlow<UiState<List<SearchUserDto>>> = _results

    init {
        observeQuery()
    }

    fun onQueryChange(value: String) {
        _query.value = value
    }

    @OptIn(FlowPreview::class)
    private fun observeQuery() {
        viewModelScope.launch {
            _query
                .debounce(300)
                .distinctUntilChanged()
                .collect { q ->
                    if (q.isBlank()) {
                        _results.value = UiState.Content(emptyList())
                        return@collect
                    }
                    _results.value = UiState.Loading
                    _results.value = try {
                        UiState.Content(container.repository().searchUsers(q))
                    } catch (e: Exception) {
                        UiState.Error(e.message ?: "Search failed")
                    }
                }
        }
    }
}
