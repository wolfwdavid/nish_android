package com.devmaniac.app.di

import android.content.Context
import com.devmaniac.app.data.remote.ApiService
import com.devmaniac.app.data.remote.AuthInterceptor
import com.devmaniac.app.data.repo.DevManiacRepository
import com.devmaniac.app.data.repo.NetworkRepository
import com.devmaniac.app.data.settings.AppSettings
import com.devmaniac.app.data.settings.SettingsSnapshot
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory

/**
 * Hand-rolled object graph: one settings store, one Json instance, and a
 * repository that is rebuilt whenever the settings that shape it change
 * (base URL, dev user id, demo mode).
 */
class AppContainer(private val context: Context) {

    val settings = AppSettings(context)

    val json = Json {
        ignoreUnknownKeys = true
        coerceInputValues = true
        explicitNulls = false
    }

    private data class RepoKey(val demoMode: Boolean, val baseUrl: String, val devClerkUserId: String?)

    private var cachedKey: RepoKey? = null
    private var cachedRepo: DevManiacRepository? = null
    private val lock = Any()

    suspend fun repository(): DevManiacRepository {
        val snapshot = settings.snapshot()
        val key = RepoKey(snapshot.demoMode, snapshot.baseUrl, snapshot.devClerkUserId)
        synchronized(lock) {
            if (key == cachedKey) return cachedRepo!!
            val repo = buildRepository(snapshot)
            cachedKey = key
            cachedRepo = repo
            return repo
        }
    }

    private fun buildRepository(snapshot: SettingsSnapshot): DevManiacRepository =
        NetworkRepository(
            api = buildApi(snapshot),
            clerkUserId = { snapshot.devClerkUserId },
        )

    private fun buildApi(snapshot: SettingsSnapshot): ApiService {
        val client = OkHttpClient.Builder()
            .addInterceptor(AuthInterceptor { snapshot.devClerkUserId })
            .addInterceptor(HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BASIC })
            .build()
        return Retrofit.Builder()
            .baseUrl(snapshot.baseUrl)
            .client(client)
            .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
            .build()
            .create(ApiService::class.java)
    }
}
