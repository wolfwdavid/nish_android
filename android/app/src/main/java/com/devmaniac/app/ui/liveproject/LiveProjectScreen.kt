package com.devmaniac.app.ui.liveproject

import androidx.compose.foundation.background
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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
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
import com.devmaniac.app.ui.theme.Background
import com.devmaniac.app.ui.theme.Outline
import com.devmaniac.app.ui.theme.PrimaryBright
import com.devmaniac.app.ui.theme.SurfaceCard
import com.devmaniac.app.ui.theme.TextFaint
import com.devmaniac.app.ui.theme.TextMuted

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LiveProjectScreen(
    slug: String,
    onBack: () -> Unit,
    onOpenUser: (String) -> Unit,
    onComposeEntry: (String) -> Unit,
    refreshSignal: Boolean = false,
    onRefreshConsumed: () -> Unit = {},
    viewModel: LiveProjectViewModel = viewModel(
        key = "live-$slug",
        factory = containerViewModelFactory { LiveProjectViewModel(it, slug) },
    ),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    androidx.compose.runtime.LaunchedEffect(refreshSignal) {
        if (refreshSignal) {
            viewModel.load()
            onRefreshConsumed()
        }
    }
    val authState by viewModel.authState.collectAsStateWithLifecycle()
    val canWrite = authState != com.devmaniac.app.auth.AuthState.SignedOut

    Scaffold(
        floatingActionButton = {
            val content = (state as? UiState.Content)?.value
            if (content?.isOwner == true && canWrite) {
                FloatingActionButton(
                    onClick = { onComposeEntry(slug) },
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = MaterialTheme.colorScheme.onPrimary,
                ) {
                    Icon(Icons.Filled.Add, contentDescription = "Add journal entry")
                }
            }
        },
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = (state as? UiState.Content)?.value?.project?.title ?: "Live build",
                        style = MaterialTheme.typography.titleLarge,
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Background,
                    titleContentColor = MaterialTheme.colorScheme.onBackground,
                    navigationIconContentColor = MaterialTheme.colorScheme.onBackground,
                ),
            )
        },
        containerColor = Background,
    ) { padding ->
        when (val current = state) {
            is UiState.Loading -> LoadingState(Modifier.padding(padding))
            is UiState.Error -> ErrorState(
                message = current.message,
                onRetry = viewModel::load,
                modifier = Modifier.padding(padding),
            )
            is UiState.Content -> {
                LazyColumn(
                    modifier = Modifier.padding(padding).fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    item { LiveProjectHero(current.value.project, onOpenUser) }
                    item {
                        Text(
                            text = "Build journal",
                            style = MaterialTheme.typography.headlineSmall,
                            color = MaterialTheme.colorScheme.onBackground,
                            modifier = Modifier.padding(top = 4.dp),
                        )
                    }
                    if (current.value.journals.isEmpty()) {
                        item { EmptyState("No journal entries yet") }
                    } else {
                        items(current.value.journals, key = { it.id }) { entry ->
                            JournalEntryCard(
                                entry = entry,
                                liked = entry.id in current.value.likedJournalIds,
                                onToggleLike = if (canWrite) {
                                    { viewModel.toggleLike(entry.id) }
                                } else {
                                    null
                                },
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun LiveProjectHero(project: LiveProjectDto, onOpenUser: (String) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(SurfaceCard, RoundedCornerShape(12.dp))
            .padding(16.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            AsyncAvatar(
                url = project.user.avatar_url,
                name = project.user.display_name ?: project.user.username,
                size = 42.dp,
                modifier = Modifier.clickable { onOpenUser(project.user.username) },
            )
            Spacer(Modifier.width(12.dp))
            Column(Modifier.weight(1f)) {
                Text(
                    text = project.user.display_name ?: project.user.username,
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier.clickable { onOpenUser(project.user.username) },
                )
                Text(
                    text = "@${project.user.username}",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextFaint,
                )
            }
            Text(
                text = project.status.uppercase(),
                style = MaterialTheme.typography.labelMedium,
                color = PrimaryBright,
            )
        }

        Text(
            text = project.goal,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onBackground,
            modifier = Modifier.padding(top = 12.dp),
        )
        project.description?.takeIf { it.isNotBlank() }?.let {
            Text(
                text = it,
                style = MaterialTheme.typography.bodyMedium,
                color = TextMuted,
                modifier = Modifier.padding(top = 6.dp),
            )
        }

        LinearProgressIndicator(
            progress = { project.progress_percentage / 100f },
            color = MaterialTheme.colorScheme.primary,
            trackColor = Outline,
            modifier = Modifier
                .padding(top = 14.dp)
                .fillMaxWidth()
                .height(6.dp),
        )
        Row(modifier = Modifier.padding(top = 6.dp)) {
            Text(
                text = "${project.progress_percentage}% · day ${project.days_count}",
                style = MaterialTheme.typography.labelMedium,
                color = PrimaryBright,
            )
            Spacer(Modifier.weight(1f))
            Text(
                text = "${project.views_count} views",
                style = MaterialTheme.typography.labelMedium,
                color = TextFaint,
            )
        }

        project.current_goal?.takeIf { it.isNotBlank() }?.let {
            Text(
                text = "Now: $it",
                style = MaterialTheme.typography.bodySmall,
                color = TextMuted,
                modifier = Modifier.padding(top = 10.dp),
            )
        }
        TechChips(tech = project.tech_stack, modifier = Modifier.padding(top = 10.dp))
    }
}
