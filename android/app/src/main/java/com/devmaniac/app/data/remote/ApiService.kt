package com.devmaniac.app.data.remote

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
import com.devmaniac.app.data.dto.SyncedUserDto
import com.devmaniac.app.data.dto.UserSyncBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
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

    // ---- Write operations. All require clerk_user_id as a query param
    // ---- (the backend's auth model; see docs/API.md).

    @POST("projects/{slug}/star")
    suspend fun starProject(
        @Path("slug") slug: String,
        @Query("clerk_user_id") clerkUserId: String,
    ): ProjectDto

    @DELETE("projects/{slug}/star")
    suspend fun unstarProject(
        @Path("slug") slug: String,
        @Query("clerk_user_id") clerkUserId: String,
    ): ProjectDto

    // Bookmark responses have an unreliable shape server-side; treat as opaque.
    @POST("projects/{slug}/bookmark")
    suspend fun bookmarkProject(
        @Path("slug") slug: String,
        @Query("clerk_user_id") clerkUserId: String,
    ): Response<Unit>

    @DELETE("projects/{slug}/bookmark")
    suspend fun unbookmarkProject(
        @Path("slug") slug: String,
        @Query("clerk_user_id") clerkUserId: String,
    ): Response<Unit>

    @POST("projects/{slug}/comments")
    suspend fun addComment(
        @Path("slug") slug: String,
        @Query("clerk_user_id") clerkUserId: String,
        @Body body: AddCommentBody,
    ): CommentDto

    @POST("projects/comments/{commentId}/vote")
    suspend fun voteComment(
        @Path("commentId") commentId: String,
        @Query("clerk_user_id") clerkUserId: String,
        @Body body: AddVoteBody,
    ): CommentDto

    @POST("live-projects/{slug}/journals")
    suspend fun addJournal(
        @Path("slug") slug: String,
        @Query("clerk_user_id") clerkUserId: String,
        @Body body: CreateJournalBody,
    ): JournalDto

    @POST("live-projects/journals/{journalId}/like")
    suspend fun likeJournal(
        @Path("journalId") journalId: String,
        @Query("clerk_user_id") clerkUserId: String,
    ): JournalLikeDto

    @DELETE("live-projects/journals/{journalId}/like")
    suspend fun unlikeJournal(
        @Path("journalId") journalId: String,
        @Query("clerk_user_id") clerkUserId: String,
    ): JournalLikeDto

    @POST("users/{username}/follow")
    suspend fun followUser(
        @Path("username") username: String,
        @Query("clerk_user_id") clerkUserId: String,
    ): FollowStatusDto

    @DELETE("users/{username}/follow")
    suspend fun unfollowUser(
        @Path("username") username: String,
        @Query("clerk_user_id") clerkUserId: String,
    ): FollowStatusDto

    @GET("users/{username}/follow-status")
    suspend fun followStatus(
        @Path("username") username: String,
        @Query("clerk_user_id") clerkUserId: String,
    ): FollowStatusDto

    // Trailing slash mandatory: a 307 redirect would drop the POST body.
    @POST("sync_user/")
    suspend fun syncUser(@Body body: UserSyncBody): SyncedUserDto
}
