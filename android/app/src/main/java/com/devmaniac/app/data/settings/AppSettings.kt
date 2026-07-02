package com.devmaniac.app.data.settings

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.devmaniac.app.BuildConfig
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "settings")

data class SettingsSnapshot(
    val baseUrl: String,
    val devClerkUserId: String?,
    val demoMode: Boolean,
)

class AppSettings(private val context: Context) {

    private val baseUrlKey = stringPreferencesKey("base_url")
    private val devClerkUserIdKey = stringPreferencesKey("dev_clerk_user_id")
    private val demoModeKey = booleanPreferencesKey("demo_mode")

    val snapshots: Flow<SettingsSnapshot> = context.dataStore.data.map { prefs ->
        SettingsSnapshot(
            baseUrl = prefs[baseUrlKey] ?: BuildConfig.DEFAULT_BASE_URL,
            devClerkUserId = prefs[devClerkUserIdKey]?.takeIf { it.isNotBlank() },
            // Demo mode defaults ON so a fresh install works without a backend.
            demoMode = prefs[demoModeKey] ?: true,
        )
    }

    suspend fun snapshot(): SettingsSnapshot = snapshots.first()

    suspend fun setBaseUrl(value: String) {
        context.dataStore.edit { prefs ->
            val normalized = value.trim().let { if (it.isEmpty() || it.endsWith("/")) it else "$it/" }
            if (normalized.isEmpty()) prefs.remove(baseUrlKey) else prefs[baseUrlKey] = normalized
        }
    }

    suspend fun setDevClerkUserId(value: String?) {
        context.dataStore.edit { prefs ->
            if (value.isNullOrBlank()) prefs.remove(devClerkUserIdKey) else prefs[devClerkUserIdKey] = value.trim()
        }
    }

    suspend fun setDemoMode(enabled: Boolean) {
        context.dataStore.edit { prefs -> prefs[demoModeKey] = enabled }
    }
}
