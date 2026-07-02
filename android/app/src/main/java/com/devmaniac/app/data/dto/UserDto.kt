package com.devmaniac.app.data.dto

import kotlinx.serialization.Serializable

// Mirrors backend/app/schema/profile.py::PublicUser
@Serializable
data class PublicUserDto(
    val id: String,
    val username: String,
    val display_name: String? = null,
    val avatar_url: String? = null,
    val current_build: String? = null,
)

// Mirrors backend/app/schema/profile.py::get_profile_data
@Serializable
data class ProfileDto(
    val id: String,
    val clerk_user_id: String,
    val username: String,
    val display_name: String? = null,
    val email: String,
    val bio: String? = null,
    val avatar_url: String? = null,
    val banner_url: String? = null,
    val github_url: String? = null,
    val linkedin_url: String? = null,
    val portfolio_url: String? = null,
    val instagram_url: String? = null,
    val reputation_score: Int = 0,
    val followers_count: Int = 0,
    val following_count: Int = 0,
    val posts_count: Int = 0,
    val project_count: Int = 0,
    val location: String? = null,
    val current_build: String? = null,
    val joined_date: String? = null,
)

// Response of POST/DELETE /users/{username}/follow and GET follow-status
@Serializable
data class FollowStatusDto(
    val is_following: Boolean,
    val followers_count: Int = 0,
    val following_count: Int = 0,
)

// Request body for POST /sync_user/ (schema UserSync)
@Serializable
data class UserSyncBody(
    val clerk_user_id: String,
    val email: String,
    val display_name: String? = null,
    val avatar_url: String? = null,
)

// Response of POST /sync_user/ (schema UserResponse)
@Serializable
data class SyncedUserDto(
    val clerk_user_id: String,
    val username: String,
    val display_name: String? = null,
    val email: String,
    val avatar_url: String? = null,
    val onboarding_completed: Boolean = false,
)

// Mirrors the inline dict returned by backend/app/router/search.py::search_users
@Serializable
data class SearchUserDto(
    val id: String,
    val username: String,
    val display_name: String? = null,
    val avatar_url: String? = null,
    val bio: String? = null,
    val location: String? = null,
    val followers_count: Int = 0,
    val project_count: Int = 0,
    val is_verified: Boolean = false,
)
