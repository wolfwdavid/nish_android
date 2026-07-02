package com.devmaniac.app.data.repo

import com.devmaniac.app.data.dto.CommentDto
import com.devmaniac.app.data.dto.FeedEventDto
import com.devmaniac.app.data.dto.JournalDto
import com.devmaniac.app.data.dto.LiveProjectDto
import com.devmaniac.app.data.dto.PaginatedProjectsDto
import com.devmaniac.app.data.dto.ProfileDto
import com.devmaniac.app.data.dto.ProjectDto
import com.devmaniac.app.data.dto.SearchUserDto
import com.devmaniac.app.data.remote.ApiService

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
}
