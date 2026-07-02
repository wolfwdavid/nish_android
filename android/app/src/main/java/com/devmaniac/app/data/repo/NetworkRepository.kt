package com.devmaniac.app.data.repo

import com.devmaniac.app.data.dto.AddCommentBody
import com.devmaniac.app.data.dto.AddVoteBody
import com.devmaniac.app.data.dto.CommentDto
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
import com.devmaniac.app.data.dto.UserSyncBody
import com.devmaniac.app.data.remote.ApiService
import retrofit2.HttpException

class NetworkRepository(
    private val api: ApiService,
    private val clerkUserId: () -> String?,
) : DevManiacRepository {

    override suspend fun feedEvents(): List<FeedEventDto> = api.getFeedEvents()

    override suspend fun projects(limit: Int, cursor: String?): PaginatedProjectsDto =
        api.getProjects(limit = limit, cursor = cursor)

    override suspend fun project(slug: String): ProjectDto =
        api.getProject(slug = slug, clerkUserId = clerkUserId())

    override suspend fun projectComments(slug: String): List<CommentDto> =
        api.getProjectComments(slug)

    override suspend fun liveProjects(): List<LiveProjectDto> = api.getLiveProjects()

    override suspend fun liveProject(slug: String): LiveProjectDto = api.getLiveProject(slug)

    override suspend fun journals(liveProjectSlug: String): List<JournalDto> =
        api.getJournals(liveProjectSlug)

    override suspend fun profile(username: String): ProfileDto = api.getProfile(username)

    override suspend fun myProfile(): ProfileDto? =
        clerkUserId()?.let { api.getMyProfile(clerkUserId = it) }

    override suspend fun searchUsers(query: String, limit: Int): List<SearchUserDto> =
        api.searchUsers(query = query, limit = limit)

    // ---- Writes ----

    private fun requireUserId(): String =
        clerkUserId() ?: throw IllegalStateException("Sign in to do that")

    override suspend fun setStar(slug: String, starred: Boolean): ProjectDto {
        val userId = requireUserId()
        return try {
            if (starred) api.starProject(slug, userId) else api.unstarProject(slug, userId)
        } catch (e: HttpException) {
            // 409 "already starred" / 404 "star not found": state already
            // matches the request — reconcile with a fresh read.
            if (e.code() == 409 || e.code() == 404) {
                api.getProject(slug, clerkUserId = userId)
            } else {
                throw e
            }
        }
    }

    override suspend fun setBookmark(slug: String, bookmarked: Boolean) {
        val userId = requireUserId()
        val response = if (bookmarked) {
            api.bookmarkProject(slug, userId)
        } else {
            api.unbookmarkProject(slug, userId)
        }
        // 409 duplicate / 404 missing mean the state already matches.
        if (!response.isSuccessful && response.code() != 409 && response.code() != 404) {
            throw HttpException(response)
        }
    }

    override suspend fun addComment(slug: String, content: String, parentId: String?): CommentDto =
        api.addComment(slug, requireUserId(), AddCommentBody(content = content, parent_id = parentId))

    override suspend fun voteComment(commentId: String, voteType: String): CommentDto =
        api.voteComment(commentId, requireUserId(), AddVoteBody(vote_type = voteType))

    override suspend fun addJournal(slug: String, body: CreateJournalBody): JournalDto =
        api.addJournal(slug, requireUserId(), body)

    override suspend fun setJournalLike(journalId: String, liked: Boolean): JournalLikeDto {
        val userId = requireUserId()
        return try {
            if (liked) api.likeJournal(journalId, userId) else api.unlikeJournal(journalId, userId)
        } catch (e: HttpException) {
            if (e.code() == 409 || e.code() == 404) {
                // Already in the requested state; no count endpoint to re-read
                // cheaply, so report the requested state and let the next full
                // load reconcile the count.
                JournalLikeDto(likes_count = -1, is_liked = liked)
            } else {
                throw e
            }
        }
    }

    override suspend fun setFollow(username: String, follow: Boolean): FollowStatusDto {
        val userId = requireUserId()
        return try {
            if (follow) api.followUser(username, userId) else api.unfollowUser(username, userId)
        } catch (e: HttpException) {
            if (e.code() == 409 || e.code() == 404) {
                api.followStatus(username, userId)
            } else {
                throw e
            }
        }
    }

    override suspend fun followStatus(username: String): FollowStatusDto =
        api.followStatus(username, requireUserId())

    override suspend fun syncUser(
        clerkUserId: String,
        email: String,
        displayName: String?,
        avatarUrl: String?,
    ) {
        api.syncUser(
            UserSyncBody(
                clerk_user_id = clerkUserId,
                email = email,
                display_name = displayName,
                avatar_url = avatarUrl,
            )
        )
    }
}
