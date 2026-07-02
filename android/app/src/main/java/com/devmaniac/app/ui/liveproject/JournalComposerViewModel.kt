package com.devmaniac.app.ui.liveproject

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.devmaniac.app.data.dto.CreateJournalBody
import com.devmaniac.app.data.dto.ProblemSolutionDto
import com.devmaniac.app.di.AppContainer
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class ComposerUiState(
    val submitting: Boolean = false,
    val error: String? = null,
    val posted: Boolean = false,
)

class JournalComposerViewModel(
    private val container: AppContainer,
    private val slug: String,
) : ViewModel() {

    private val _state = MutableStateFlow(ComposerUiState())
    val state: StateFlow<ComposerUiState> = _state

    fun post(
        content: String,
        entryType: String,
        codeSnippet: String,
        problem: String,
        solution: String,
        progress: Int?,
    ) {
        if (content.isBlank()) {
            _state.value = ComposerUiState(error = "Write something about the session first")
            return
        }
        _state.value = ComposerUiState(submitting = true)
        viewModelScope.launch {
            try {
                container.repository().addJournal(
                    slug,
                    CreateJournalBody(
                        content = content.trim(),
                        entry_type = entryType,
                        code_snippets = codeSnippet.trim()
                            .takeIf { it.isNotEmpty() }?.let { listOf(it) } ?: emptyList(),
                        problem_solutions = if (problem.isNotBlank() && solution.isNotBlank()) {
                            listOf(ProblemSolutionDto(problem.trim(), solution.trim()))
                        } else {
                            emptyList()
                        },
                        progress_percentage = progress,
                    ),
                )
                _state.value = ComposerUiState(posted = true)
            } catch (e: Exception) {
                _state.value = ComposerUiState(error = e.message ?: "Failed to post entry")
            }
        }
    }
}
