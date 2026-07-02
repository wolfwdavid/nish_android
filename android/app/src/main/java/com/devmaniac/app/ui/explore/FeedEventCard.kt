package com.devmaniac.app.ui.explore

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ChatBubbleOutline
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.devmaniac.app.data.dto.FeedEventDto
import com.devmaniac.app.ui.common.relativeTime
import com.devmaniac.app.ui.components.AsyncAvatar
import com.devmaniac.app.ui.components.TechChips
import com.devmaniac.app.ui.theme.Outline
import com.devmaniac.app.ui.theme.PrimaryBright
import com.devmaniac.app.ui.theme.SurfaceCard
import com.devmaniac.app.ui.theme.SurfaceElevated
import com.devmaniac.app.ui.theme.TextFaint
import com.devmaniac.app.ui.theme.TextMuted

// Event types match the web app's FeedEventCard mapping.
private val eventTypeLabels = mapOf(
    "journal_published" to "published a journal entry",
    "live_project_created" to "started a live build",
    "deployment" to "deployed",
    "milestone" to "hit a milestone",
    "journal_entry" to "logged a session",
    "shipped" to "shipped",
    "announcement" to "announced",
)

@Composable
fun FeedEventCard(
    event: FeedEventDto,
    onOpenLiveProject: (String) -> Unit,
    onOpenUser: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(SurfaceCard)
            .border(1.dp, Outline, RoundedCornerShape(12.dp))
            .padding(14.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            AsyncAvatar(
                url = event.user.avatar_url,
                name = event.user.display_name ?: event.user.username,
                size = 38.dp,
                modifier = Modifier.clickable { onOpenUser(event.user.username) },
            )
            Spacer(Modifier.width(10.dp))
            Column(Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = event.user.display_name ?: event.user.username,
                        style = MaterialTheme.typography.titleSmall,
                        color = MaterialTheme.colorScheme.onBackground,
                        modifier = Modifier.clickable { onOpenUser(event.user.username) },
                    )
                    Spacer(Modifier.width(6.dp))
                    Text(
                        text = eventTypeLabels[event.event_type] ?: event.event_type.replace('_', ' '),
                        style = MaterialTheme.typography.bodySmall,
                        color = TextMuted,
                    )
                }
                Text(
                    text = "@${event.user.username} · ${relativeTime(event.created_at)}",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextFaint,
                )
            }
        }

        event.content?.takeIf { it.isNotBlank() }?.let { content ->
            Text(
                text = content,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onBackground,
                modifier = Modifier.padding(top = 10.dp),
            )
        }

        event.live_project?.let { project ->
            Column(
                modifier = Modifier
                    .padding(top = 10.dp)
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(SurfaceElevated)
                    .clickable { onOpenLiveProject(project.slug) }
                    .padding(12.dp),
            ) {
                Text(
                    text = project.title,
                    style = MaterialTheme.typography.titleSmall,
                    color = PrimaryBright,
                )
                project.description?.takeIf { it.isNotBlank() }?.let {
                    Text(
                        text = it,
                        style = MaterialTheme.typography.bodySmall,
                        color = TextMuted,
                        modifier = Modifier.padding(top = 4.dp),
                    )
                }
                project.progress_percentage?.let { progress ->
                    LinearProgressIndicator(
                        progress = { progress / 100f },
                        color = MaterialTheme.colorScheme.primary,
                        trackColor = Outline,
                        modifier = Modifier
                            .padding(top = 10.dp)
                            .fillMaxWidth()
                            .height(4.dp),
                    )
                    Text(
                        text = "$progress% complete",
                        style = MaterialTheme.typography.labelSmall,
                        color = TextFaint,
                        modifier = Modifier.padding(top = 4.dp),
                    )
                }
                TechChips(
                    tech = project.tech_stack,
                    maxItems = 4,
                    modifier = Modifier.padding(top = 8.dp),
                )
            }
        }

        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.padding(top = 12.dp),
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    Icons.Outlined.FavoriteBorder,
                    contentDescription = "Likes",
                    tint = TextFaint,
                    modifier = Modifier.height(16.dp),
                )
                Spacer(Modifier.width(4.dp))
                Text("${event.likes_count}", style = MaterialTheme.typography.labelMedium, color = TextFaint)
            }
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    Icons.Outlined.ChatBubbleOutline,
                    contentDescription = "Comments",
                    tint = TextFaint,
                    modifier = Modifier.height(16.dp),
                )
                Spacer(Modifier.width(4.dp))
                Text("${event.comments_count}", style = MaterialTheme.typography.labelMedium, color = TextFaint)
            }
        }
    }
}
