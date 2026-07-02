package com.devmaniac.app.data.remote

import com.devmaniac.app.data.dto.CommentDto
import com.devmaniac.app.data.dto.FeedEventDto
import com.devmaniac.app.data.dto.JournalDto
import com.devmaniac.app.data.dto.LiveProjectDto
import com.devmaniac.app.data.dto.PaginatedProjectsDto
import com.devmaniac.app.data.dto.ProfileDto
import com.devmaniac.app.data.dto.ProjectDto
import com.devmaniac.app.data.dto.SearchUserDto
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {

    @GET("feed-events")
    suspend fun getFeedEvents(): List<FeedEventDto>

    // Trailing slash matters: the backend registers "/projects/" and
    // redirects "/projects" with a 307 otherwise.
    @GET("projects/")
    suspend fun getProjects(
        @Query("limit") limit: Int = 20,
        @Query("cursor") cursor: String? = null,
    ): PaginatedProjectsDto

    @GET("projects/{slug}")
    suspend fun getProject(
        @Path("slug") slug: String,
        @Query("clerk_user_id") clerkUserId: String? = null,
    ): ProjectDto

    @GET("projects/{slug}/comments")
    suspend fun getProjectComments(@Path("slug") slug: String): List<CommentDto>

    @GET("live-projects")
    suspend fun getLiveProjects(): List<LiveProjectDto>

    @GET("live-projects/{slug}")
    suspend fun getLiveProject(@Path("slug") slug: String): LiveProjectDto

    @GET("live-projects/{slug}/journals")
    suspend fun getJournals(@Path("slug") slug: String): List<JournalDto>

    @GET("profile/{username}")
    suspend fun getProfile(@Path("username") username: String): ProfileDto

    @GET("profile/me")
    suspend fun getMyProfile(@Query("clerk_user_id") clerkUserId: String): ProfileDto

    @GET("search/users")
    suspend fun searchUsers(
        @Query("q") query: String,
        @Query("limit") limit: Int = 20,
    ): List<SearchUserDto>
}
