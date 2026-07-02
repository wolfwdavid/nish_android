package com.devmaniac.app.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// Web uses Instrument Serif for display and JetBrains Mono for code; the closest
// zero-asset equivalents are the platform serif and monospace families.
val DisplayFamily = FontFamily.Serif
val CodeFamily = FontFamily.Monospace

val AppTypography = Typography(
    displayLarge = TextStyle(fontFamily = DisplayFamily, fontSize = 40.sp, lineHeight = 46.sp),
    displayMedium = TextStyle(fontFamily = DisplayFamily, fontSize = 32.sp, lineHeight = 38.sp),
    headlineLarge = TextStyle(fontFamily = DisplayFamily, fontSize = 28.sp, lineHeight = 34.sp),
    headlineMedium = TextStyle(fontFamily = DisplayFamily, fontSize = 24.sp, lineHeight = 30.sp),
    headlineSmall = TextStyle(fontFamily = DisplayFamily, fontSize = 20.sp, lineHeight = 26.sp),
    titleLarge = TextStyle(fontWeight = FontWeight.SemiBold, fontSize = 20.sp, lineHeight = 26.sp),
    titleMedium = TextStyle(fontWeight = FontWeight.SemiBold, fontSize = 16.sp, lineHeight = 22.sp),
    titleSmall = TextStyle(fontWeight = FontWeight.Medium, fontSize = 14.sp, lineHeight = 20.sp),
    bodyLarge = TextStyle(fontSize = 16.sp, lineHeight = 24.sp),
    bodyMedium = TextStyle(fontSize = 14.sp, lineHeight = 21.sp),
    bodySmall = TextStyle(fontSize = 12.sp, lineHeight = 17.sp),
    labelLarge = TextStyle(fontWeight = FontWeight.Medium, fontSize = 14.sp, lineHeight = 20.sp),
    labelMedium = TextStyle(fontWeight = FontWeight.Medium, fontSize = 12.sp, lineHeight = 16.sp),
    labelSmall = TextStyle(fontWeight = FontWeight.Medium, fontSize = 11.sp, lineHeight = 15.sp),
)
