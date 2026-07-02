package com.devmaniac.app.di

import android.content.Context
import com.devmaniac.app.auth.AuthManager
import com.devmaniac.app.data.remote.ApiService
import com.devmaniac.app.data.remote.AuthInterceptor
import com.devmaniac.app.data.repo.DevManiacRepository
import com.devmaniac.app.data.repo.FixtureRepository
import com.devmaniac.app.data.repo.NetworkRepository
import com.devmaniac.app.data.settings.AppSettings
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory

/**
 * Hand-rolled object graph: settings store, auth manager, one Json instance,
 * and a repository rebuilt when the settings that shape it change (base URL,
 * demo mode). Identity is read live from [AuthManager] on every request, so
 * sign-in/out never requires a repository rebuild.
 */
class AppContainer(
    private val context: Context,
    clerkEnabled: Boolean,
) {

    val appScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    val settings = AppSettings(context)

    val authManager = AuthManager(settings, appScope, clerkEnabled)

    val json = Json {
        ignoreUnknownKeys = true
        coerceInputValues = true
        explicitNulls = false
    }

    private data class RepoKey(val demoMode: Boolean, val baseUrl: String)

    private var cachedKey: RepoKey? = null
    private var cachedRepo: DevManiacRepository? = null
    private val lock = Any()

    suspend fun repository(): DevManiacRepository {
        val snapshot = settings.snapshot()
        val key = RepoKey(snapshot.demoMode, snapshot.baseUrl)
        synchronized(lock) {
            if (key == cachedKey) return cachedRepo!!
            val repo = if (key.demoMode) {
                FixtureRepository(context, json)
            } else {
                NetworkRepository(
                    api = buildApi(key.baseUrl),
                    clerkUserId = { authManager.currentClerkUserId() },
                )
            }
            cachedKey = key
            cachedRepo = repo
            return repo
        }
    }

    private fun buildApi(baseUrl: String): ApiService {
        val client = OkHttpClient.Builder()
            .addInterceptor(AuthInterceptor(authManager))
            .addInterceptor(HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BASIC })
            .build()
        return Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(client)
            .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
            .build()
            .create(ApiService::class.java)
    }
}
