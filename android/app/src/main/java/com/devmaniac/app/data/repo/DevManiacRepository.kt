package com.devmaniac.app.data.repo

import com.devmaniac.app.data.dto.CommentDto
import com.devmaniac.app.data.dto.FeedEventDto
import com.devmaniac.app.data.dto.JournalDto
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
}
