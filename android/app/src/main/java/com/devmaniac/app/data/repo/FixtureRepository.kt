package com.devmaniac.app.data.repo

import android.content.Context
import com.devmaniac.app.data.dto.CommentDto
import com.devmaniac.app.data.dto.CommentUserDto
import com.devmaniac.app.data.dto.CreateJournalBody
import com.devmaniac.app.data.dto.FeedEventDto
import com.devmaniac.app.data.dto.FollowStatusDto
import com.devmaniac.app.data.dto.JournalDto
import com.devmaniac.app.data.dto.JournalLikeDto
import com.devmaniac.app.data.dto.LiveProjectDto
import com.devmaniac.app.data.dto.PaginatedProjectsDto
import com.devmaniac.app.data.dto.ProfileDto
import com.devmaniac.app.data.dto.ProjectDto
import com.devmaniac.app.data.dto.SearchUserDto
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.UUID
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json

/**
 * Serves bundled JSON from assets/fixtures/ so the app is fully browsable
 * without a running backend. The fixtures are decoded through the same DTOs
 * as live responses, so they double as a serializer contract check.
 *
 * Writes are supported through a session-scoped in-memory overlay: they
 * survive screen reloads (every read path merges the overlay) but reset when
 * the repository instance is rebuilt (settings change) or the app restarts.
 */
class FixtureRepository(
    private val context: Context,
    private val json: Json,
) : DevManiacRepository {

    // In demo mode "you" are the app's own builder.
    private val demoUsername = "nishchal"

    private val mutex = Mutex()

    // Overlay state, guarded by [mutex].
    private val starOverrides = mutableMapOf<String, Boolean>()
    private val bookmarkOverrides = mutableMapOf<String, Boolean>()
    private val extraComments = mutableMapOf<String, MutableList<CommentDto>>()
    private val voteOverrides = mutableMapOf<String, Pair<Int, Int>>() // commentId -> (upDelta, downDelta)
    private val extraJournals = mutableMapOf<String, MutableList<JournalDto>>()
    private val journalLikes = mutableMapOf<String, Boolean>()
    private val followOverrides = mutableMapOf<String, Boolean>()

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

    private fun now(): String = LocalDateTime.now(ZoneOffset.UTC).withNano(0).toString()

    override suspend fun feedEvents(): List<FeedEventDto> = load("feed_events.json")

    override suspend fun projects(limit: Int, cursor: String?): PaginatedProjectsDto {
        if (cursor != null) {
            return PaginatedProjectsDto(items = emptyList(), next_cursor = null, has_more = false)
        }
        val page = load<PaginatedProjectsDto>("projects_page1.json")
        return mutex.withLock { page.copy(items = page.items.map { it.withOverlay() }) }
    }

    override suspend fun project(slug: String): ProjectDto {
        val base = loadOrNull<ProjectDto>("project_$slug.json")
            ?: load<PaginatedProjectsDto>("projects_page1.json").items.first { it.slug == slug }
        return mutex.withLock { base.withOverlay() }
    }

    private fun ProjectDto.withOverlay(): ProjectDto {
        var result = this
        starOverrides[slug]?.let { starred ->
            val delta = when {
                starred && !is_starred -> 1
                !starred && is_starred -> -1
                else -> 0
            }
            result = result.copy(is_starred = starred, stars_count = (stars_count + delta).coerceAtLeast(0))
        }
        bookmarkOverrides[slug]?.let { result = result.copy(is_bookmarked = it) }
        extraComments[slug]?.let { result = result.copy(comments_count = result.comments_count + it.size) }
        return result
    }

    override suspend fun projectComments(slug: String): List<CommentDto> {
        val base = loadOrNull<List<CommentDto>>("project_${slug}_comments.json") ?: emptyList()
        return mutex.withLock {
            val extras = extraComments[slug].orEmpty()
            val (extraReplies, extraTopLevel) = extras.partition { it.parent_id != null }
            val withVotes = (base + extraTopLevel).map { top ->
                val replies = top.replies + extraReplies.filter { it.parent_id == top.id }
                top.applyVotes().copy(replies = replies.map { it.applyVotes() })
            }
            withVotes
        }
    }

    private fun CommentDto.applyVotes(): CommentDto {
        val (up, down) = voteOverrides[id] ?: return this
        val newUp = (upvotes_count + up).coerceAtLeast(0)
        val newDown = (downvotes_count + down).coerceAtLeast(0)
        return copy(upvotes_count = newUp, downvotes_count = newDown, score = newUp - newDown)
    }

    override suspend fun liveProjects(): List<LiveProjectDto> {
        val base = load<List<LiveProjectDto>>("live_projects.json")
        return mutex.withLock { base.map { it.withJournalOverlay() } }
    }

    override suspend fun liveProject(slug: String): LiveProjectDto {
        val base = loadOrNull<LiveProjectDto>("live_project_$slug.json")
            ?: load<List<LiveProjectDto>>("live_projects.json").first { it.slug == slug }
        return mutex.withLock { base.withJournalOverlay() }
    }

    private fun LiveProjectDto.withJournalOverlay(): LiveProjectDto {
        val extras = extraJournals[slug].orEmpty()
        if (extras.isEmpty()) return this
        val latestProgress = extras.mapNotNull { it.progress_percentage }.lastOrNull()
        return copy(
            journal_count = journal_count + extras.size,
            progress_percentage = latestProgress ?: progress_percentage,
        )
    }

    override suspend fun journals(liveProjectSlug: String): List<JournalDto> {
        val base = loadOrNull<List<JournalDto>>("live_project_${liveProjectSlug}_journals.json") ?: emptyList()
        return mutex.withLock {
            (base + extraJournals[liveProjectSlug].orEmpty()).map { entry ->
                if (journalLikes[entry.id] == true) {
                    entry.copy(likes_count = entry.likes_count + 1)
                } else {
                    entry
                }
            }
        }
    }

    override suspend fun profile(username: String): ProfileDto {
        val base = load<ProfileDto>("profile_$username.json")
        return mutex.withLock {
            if (followOverrides[username] == true) {
                base.copy(followers_count = base.followers_count + 1)
            } else {
                base
            }
        }
    }

    override suspend fun myProfile(): ProfileDto? = loadOrNull("profile_$demoUsername.json")

    override suspend fun searchUsers(query: String, limit: Int): List<SearchUserDto> {
        val all = load<List<SearchUserDto>>("search_users.json")
        val q = query.trim().lowercase()
        if (q.isEmpty()) return emptyList()
        return all.filter {
            it.username.lowercase().contains(q) || (it.display_name?.lowercase()?.contains(q) ?: false)
        }.take(limit)
    }

    // ---- Writes: mutate the overlay and return synthesized DTOs ----

    override suspend fun setStar(slug: String, starred: Boolean): ProjectDto {
        mutex.withLock { starOverrides[slug] = starred }
        return project(slug)
    }

    override suspend fun setBookmark(slug: String, bookmarked: Boolean) {
        mutex.withLock { bookmarkOverrides[slug] = bookmarked }
    }

    override suspend fun addComment(slug: String, content: String, parentId: String?): CommentDto {
        val me = myProfile() ?: error("Demo profile missing")
        val comment = CommentDto(
            id = UUID.randomUUID().toString(),
            user_id = me.id,
            project_id = UUID.randomUUID().toString(),
            parent_id = parentId,
            content = content,
            upvotes_count = 0,
            downvotes_count = 0,
            score = 0,
            is_edited = false,
            created_at = now(),
            updated_at = now(),
            user = CommentUserDto(
                id = me.id,
                username = me.username,
                display_name = me.display_name ?: me.username,
                avatar_url = me.avatar_url,
            ),
        )
        mutex.withLock { extraComments.getOrPut(slug) { mutableListOf() }.add(comment) }
        return comment
    }

    override suspend fun voteComment(commentId: String, voteType: String): CommentDto {
        mutex.withLock {
            val (up, down) = voteOverrides[commentId] ?: (0 to 0)
            voteOverrides[commentId] = when (voteType) {
                "up" -> if (up > 0) 0 to down else 1 to 0
                else -> if (down > 0) up to 0 else 0 to 1
            }
        }
        // The caller refreshes the comment list; return a placeholder the
        // ViewModel can ignore in demo mode.
        val me = myProfile() ?: error("Demo profile missing")
        return CommentDto(
            id = commentId,
            user_id = me.id,
            project_id = UUID.randomUUID().toString(),
            content = "",
            created_at = now(),
            updated_at = now(),
            user = CommentUserDto(me.id, me.username, me.display_name ?: me.username, me.avatar_url),
        )
    }

    override suspend fun addJournal(slug: String, body: CreateJournalBody): JournalDto {
        val me = myProfile() ?: error("Demo profile missing")
        val existing = journals(slug)
        val entry = JournalDto(
            id = UUID.randomUUID().toString(),
            live_project_id = liveProject(slug).id,
            user_id = me.id,
            day_number = (existing.maxOfOrNull { it.day_number } ?: 0) + 1,
            content = body.content,
            entry_type = body.entry_type,
            media_urls = body.media_urls,
            code_snippets = body.code_snippets,
            problem_solutions = body.problem_solutions,
            progress_percentage = body.progress_percentage,
            likes_count = 0,
            comments_count = 0,
            created_at = now(),
            updated_at = now(),
        )
        mutex.withLock { extraJournals.getOrPut(slug) { mutableListOf() }.add(entry) }
        return entry
    }

    override suspend fun setJournalLike(journalId: String, liked: Boolean): JournalLikeDto {
        mutex.withLock { journalLikes[journalId] = liked }
        return JournalLikeDto(likes_count = -1, is_liked = liked)
    }

    override suspend fun setFollow(username: String, follow: Boolean): FollowStatusDto {
        mutex.withLock { followOverrides[username] = follow }
        val profile = profile(username)
        return FollowStatusDto(
            is_following = follow,
            followers_count = profile.followers_count,
            following_count = profile.following_count,
        )
    }

    override suspend fun followStatus(username: String): FollowStatusDto {
        val profile = profile(username)
        val following = mutex.withLock { followOverrides[username] == true }
        return FollowStatusDto(
            is_following = following,
            followers_count = profile.followers_count,
            following_count = profile.following_count,
        )
    }

    override suspend fun syncUser(clerkUserId: String, email: String, displayName: String?, avatarUrl: String?) {
        // Nothing to provision in demo mode.
    }
}
