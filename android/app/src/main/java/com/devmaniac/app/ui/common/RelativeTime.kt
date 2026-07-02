package com.devmaniac.app.ui.common

import java.time.Duration
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter

/**
 * The backend emits naive ISO datetimes (no timezone suffix); treat them as
 * UTC and fall back to the raw string if parsing fails.
 */
fun relativeTime(isoTimestamp: String, now: OffsetDateTime = OffsetDateTime.now(ZoneOffset.UTC)): String {
    val instant = runCatching {
        OffsetDateTime.parse(isoTimestamp)
    }.getOrElse {
        runCatching {
            LocalDateTime.parse(isoTimestamp).atOffset(ZoneOffset.UTC)
        }.getOrNull()
    } ?: return isoTimestamp

    val duration = Duration.between(instant, now)
    val minutes = duration.toMinutes()
    return when {
        minutes < 1 -> "just now"
        minutes < 60 -> "${minutes}m ago"
        minutes < 60 * 24 -> "${duration.toHours()}h ago"
        minutes < 60 * 24 * 30 -> "${duration.toDays()}d ago"
        minutes < 60 * 24 * 365 -> "${duration.toDays() / 30}mo ago"
        else -> instant.format(DateTimeFormatter.ofPattern("MMM yyyy"))
    }
}
