package com.devmaniac.app.ui.explore

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
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
fun ExploreScreen(
    onOpenLiveProject: (String) -> Unit,
    onOpenUser: (String) -> Unit,
    viewModel: ExploreViewModel = viewModel(factory = containerViewModelFactory { ExploreViewModel(it) }),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    when (val current = state) {
        is UiState.Loading -> LoadingState()
        is UiState.Error -> ErrorState(message = current.message, onRetry = viewModel::load)
        is UiState.Content -> {
            if (current.value.isEmpty()) {
                EmptyState("Nothing in the feed yet")
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    item {
                        Text(
                            text = "Explore",
                            style = MaterialTheme.typography.headlineMedium,
                            color = MaterialTheme.colorScheme.onBackground,
                        )
                    }
                    items(current.value, key = { it.id }) { event ->
                        FeedEventCard(
                            event = event,
                            onOpenLiveProject = onOpenLiveProject,
                            onOpenUser = onOpenUser,
                        )
                    }
                }
            }
        }
    }
}
