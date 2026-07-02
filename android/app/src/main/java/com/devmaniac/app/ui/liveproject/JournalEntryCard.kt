package com.devmaniac.app.ui.liveproject

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ChatBubbleOutline
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.devmaniac.app.data.dto.JournalDto
import com.devmaniac.app.ui.common.relativeTime
import com.devmaniac.app.ui.theme.CodeFamily
import com.devmaniac.app.ui.theme.Danger
import com.devmaniac.app.ui.theme.Outline
import com.devmaniac.app.ui.theme.PrimaryBright
import com.devmaniac.app.ui.theme.Success
import com.devmaniac.app.ui.theme.SurfaceCard
import com.devmaniac.app.ui.theme.SurfaceElevated
import com.devmaniac.app.ui.theme.TextFaint
import com.devmaniac.app.ui.theme.TextMuted

private data class EntryTypeStyle(val label: String, val color: Color)

private val entryTypeStyles = mapOf(
    "progress" to EntryTypeStyle("Progress", PrimaryBright),
    "milestone" to EntryTypeStyle("Milestone", Success),
    "bugfix" to EntryTypeStyle("Bug fix", Color(0xFF60A5FA)),
    "deployment" to EntryTypeStyle("Deployment", Color(0xFFA78BFA)),
    "architecture" to EntryTypeStyle("Architecture", Color(0xFF2DD4BF)),
    "announcement" to EntryTypeStyle("Announcement", Color(0xFFFACC15)),
    "failure" to EntryTypeStyle("Failure", Danger),
)

@Composable
fun JournalEntryCard(entry: JournalDto, modifier: Modifier = Modifier) {
    val style = entryTypeStyles[entry.entry_type]
        ?: EntryTypeStyle(entry.entry_type.replaceFirstChar { it.uppercase() }, TextMuted)

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(SurfaceCard)
            .border(1.dp, Outline, RoundedCornerShape(12.dp))
            .padding(14.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = "Day ${entry.day_number}",
                style = MaterialTheme.typography.titleSmall,
                color = MaterialTheme.colorScheme.onBackground,
                modifier = Modifier
                    .background(SurfaceElevated, RoundedCornerShape(6.dp))
                    .padding(horizontal = 8.dp, vertical = 3.dp),
            )
            Spacer(Modifier.width(8.dp))
            Text(
                text = style.label,
                style = MaterialTheme.typography.labelMedium,
                color = style.color,
                modifier = Modifier
                    .background(style.color.copy(alpha = 0.12f), RoundedCornerShape(6.dp))
                    .padding(horizontal = 8.dp, vertical = 3.dp),
            )
            Spacer(Modifier.weight(1f))
            Text(
                text = relativeTime(entry.created_at),
                style = MaterialTheme.typography.labelSmall,
                color = TextFaint,
            )
        }

        Text(
            text = entry.content,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onBackground,
            modifier = Modifier.padding(top = 10.dp),
        )

        entry.code_snippets.forEach { snippet ->
            Text(
                text = snippet,
                style = MaterialTheme.typography.bodySmall.copy(fontFamily = CodeFamily),
                color = TextMuted,
                modifier = Modifier
                    .padding(top = 10.dp)
                    .fillMaxWidth()
                    .background(Color(0xFF0A0A0A), RoundedCornerShape(8.dp))
                    .border(1.dp, Outline, RoundedCornerShape(8.dp))
                    .padding(12.dp)
                    .horizontalScroll(rememberScrollState()),
            )
        }

        if (entry.media_urls.isNotEmpty()) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier
                    .padding(top = 10.dp)
                    .horizontalScroll(rememberScrollState()),
            ) {
                entry.media_urls.forEach { url ->
                    AsyncImage(
                        model = url,
                        contentDescription = "Journal media",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .width(220.dp)
                            .aspectRatio(16f / 10f)
                            .clip(RoundedCornerShape(10.dp)),
                    )
                }
            }
        }

        entry.problem_solutions.forEach { ps ->
            Column(
                modifier = Modifier
                    .padding(top = 10.dp)
                    .fillMaxWidth()
                    .background(SurfaceElevated, RoundedCornerShape(8.dp))
                    .padding(12.dp),
            ) {
                Text(text = "Problem", style = MaterialTheme.typography.labelMedium, color = Danger)
                Text(
                    text = ps.problem,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier.padding(top = 2.dp),
                )
                Text(
                    text = "Solution",
                    style = MaterialTheme.typography.labelMedium,
                    color = Success,
                    modifier = Modifier.padding(top = 8.dp),
                )
                Text(
                    text = ps.solution,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier.padding(top = 2.dp),
                )
            }
        }

        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.padding(top = 12.dp),
        ) {
            entry.progress_percentage?.let {
                Text(
                    text = "$it% complete",
                    style = MaterialTheme.typography.labelMedium,
                    color = PrimaryBright,
                )
            }
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    Icons.Outlined.FavoriteBorder,
                    contentDescription = "Likes",
                    tint = TextFaint,
                    modifier = Modifier.height(15.dp),
                )
                Spacer(Modifier.width(4.dp))
                Text("${entry.likes_count}", style = MaterialTheme.typography.labelMedium, color = TextFaint)
            }
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    Icons.Outlined.ChatBubbleOutline,
                    contentDescription = "Comments",
                    tint = TextFaint,
                    modifier = Modifier.height(15.dp),
                )
                Spacer(Modifier.width(4.dp))
                Text("${entry.comments_count}", style = MaterialTheme.typography.labelMedium, color = TextFaint)
            }
        }
    }
}
