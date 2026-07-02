package com.devmaniac.app.ui.projectdetail

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.devmaniac.app.data.dto.CommentDto
import com.devmaniac.app.ui.common.relativeTime
import com.devmaniac.app.ui.components.AsyncAvatar
import com.devmaniac.app.ui.theme.PrimaryBright
import com.devmaniac.app.ui.theme.SurfaceElevated
import com.devmaniac.app.ui.theme.TextFaint

@Composable
fun CommentItem(
    comment: CommentDto,
    modifier: Modifier = Modifier,
    isReply: Boolean = false,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(start = if (isReply) 32.dp else 0.dp)
            .background(SurfaceElevated, RoundedCornerShape(10.dp))
            .padding(12.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            AsyncAvatar(
                url = comment.user.avatar_url,
                name = comment.user.display_name,
                size = 26.dp,
            )
            Spacer(Modifier.width(8.dp))
            Text(
                text = comment.user.display_name,
                style = MaterialTheme.typography.titleSmall,
                color = MaterialTheme.colorScheme.onBackground,
            )
            Spacer(Modifier.width(6.dp))
            Text(
                text = relativeTime(comment.created_at),
                style = MaterialTheme.typography.labelSmall,
                color = TextFaint,
            )
            if (comment.is_edited) {
                Spacer(Modifier.width(4.dp))
                Text(text = "(edited)", style = MaterialTheme.typography.labelSmall, color = TextFaint)
            }
        }
        Text(
            text = comment.content,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onBackground,
            modifier = Modifier.padding(top = 6.dp),
        )
        Text(
            text = "▲ ${comment.score}",
            style = MaterialTheme.typography.labelSmall,
            color = if (comment.score > 0) PrimaryBright else TextFaint,
            modifier = Modifier.padding(top = 6.dp),
        )
    }
}
