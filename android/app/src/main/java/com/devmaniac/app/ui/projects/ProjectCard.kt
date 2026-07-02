package com.devmaniac.app.ui.projects

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ChatBubbleOutline
import androidx.compose.material.icons.outlined.StarBorder
import androidx.compose.material.icons.outlined.Visibility
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.devmaniac.app.data.dto.ProjectDto
import com.devmaniac.app.ui.components.AsyncAvatar
import com.devmaniac.app.ui.components.TechChips
import com.devmaniac.app.ui.theme.Outline
import com.devmaniac.app.ui.theme.SurfaceCard
import com.devmaniac.app.ui.theme.TextFaint

@Composable
fun ProjectCard(
    project: ProjectDto,
    onOpen: (String) -> Unit,
    onOpenUser: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(SurfaceCard)
            .border(1.dp, Outline, RoundedCornerShape(12.dp))
            .clickable { onOpen(project.slug) },
    ) {
        project.thumbnail_url?.let { thumbnail ->
            AsyncImage(
                model = thumbnail,
                contentDescription = "${project.title} thumbnail",
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxWidth().aspectRatio(16f / 9f),
            )
        }
        Column(Modifier.padding(14.dp)) {
            Text(
                text = project.title,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onBackground,
            )
            Text(
                text = project.description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.padding(top = 4.dp),
            )
            TechChips(tech = project.tech_stack, maxItems = 4, modifier = Modifier.padding(top = 10.dp))
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(top = 12.dp),
            ) {
                AsyncAvatar(
                    url = project.user.avatar_url,
                    name = project.user.username,
                    size = 24.dp,
                    modifier = Modifier.clickable { onOpenUser(project.user.username) },
                )
                Spacer(Modifier.width(8.dp))
                Text(
                    text = "@${project.user.username}",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.weight(1f).clickable { onOpenUser(project.user.username) },
                )
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    StatIconText(Icons.Outlined.StarBorder, project.stars_count, "Stars")
                    StatIconText(Icons.Outlined.Visibility, project.views_count, "Views")
                    StatIconText(Icons.Outlined.ChatBubbleOutline, project.comments_count, "Comments")
                }
            }
        }
    }
}

@Composable
private fun StatIconText(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    count: Int,
    label: String,
) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(icon, contentDescription = label, tint = TextFaint, modifier = Modifier.height(14.dp))
        Spacer(Modifier.width(3.dp))
        Text("$count", style = MaterialTheme.typography.labelSmall, color = TextFaint)
    }
}
