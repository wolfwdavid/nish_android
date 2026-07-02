package com.devmaniac.app.ui.projectdetail

import androidx.compose.runtime.Composable
import com.devmaniac.app.ui.components.EmptyState

@Composable
fun ProjectDetailScreen(
    slug: String,
    onBack: () -> Unit,
    onOpenUser: (String) -> Unit,
) {
    EmptyState(message = "Project $slug coming soon")
}
