package com.devmaniac.app.data.repo

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

interface DevManiacRepository {
    suspend fun feedEvents(): List<FeedEventDto>
    suspend fun projects(limit: Int = 20, cursor: String? = null): PaginatedProjectsDto
    suspend fun project(slug: String): ProjectDto
    suspend fun projectComments(slug: String): List<CommentDto>
    suspend fun liveProjects(): List<LiveProjectDto>
    suspend fun liveProject(slug: String): LiveProjectDto
    suspend fun journals(liveProjectSlug: String): List<JournalDto>
    suspend fun profile(username: String): ProfileDto
    suspend fun myProfile(): ProfileDto?
    suspend fun searchUsers(query: String, limit: Int = 20): List<SearchUserDto>

    // Write operations. Implementations map "already in desired state"
    // responses (409 on duplicate create, 404 on missing delete) to success.
    suspend fun setStar(slug: String, starred: Boolean): ProjectDto
    suspend fun setBookmark(slug: String, bookmarked: Boolean)
    suspend fun addComment(slug: String, content: String, parentId: String? = null): CommentDto
    suspend fun voteComment(commentId: String, voteType: String): CommentDto
    suspend fun addJournal(slug: String, body: CreateJournalBody): JournalDto
    suspend fun setJournalLike(journalId: String, liked: Boolean): JournalLikeDto
    suspend fun setFollow(username: String, follow: Boolean): FollowStatusDto
    suspend fun followStatus(username: String): FollowStatusDto
    suspend fun syncUser(clerkUserId: String, email: String, displayName: String?, avatarUrl: String?)
}
