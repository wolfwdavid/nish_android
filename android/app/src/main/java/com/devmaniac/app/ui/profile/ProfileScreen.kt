package com.devmaniac.app.ui.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.devmaniac.app.data.dto.ProfileDto
import com.devmaniac.app.ui.common.UiState
import com.devmaniac.app.ui.common.containerViewModelFactory
import com.devmaniac.app.ui.components.AsyncAvatar
import com.devmaniac.app.ui.components.ErrorState
import com.devmaniac.app.ui.components.LoadingState
import com.devmaniac.app.ui.theme.PrimaryBright
import com.devmaniac.app.ui.theme.SurfaceCard
import com.devmaniac.app.ui.theme.TextFaint
import com.devmaniac.app.ui.theme.TextMuted

@Composable
fun ProfileScreen(
    username: String?,
    onOpenSettings: () -> Unit,
    viewModel: ProfileViewModel = viewModel(
        key = "profile-${username ?: "@me"}",
        factory = containerViewModelFactory { ProfileViewModel(it, username) },
    ),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    when (val current = state) {
        is UiState.Loading -> LoadingState()
        is UiState.Error -> ErrorState(message = current.message, onRetry = viewModel::load)
        is UiState.Content -> {
            val content = current.value
            val profile = content.profile
            if (profile == null) {
                NotSignedIn(onOpenSettings)
            } else {
                ProfileBody(
                    profile = profile,
                    showSettings = username == null,
                    onOpenSettings = onOpenSettings,
                    isFollowing = content.isFollowing,
                    followBusy = content.followBusy,
                    onToggleFollow = viewModel::toggleFollow,
                )
            }
        }
    }
}

@Composable
private fun NotSignedIn(onOpenSettings: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize().padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text(
            text = "You're not signed in",
            style = MaterialTheme.typography.headlineSmall,
            color = MaterialTheme.colorScheme.onBackground,
        )
        Text(
            text = "Set a dev user id in Settings to browse as a user, or turn on demo mode.",
            style = MaterialTheme.typography.bodyMedium,
            color = TextMuted,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(top = 8.dp, bottom = 16.dp),
        )
        Button(onClick = onOpenSettings) { Text("Open Settings") }
    }
}

@Composable
private fun ProfileBody(
    profile: ProfileDto,
    showSettings: Boolean,
    onOpenSettings: () -> Unit,
    isFollowing: Boolean?,
    followBusy: Boolean,
    onToggleFollow: () -> Unit,
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                AsyncAvatar(
                    url = profile.avatar_url,
                    name = profile.display_name ?: profile.username,
                    size = 72.dp,
                )
                Column(Modifier.padding(start = 14.dp).weight(1f)) {
                    Text(
                        text = profile.display_name ?: profile.username,
                        style = MaterialTheme.typography.headlineSmall,
                        color = MaterialTheme.colorScheme.onBackground,
                    )
                    Text(
                        text = "@${profile.username}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextFaint,
                    )
                    profile.location?.let {
                        Text(text = it, style = MaterialTheme.typography.bodySmall, color = TextFaint)
                    }
                }
                if (showSettings) {
                    IconButton(onClick = onOpenSettings) {
                        Icon(
                            Icons.Filled.Settings,
                            contentDescription = "Settings",
                            tint = TextMuted,
                        )
                    }
                }
            }
        }
        if (isFollowing != null) {
            item {
                Button(
                    onClick = onToggleFollow,
                    enabled = !followBusy,
                    colors = if (isFollowing) {
                        ButtonDefaults.buttonColors(
                            containerColor = SurfaceCard,
                            contentColor = TextMuted,
                        )
                    } else {
                        ButtonDefaults.buttonColors()
                    },
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text(if (isFollowing) "Following" else "Follow")
                }
            }
        }
        profile.bio?.takeIf { it.isNotBlank() }?.let { bio ->
            item {
                Text(
                    text = bio,
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onBackground,
                )
            }
        }
        profile.current_build?.takeIf { it.isNotBlank() }?.let { build ->
            item {
                Column(
                    Modifier
                        .fillMaxWidth()
                        .background(SurfaceCard, RoundedCornerShape(12.dp))
                        .padding(14.dp),
                ) {
                    Text("Currently building", style = MaterialTheme.typography.labelMedium, color = TextFaint)
                    Text(
                        text = build,
                        style = MaterialTheme.typography.titleMedium,
                        color = PrimaryBright,
                        modifier = Modifier.padding(top = 4.dp),
                    )
                }
            }
        }
        item {
            Row(
                Modifier
                    .fillMaxWidth()
                    .background(SurfaceCard, RoundedCornerShape(12.dp))
                    .padding(vertical = 14.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
            ) {
                ProfileStat("Followers", profile.followers_count)
                ProfileStat("Following", profile.following_count)
                ProfileStat("Projects", profile.project_count)
                ProfileStat("Reputation", profile.reputation_score)
            }
        }
        item {
            Column(
                Modifier
                    .fillMaxWidth()
                    .background(SurfaceCard, RoundedCornerShape(12.dp))
                    .padding(14.dp),
            ) {
                profile.github_url?.let { LinkRow("GitHub", it) }
                profile.linkedin_url?.let { LinkRow("LinkedIn", it) }
                profile.portfolio_url?.let { LinkRow("Portfolio", it) }
                profile.joined_date?.let {
                    Text(
                        text = "Joined $it",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextFaint,
                        modifier = Modifier.padding(top = 6.dp),
                    )
                }
            }
        }
    }
}

@Composable
private fun ProfileStat(label: String, count: Int) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = "$count",
            style = MaterialTheme.typography.titleLarge,
            color = MaterialTheme.colorScheme.onBackground,
        )
        Text(text = label, style = MaterialTheme.typography.labelMedium, color = TextFaint)
    }
}

@Composable
private fun LinkRow(label: String, url: String) {
    Box(Modifier.padding(vertical = 3.dp)) {
        Text(
            text = "$label: $url",
            style = MaterialTheme.typography.bodySmall,
            color = PrimaryBright,
        )
    }
}
