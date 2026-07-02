package com.devmaniac.app.ui.explore

import androidx.compose.runtime.Composable
import com.devmaniac.app.ui.components.EmptyState

@Composable
fun ExploreScreen(
    onOpenLiveProject: (String) -> Unit,
    onOpenUser: (String) -> Unit,
) {
    EmptyState(message = "Explore feed coming soon")
}
