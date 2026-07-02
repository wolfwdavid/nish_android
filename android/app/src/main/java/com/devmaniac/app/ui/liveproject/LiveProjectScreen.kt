package com.devmaniac.app.ui.liveproject

import androidx.compose.runtime.Composable
import com.devmaniac.app.ui.components.EmptyState

@Composable
fun LiveProjectScreen(
    slug: String,
    onBack: () -> Unit,
    onOpenUser: (String) -> Unit,
) {
    EmptyState(message = "Live project $slug coming soon")
}
