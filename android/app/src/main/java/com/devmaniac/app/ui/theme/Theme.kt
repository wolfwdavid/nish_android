package com.devmaniac.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkScheme = darkColorScheme(
    primary = Primary,
    onPrimary = OnPrimary,
    primaryContainer = SurfaceElevated,
    onPrimaryContainer = PrimaryBright,
    secondary = PrimaryBright,
    onSecondary = OnPrimary,
    background = Background,
    onBackground = TextPrimary,
    surface = Background,
    onSurface = TextPrimary,
    surfaceVariant = SurfaceCard,
    onSurfaceVariant = TextMuted,
    surfaceContainer = SurfaceCard,
    surfaceContainerHigh = SurfaceElevated,
    surfaceContainerLow = Surface,
    outline = Outline,
    outlineVariant = Outline,
    error = Danger,
)

@Composable
fun DevManiacTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkScheme,
        typography = AppTypography,
        content = content,
    )
}
