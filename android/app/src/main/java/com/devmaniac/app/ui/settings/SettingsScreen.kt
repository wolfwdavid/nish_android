package com.devmaniac.app.ui.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.devmaniac.app.ui.common.containerViewModelFactory
import com.devmaniac.app.ui.components.LoadingState
import com.devmaniac.app.ui.theme.Background
import com.devmaniac.app.ui.theme.Outline
import com.devmaniac.app.ui.theme.SurfaceCard
import com.devmaniac.app.ui.theme.TextFaint
import com.devmaniac.app.ui.theme.TextMuted

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    onBack: () -> Unit,
    viewModel: SettingsViewModel = viewModel(factory = containerViewModelFactory { SettingsViewModel(it) }),
) {
    val snapshot by viewModel.snapshot.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings", style = MaterialTheme.typography.titleLarge) },
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
        val current = snapshot
        if (current == null) {
            LoadingState(Modifier.padding(padding))
            return@Scaffold
        }

        var baseUrlDraft by remember { mutableStateOf(current.baseUrl) }
        var userIdDraft by remember { mutableStateOf(current.devClerkUserId ?: "") }
        LaunchedEffect(current.baseUrl) { baseUrlDraft = current.baseUrl }
        LaunchedEffect(current.devClerkUserId) { userIdDraft = current.devClerkUserId ?: "" }

        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            Column(
                Modifier
                    .fillMaxWidth()
                    .background(SurfaceCard, RoundedCornerShape(12.dp))
                    .padding(14.dp),
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text(
                            text = "Demo mode",
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onBackground,
                        )
                        Text(
                            text = "Browse bundled sample data without a backend",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextMuted,
                        )
                    }
                    Switch(
                        checked = current.demoMode,
                        onCheckedChange = viewModel::setDemoMode,
                        colors = SwitchDefaults.colors(
                            checkedTrackColor = MaterialTheme.colorScheme.primary,
                        ),
                    )
                }
            }

            Column(
                Modifier
                    .fillMaxWidth()
                    .background(SurfaceCard, RoundedCornerShape(12.dp))
                    .padding(14.dp),
            ) {
                Text(
                    text = "Backend",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onBackground,
                )
                Text(
                    text = "Used when demo mode is off. From the emulator, 10.0.2.2 reaches the host machine.",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextMuted,
                    modifier = Modifier.padding(top = 2.dp),
                )
                OutlinedTextField(
                    value = baseUrlDraft,
                    onValueChange = { baseUrlDraft = it },
                    label = { Text("Base URL", color = TextFaint) },
                    singleLine = true,
                    colors = settingsFieldColors(),
                    modifier = Modifier.fillMaxWidth().padding(top = 10.dp),
                )
                Button(
                    onClick = { viewModel.setBaseUrl(baseUrlDraft) },
                    enabled = baseUrlDraft != current.baseUrl,
                    modifier = Modifier.padding(top = 8.dp),
                ) { Text("Save URL") }
            }

            Column(
                Modifier
                    .fillMaxWidth()
                    .background(SurfaceCard, RoundedCornerShape(12.dp))
                    .padding(14.dp),
            ) {
                Text(
                    text = "Dev sign-in",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onBackground,
                )
                Text(
                    text = "The backend identifies you by a raw Clerk user id (no token verification). " +
                        "Paste a clerk_user_id from the database to browse as that user. Dev only.",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextMuted,
                    modifier = Modifier.padding(top = 2.dp),
                )
                OutlinedTextField(
                    value = userIdDraft,
                    onValueChange = { userIdDraft = it },
                    label = { Text("clerk_user_id", color = TextFaint) },
                    singleLine = true,
                    colors = settingsFieldColors(),
                    modifier = Modifier.fillMaxWidth().padding(top = 10.dp),
                )
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.padding(top = 8.dp),
                ) {
                    Button(
                        onClick = { viewModel.setDevClerkUserId(userIdDraft) },
                        enabled = userIdDraft != (current.devClerkUserId ?: ""),
                    ) { Text("Sign in") }
                    Button(
                        onClick = {
                            userIdDraft = ""
                            viewModel.setDevClerkUserId(null)
                        },
                        enabled = current.devClerkUserId != null,
                    ) { Text("Sign out") }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun settingsFieldColors() = OutlinedTextFieldDefaults.colors(
    focusedBorderColor = MaterialTheme.colorScheme.primary,
    unfocusedBorderColor = Outline,
    focusedTextColor = MaterialTheme.colorScheme.onBackground,
    unfocusedTextColor = MaterialTheme.colorScheme.onBackground,
    cursorColor = MaterialTheme.colorScheme.primary,
)
