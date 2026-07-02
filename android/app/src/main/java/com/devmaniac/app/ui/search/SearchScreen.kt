package com.devmaniac.app.ui.search

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.devmaniac.app.data.dto.SearchUserDto
import com.devmaniac.app.ui.common.UiState
import com.devmaniac.app.ui.common.containerViewModelFactory
import com.devmaniac.app.ui.components.AsyncAvatar
import com.devmaniac.app.ui.components.EmptyState
import com.devmaniac.app.ui.components.ErrorState
import com.devmaniac.app.ui.components.LoadingState
import com.devmaniac.app.ui.theme.Outline
import com.devmaniac.app.ui.theme.PrimaryBright
import com.devmaniac.app.ui.theme.SurfaceCard
import com.devmaniac.app.ui.theme.TextFaint
import com.devmaniac.app.ui.theme.TextMuted

@Composable
fun SearchScreen(
    onOpenUser: (String) -> Unit,
    viewModel: SearchViewModel = viewModel(factory = containerViewModelFactory { SearchViewModel(it) }),
) {
    val query by viewModel.query.collectAsStateWithLifecycle()
    val results by viewModel.results.collectAsStateWithLifecycle()

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text(
            text = "Search",
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.onBackground,
        )
        OutlinedTextField(
            value = query,
            onValueChange = viewModel::onQueryChange,
            placeholder = { Text("Search builders…", color = TextFaint) },
            leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null, tint = TextFaint) },
            singleLine = true,
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = Outline,
                focusedTextColor = MaterialTheme.colorScheme.onBackground,
                unfocusedTextColor = MaterialTheme.colorScheme.onBackground,
                cursorColor = MaterialTheme.colorScheme.primary,
            ),
            modifier = Modifier.fillMaxWidth().padding(top = 12.dp),
        )

        when (val current = results) {
            is UiState.Loading -> LoadingState()
            is UiState.Error -> ErrorState(message = current.message)
            is UiState.Content -> {
                if (current.value.isEmpty()) {
                    if (query.isBlank()) {
                        EmptyState("Find builders by username or name")
                    } else {
                        EmptyState("No builders match \"$query\"")
                    }
                } else {
                    LazyColumn(
                        contentPadding = PaddingValues(vertical = 12.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        items(current.value, key = { it.id }) { user ->
                            SearchResultRow(user, onOpenUser)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SearchResultRow(user: SearchUserDto, onOpenUser: (String) -> Unit) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .fillMaxWidth()
            .background(SurfaceCard, RoundedCornerShape(12.dp))
            .clickable { onOpenUser(user.username) }
            .padding(12.dp),
    ) {
        AsyncAvatar(url = user.avatar_url, name = user.display_name ?: user.username, size = 44.dp)
        Column(Modifier.padding(start = 12.dp).weight(1f)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = user.display_name ?: user.username,
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onBackground,
                )
                if (user.is_verified) {
                    Spacer(Modifier.width(4.dp))
                    Icon(
                        Icons.Filled.Verified,
                        contentDescription = "Verified",
                        tint = PrimaryBright,
                        modifier = Modifier.width(16.dp),
                    )
                }
            }
            Text(text = "@${user.username}", style = MaterialTheme.typography.bodySmall, color = TextFaint)
            user.bio?.takeIf { it.isNotBlank() }?.let {
                Text(
                    text = it,
                    style = MaterialTheme.typography.bodySmall,
                    color = TextMuted,
                    maxLines = 1,
                )
            }
        }
        Text(
            text = "${user.followers_count} followers",
            style = MaterialTheme.typography.labelSmall,
            color = TextFaint,
        )
    }
}
