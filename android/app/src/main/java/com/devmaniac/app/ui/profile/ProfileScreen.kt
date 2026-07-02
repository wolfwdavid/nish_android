package com.devmaniac.app.ui.profile

import androidx.compose.runtime.Composable
import com.devmaniac.app.ui.components.EmptyState

@Composable
fun ProfileScreen(
    username: String?,
    onOpenSettings: () -> Unit,
    onOpenProject: (String) -> Unit,
    onOpenLiveProject: (String) -> Unit,
) {
    EmptyState(message = "Profile coming soon")
}
