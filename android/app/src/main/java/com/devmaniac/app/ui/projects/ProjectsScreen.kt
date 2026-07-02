package com.devmaniac.app.ui.projects

import androidx.compose.runtime.Composable
import com.devmaniac.app.ui.components.EmptyState

@Composable
fun ProjectsScreen(
    onOpenProject: (String) -> Unit,
    onOpenUser: (String) -> Unit,
) {
    EmptyState(message = "Projects coming soon")
}
