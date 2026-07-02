package com.devmaniac.app.ui.liveproject

import androidx.compose.runtime.Composable
import com.devmaniac.app.ui.components.EmptyState

@Composable
fun LiveProjectsScreen(
    onOpenLiveProject: (String) -> Unit,
    onOpenUser: (String) -> Unit,
) {
    EmptyState(message = "Live projects coming soon")
}
