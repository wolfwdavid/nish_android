package com.devmaniac.app.ui.projectdetail

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.layout.imePadding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.BookmarkBorder
import androidx.compose.material.icons.outlined.StarBorder
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.TabRowDefaults
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.devmaniac.app.auth.AuthState
import com.devmaniac.app.data.dto.CommentDto
import com.devmaniac.app.data.dto.ProjectDto
import com.devmaniac.app.ui.common.UiState
import com.devmaniac.app.ui.common.containerViewModelFactory
import com.devmaniac.app.ui.common.relativeTime
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

private val tabs = listOf("Overview", "Gallery", "Updates", "Comments")

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProjectDetailScreen(
    slug: String,
    onBack: () -> Unit,
    onOpenUser: (String) -> Unit,
    viewModel: ProjectDetailViewModel = viewModel(
        key = "project-$slug",
        factory = containerViewModelFactory { ProjectDetailViewModel(it, slug) },
    ),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val authState by viewModel.authState.collectAsStateWithLifecycle()
    val canWrite = authState != AuthState.SignedOut
    var selectedTab by remember { mutableIntStateOf(0) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = (state as? UiState.Content)?.value?.project?.title ?: "Project",
                        style = MaterialTheme.typography.titleLarge,
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    val project = (state as? UiState.Content)?.value?.project
                    if (project != null && canWrite) {
                        IconButton(onClick = viewModel::toggleStar) {
                            Icon(
                                imageVector = if (project.is_starred) Icons.Filled.Star else Icons.Outlined.StarBorder,
                                contentDescription = if (project.is_starred) "Unstar" else "Star",
                                tint = if (project.is_starred) PrimaryBright else TextMuted,
                            )
                        }
                        IconButton(onClick = viewModel::toggleBookmark) {
                            Icon(
                                imageVector = if (project.is_bookmarked) Icons.Filled.Bookmark else Icons.Outlined.BookmarkBorder,
                                contentDescription = if (project.is_bookmarked) "Remove bookmark" else "Bookmark",
                                tint = if (project.is_bookmarked) PrimaryBright else TextMuted,
                            )
                        }
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
                Column(Modifier.padding(padding).fillMaxSize()) {
                    TabRow(
                        selectedTabIndex = selectedTab,
                        containerColor = Background,
                        contentColor = TextMuted,
                        indicator = { tabPositions ->
                            TabRowDefaults.SecondaryIndicator(
                                modifier = Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                                color = MaterialTheme.colorScheme.primary,
                            )
                        },
                    ) {
                        tabs.forEachIndexed { index, title ->
                            Tab(
                                selected = selectedTab == index,
                                onClick = { selectedTab = index },
                                text = { Text(title) },
                                selectedContentColor = PrimaryBright,
                                unselectedContentColor = TextFaint,
                            )
                        }
                    }
                    when (selectedTab) {
                        0 -> OverviewTab(current.value.project, onOpenUser)
                        1 -> GalleryTab(current.value.project)
                        2 -> UpdatesTab(current.value.project)
                        3 -> CommentsTab(
                            content = current.value,
                            canWrite = canWrite,
                            onAddComment = viewModel::addComment,
                            onVote = viewModel::vote,
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun OverviewTab(project: ProjectDto, onOpenUser: (String) -> Unit) {
    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        modifier = Modifier.fillMaxSize(),
    ) {
        project.thumbnail_url?.let { thumbnail ->
            item {
                AsyncImage(
                    model = thumbnail,
                    contentDescription = "${project.title} thumbnail",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(16f / 9f)
                        .clip(RoundedCornerShape(12.dp)),
                )
            }
        }
        item {
            Text(
                text = project.description,
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onBackground,
            )
        }
        item {
            Column(
                Modifier
                    .fillMaxWidth()
                    .background(SurfaceCard, RoundedCornerShape(12.dp))
                    .padding(14.dp),
            ) {
                Text("Tech stack", style = MaterialTheme.typography.titleSmall, color = TextMuted)
                TechChips(tech = project.tech_stack, modifier = Modifier.padding(top = 8.dp))
            }
        }
        item {
            Row(
                Modifier
                    .fillMaxWidth()
                    .background(SurfaceCard, RoundedCornerShape(12.dp))
                    .padding(14.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
            ) {
                Stat("Stars", project.stars_count)
                Stat("Views", project.views_count)
                Stat("Comments", project.comments_count)
            }
        }
        item {
            Row(
                Modifier
                    .fillMaxWidth()
                    .background(SurfaceCard, RoundedCornerShape(12.dp))
                    .clickable { onOpenUser(project.user.username) }
                    .padding(14.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                AsyncAvatar(url = project.user.avatar_url, name = project.user.username, size = 44.dp)
                Spacer(Modifier.width(12.dp))
                Column {
                    Text(
                        text = "@${project.user.username}",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onBackground,
                    )
                    project.user.location?.let {
                        Text(text = it, style = MaterialTheme.typography.bodySmall, color = TextFaint)
                    }
                }
            }
        }
        item {
            Column {
                Text(
                    text = "GitHub: ${project.github_url}",
                    style = MaterialTheme.typography.bodySmall,
                    color = PrimaryBright,
                )
                project.live_url?.let {
                    Text(
                        text = "Live: $it",
                        style = MaterialTheme.typography.bodySmall,
                        color = PrimaryBright,
                        modifier = Modifier.padding(top = 4.dp),
                    )
                }
            }
        }
    }
}

@Composable
private fun Stat(label: String, count: Int) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = "$count",
            style = MaterialTheme.typography.headlineSmall,
            color = MaterialTheme.colorScheme.onBackground,
        )
        Text(text = label, style = MaterialTheme.typography.labelMedium, color = TextFaint)
    }
}

@Composable
private fun GalleryTab(project: ProjectDto) {
    val images = listOfNotNull(project.thumbnail_url) + project.gallery_urls
    if (images.isEmpty()) {
        EmptyState("No images yet")
        return
    }
    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.fillMaxSize(),
    ) {
        items(images) { url ->
            AsyncImage(
                model = url,
                contentDescription = "Gallery image",
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(16f / 9f)
                    .clip(RoundedCornerShape(12.dp)),
            )
        }
    }
}

@Composable
private fun UpdatesTab(project: ProjectDto) {
    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.fillMaxSize(),
    ) {
        item {
            Column(
                Modifier
                    .fillMaxWidth()
                    .background(SurfaceCard, RoundedCornerShape(12.dp))
                    .padding(14.dp),
            ) {
                Text("Created", style = MaterialTheme.typography.labelMedium, color = TextFaint)
                Text(
                    text = relativeTime(project.created_at),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onBackground,
                )
                Text(
                    "Last updated",
                    style = MaterialTheme.typography.labelMedium,
                    color = TextFaint,
                    modifier = Modifier.padding(top = 10.dp),
                )
                Text(
                    text = relativeTime(project.updated_at),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onBackground,
                )
            }
        }
        item { EmptyState("Build updates land in the owner's live project journal") }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun CommentsTab(
    content: ProjectDetailContent,
    canWrite: Boolean,
    onAddComment: (text: String, parentId: String?) -> Unit,
    onVote: (commentId: String, voteType: String) -> Unit,
) {
    var draft by remember { mutableStateOf("") }
    var replyTo by remember { mutableStateOf<CommentDto?>(null) }

    Column(Modifier.fillMaxSize()) {
        if (content.comments.isEmpty()) {
            Column(Modifier.weight(1f)) { EmptyState("No comments yet — start the thread") }
        } else {
            LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.weight(1f),
            ) {
                content.comments.forEach { comment ->
                    item(key = comment.id) {
                        CommentItem(
                            comment = comment,
                            canWrite = canWrite,
                            onVote = onVote,
                            onReply = { replyTo = it },
                        )
                    }
                    items(comment.replies, key = { it.id }) { reply ->
                        CommentItem(reply, isReply = true, canWrite = canWrite, onVote = onVote)
                    }
                }
            }
        }

        if (canWrite) {
            Column(
                Modifier
                    .fillMaxWidth()
                    .background(SurfaceCard)
                    .padding(horizontal = 12.dp, vertical = 8.dp)
                    .imePadding(),
            ) {
                replyTo?.let { target ->
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "Replying to ${target.user.display_name}",
                            style = MaterialTheme.typography.labelMedium,
                            color = PrimaryBright,
                            modifier = Modifier.weight(1f),
                        )
                        IconButton(onClick = { replyTo = null }) {
                            Icon(
                                Icons.Filled.Close,
                                contentDescription = "Cancel reply",
                                tint = TextMuted,
                            )
                        }
                    }
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    OutlinedTextField(
                        value = draft,
                        onValueChange = { draft = it },
                        placeholder = {
                            Text(
                                text = if (replyTo == null) "Add a comment…" else "Write a reply…",
                                color = TextFaint,
                            )
                        },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = MaterialTheme.colorScheme.primary,
                            unfocusedBorderColor = Outline,
                            focusedTextColor = MaterialTheme.colorScheme.onBackground,
                            unfocusedTextColor = MaterialTheme.colorScheme.onBackground,
                            cursorColor = MaterialTheme.colorScheme.primary,
                        ),
                        maxLines = 4,
                        modifier = Modifier.weight(1f),
                    )
                    IconButton(
                        onClick = {
                            onAddComment(draft, replyTo?.id)
                            draft = ""
                            replyTo = null
                        },
                        enabled = draft.isNotBlank() && !content.postingComment,
                    ) {
                        Icon(
                            Icons.AutoMirrored.Filled.Send,
                            contentDescription = "Post comment",
                            tint = if (draft.isNotBlank()) PrimaryBright else TextFaint,
                        )
                    }
                }
            }
        }
    }
}
