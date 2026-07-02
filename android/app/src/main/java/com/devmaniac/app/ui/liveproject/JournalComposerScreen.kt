package com.devmaniac.app.ui.liveproject

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.devmaniac.app.ui.common.containerViewModelFactory
import com.devmaniac.app.ui.theme.Background
import com.devmaniac.app.ui.theme.Danger
import com.devmaniac.app.ui.theme.Outline
import com.devmaniac.app.ui.theme.PrimaryBright
import com.devmaniac.app.ui.theme.SurfaceElevated
import com.devmaniac.app.ui.theme.TextFaint
import com.devmaniac.app.ui.theme.TextMuted

private val entryTypes = listOf(
    "progress", "milestone", "bugfix", "deployment", "architecture", "announcement", "failure",
)

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun JournalComposerScreen(
    slug: String,
    onBack: () -> Unit,
    onPosted: () -> Unit,
    viewModel: JournalComposerViewModel = viewModel(
        key = "composer-$slug",
        factory = containerViewModelFactory { JournalComposerViewModel(it, slug) },
    ),
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    var content by remember { mutableStateOf("") }
    var entryType by remember { mutableStateOf("progress") }
    var codeSnippet by remember { mutableStateOf("") }
    var problem by remember { mutableStateOf("") }
    var solution by remember { mutableStateOf("") }
    var trackProgress by remember { mutableStateOf(false) }
    var progress by remember { mutableFloatStateOf(50f) }

    LaunchedEffect(state.posted) {
        if (state.posted) onPosted()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Log a session", style = MaterialTheme.typography.titleLarge) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Background,
                    titleContentColor = MaterialTheme.colorScheme.onBackground,
                    navigationIconContentColor = MaterialTheme.colorScheme.onBackground,
                ),
            )
        },
        containerColor = Background,
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
                .imePadding(),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            OutlinedTextField(
                value = content,
                onValueChange = { content = it },
                label = { Text("What did you build today?", color = TextFaint) },
                minLines = 4,
                colors = composerFieldColors(),
                modifier = Modifier.fillMaxWidth(),
            )

            Text(
                text = "Entry type",
                style = MaterialTheme.typography.titleSmall,
                color = TextMuted,
            )
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                entryTypes.forEach { type ->
                    val selected = type == entryType
                    Text(
                        text = type,
                        style = MaterialTheme.typography.labelMedium,
                        color = if (selected) MaterialTheme.colorScheme.onPrimary else TextMuted,
                        modifier = Modifier
                            .background(
                                if (selected) MaterialTheme.colorScheme.primary else SurfaceElevated,
                                RoundedCornerShape(8.dp),
                            )
                            .clickable { entryType = type }
                            .padding(horizontal = 12.dp, vertical = 6.dp),
                    )
                }
            }

            OutlinedTextField(
                value = codeSnippet,
                onValueChange = { codeSnippet = it },
                label = { Text("Code snippet (optional)", color = TextFaint) },
                minLines = 3,
                textStyle = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace),
                colors = composerFieldColors(),
                modifier = Modifier.fillMaxWidth(),
            )

            OutlinedTextField(
                value = problem,
                onValueChange = { problem = it },
                label = { Text("Problem you hit (optional)", color = TextFaint) },
                colors = composerFieldColors(),
                modifier = Modifier.fillMaxWidth(),
            )
            OutlinedTextField(
                value = solution,
                onValueChange = { solution = it },
                label = { Text("How you solved it", color = TextFaint) },
                colors = composerFieldColors(),
                modifier = Modifier.fillMaxWidth(),
            )

            Column {
                androidx.compose.foundation.layout.Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "Update progress",
                        style = MaterialTheme.typography.titleSmall,
                        color = TextMuted,
                        modifier = Modifier.weight(1f),
                    )
                    Switch(checked = trackProgress, onCheckedChange = { trackProgress = it })
                }
                if (trackProgress) {
                    Slider(
                        value = progress,
                        onValueChange = { progress = it },
                        valueRange = 0f..100f,
                        colors = androidx.compose.material3.SliderDefaults.colors(
                            thumbColor = MaterialTheme.colorScheme.primary,
                            activeTrackColor = MaterialTheme.colorScheme.primary,
                            inactiveTrackColor = Outline,
                        ),
                    )
                    Text(
                        text = "${progress.toInt()}% complete",
                        style = MaterialTheme.typography.labelMedium,
                        color = PrimaryBright,
                    )
                }
            }

            state.error?.let { error ->
                Text(text = error, style = MaterialTheme.typography.bodySmall, color = Danger)
            }

            Button(
                onClick = {
                    viewModel.post(
                        content = content,
                        entryType = entryType,
                        codeSnippet = codeSnippet,
                        problem = problem,
                        solution = solution,
                        progress = if (trackProgress) progress.toInt() else null,
                    )
                },
                enabled = !state.submitting && content.isNotBlank(),
                modifier = Modifier.fillMaxWidth(),
            ) {
                if (state.submitting) {
                    CircularProgressIndicator(
                        color = MaterialTheme.colorScheme.onPrimary,
                        modifier = Modifier.padding(2.dp),
                        strokeWidth = 2.dp,
                    )
                } else {
                    Text("Publish entry")
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun composerFieldColors() = OutlinedTextFieldDefaults.colors(
    focusedBorderColor = MaterialTheme.colorScheme.primary,
    unfocusedBorderColor = Outline,
    focusedTextColor = MaterialTheme.colorScheme.onBackground,
    unfocusedTextColor = MaterialTheme.colorScheme.onBackground,
    cursorColor = MaterialTheme.colorScheme.primary,
)
