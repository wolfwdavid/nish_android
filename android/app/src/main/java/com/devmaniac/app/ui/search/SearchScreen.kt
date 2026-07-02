package com.devmaniac.app.ui.search

import androidx.compose.runtime.Composable
import com.devmaniac.app.ui.components.EmptyState

@Composable
fun SearchScreen(
    onOpenUser: (String) -> Unit,
) {
    EmptyState(message = "Search coming soon")
}
