package com.devmaniac.app.ui.projects

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.devmaniac.app.ui.common.UiState
import com.devmaniac.app.ui.common.containerViewModelFactory
import com.devmaniac.app.ui.components.EmptyState
import com.devmaniac.app.ui.components.ErrorState
import com.devmaniac.app.ui.components.LoadingState

@Composable
fun ProjectsScreen(
    onOpenProject: (String) -> Unit,
    onOpenUser: (String) -> Unit,
    viewModel: ProjectsViewModel = viewModel(factory = containerViewModelFactory { ProjectsViewModel(it) }),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    when (val current = state) {
        is UiState.Loading -> LoadingState()
        is UiState.Error -> ErrorState(message = current.message, onRetry = viewModel::load)
        is UiState.Content -> {
            val content = current.value
            if (content.projects.isEmpty()) {
                EmptyState("No projects yet")
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    item {
                        Text(
                            text = "Projects",
                            style = MaterialTheme.typography.headlineMedium,
                            color = MaterialTheme.colorScheme.onBackground,
                        )
                    }
                    items(content.projects, key = { it.id }) { project ->
                        ProjectCard(project = project, onOpen = onOpenProject, onOpenUser = onOpenUser)
                    }
                    if (content.hasMore) {
                        item {
                            Box(Modifier.fillMaxWidth().padding(8.dp), contentAlignment = Alignment.Center) {
                                if (content.loadingMore) {
                                    CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                                } else {
                                    TextButton(onClick = viewModel::loadMore) { Text("Load more") }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
