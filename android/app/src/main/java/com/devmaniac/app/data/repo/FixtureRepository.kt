package com.devmaniac.app.data.repo

import android.content.Context
import com.devmaniac.app.data.dto.CommentDto
import com.devmaniac.app.data.dto.FeedEventDto
import com.devmaniac.app.data.dto.JournalDto
import com.devmaniac.app.data.dto.LiveProjectDto
import com.devmaniac.app.data.dto.PaginatedProjectsDto
import com.devmaniac.app.data.dto.ProfileDto
import com.devmaniac.app.data.dto.ProjectDto
import com.devmaniac.app.data.dto.SearchUserDto
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json

/**
 * Serves bundled JSON from assets/fixtures/ so the app is fully browsable
 * without a running backend. The fixtures are decoded through the same DTOs
 * as live responses, so they double as a serializer contract check.
 */
class FixtureRepository(
    private val context: Context,
    private val json: Json,
) : DevManiacRepository {

    private suspend inline fun <reified T> load(name: String): T = withContext(Dispatchers.IO) {
        val text = context.assets.open("fixtures/$name").bufferedReader().use { it.readText() }
        json.decodeFromString<T>(text)
    }

    private suspend inline fun <reified T> loadOrNull(name: String): T? =
        try {
            load<T>(name)
        } catch (e: java.io.FileNotFoundException) {
            null
        }

    override suspend fun feedEvents(): List<FeedEventDto> = load("feed_events.json")

    override suspend fun projects(limit: Int, cursor: String?): PaginatedProjectsDto =
        if (cursor == null) {
            load("projects_page1.json")
        } else {
            PaginatedProjectsDto(items = emptyList(), next_cursor = null, has_more = false)
        }

    override suspend fun project(slug: String): ProjectDto =
        loadOrNull<ProjectDto>("project_$slug.json")
            ?: projects().items.first { it.slug == slug }

    override suspend fun projectComments(slug: String): List<CommentDto> =
        loadOrNull<List<CommentDto>>("project_${slug}_comments.json") ?: emptyList()

    override suspend fun liveProjects(): List<LiveProjectDto> = load("live_projects.json")

    override suspend fun liveProject(slug: String): LiveProjectDto =
        loadOrNull<LiveProjectDto>("live_project_$slug.json")
            ?: liveProjects().first { it.slug == slug }

    override suspend fun journals(liveProjectSlug: String): List<JournalDto> =
        loadOrNull<List<JournalDto>>("live_project_${liveProjectSlug}_journals.json") ?: emptyList()

    override suspend fun profile(username: String): ProfileDto = load("profile_$username.json")

    // In demo mode "you" are the app's own builder.
    override suspend fun myProfile(): ProfileDto? = loadOrNull("profile_nishchal.json")

    override suspend fun searchUsers(query: String, limit: Int): List<SearchUserDto> {
        val all = load<List<SearchUserDto>>("search_users.json")
        val q = query.trim().lowercase()
        if (q.isEmpty()) return emptyList()
        return all.filter {
            it.username.lowercase().contains(q) || (it.display_name?.lowercase()?.contains(q) ?: false)
        }.take(limit)
    }
}
