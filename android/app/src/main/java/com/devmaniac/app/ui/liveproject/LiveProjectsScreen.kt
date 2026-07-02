package com.devmaniac.app.ui.liveproject

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.devmaniac.app.data.dto.LiveProjectDto
import com.devmaniac.app.ui.common.UiState
import com.devmaniac.app.ui.common.containerViewModelFactory
import com.devmaniac.app.ui.components.AsyncAvatar
import com.devmaniac.app.ui.components.EmptyState
import com.devmaniac.app.ui.components.ErrorState
import com.devmaniac.app.ui.components.LoadingState
import com.devmaniac.app.ui.components.TechChips
import com.devmaniac.app.ui.theme.Outline
import com.devmaniac.app.ui.theme.PrimaryBright
import com.devmaniac.app.ui.theme.SurfaceCard
import com.devmaniac.app.ui.theme.TextFaint
import com.devmaniac.app.ui.theme.TextMuted

@Composable
fun LiveProjectsScreen(
    onOpenLiveProject: (String) -> Unit,
    onOpenUser: (String) -> Unit,
    viewModel: LiveProjectsViewModel = viewModel(factory = containerViewModelFactory { LiveProjectsViewModel(it) }),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    when (val current = state) {
        is UiState.Loading -> LoadingState()
        is UiState.Error -> ErrorState(message = current.message, onRetry = viewModel::load)
        is UiState.Content -> {
            if (current.value.isEmpty()) {
                EmptyState("No live projects yet")
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    item {
                        Text(
                            text = "Live builds",
                            style = MaterialTheme.typography.headlineMedium,
                            color = MaterialTheme.colorScheme.onBackground,
                        )
                    }
                    items(current.value, key = { it.id }) { project ->
                        LiveProjectCard(project, onOpenLiveProject, onOpenUser)
                    }
                }
            }
        }
    }
}

@Composable
private fun LiveProjectCard(
    project: LiveProjectDto,
    onOpen: (String) -> Unit,
    onOpenUser: (String) -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(SurfaceCard)
            .border(1.dp, Outline, RoundedCornerShape(12.dp))
            .clickable { onOpen(project.slug) }
            .padding(14.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            AsyncAvatar(
                url = project.user.avatar_url,
                name = project.user.display_name ?: project.user.username,
                size = 34.dp,
                modifier = Modifier.clickable { onOpenUser(project.user.username) },
            )
            Spacer(Modifier.width(10.dp))
            Column(Modifier.weight(1f)) {
                Text(
                    text = project.title,
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onBackground,
                )
                Text(
                    text = "@${project.user.username} · day ${project.days_count}",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextFaint,
                )
            }
            Text(
                text = project.status.uppercase(),
                style = MaterialTheme.typography.labelSmall,
                color = PrimaryBright,
            )
        }
        Text(
            text = project.goal,
            style = MaterialTheme.typography.bodyMedium,
            color = TextMuted,
            modifier = Modifier.padding(top = 8.dp),
        )
        LinearProgressIndicator(
            progress = { project.progress_percentage / 100f },
            color = MaterialTheme.colorScheme.primary,
            trackColor = Outline,
            modifier = Modifier
                .padding(top = 12.dp)
                .fillMaxWidth()
                .height(5.dp),
        )
        Row(modifier = Modifier.padding(top = 6.dp)) {
            Text(
                text = "${project.progress_percentage}%",
                style = MaterialTheme.typography.labelMedium,
                color = PrimaryBright,
            )
            Spacer(Modifier.weight(1f))
            Text(
                text = "${project.journal_count} journal entries",
                style = MaterialTheme.typography.labelMedium,
                color = TextFaint,
            )
        }
        TechChips(tech = project.tech_stack, maxItems = 4, modifier = Modifier.padding(top = 10.dp))
    }
}
