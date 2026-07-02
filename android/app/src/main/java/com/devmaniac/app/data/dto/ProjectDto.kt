package com.devmaniac.app.data.dto

import kotlinx.serialization.Serializable

// Mirrors backend/app/schema/project.py::ProjectAuthor
@Serializable
data class ProjectAuthorDto(
    val username: String,
    val avatar_url: String? = null,
    val location: String? = null,
)

// Mirrors backend/app/schema/project.py::GetProject
@Serializable
data class ProjectDto(
    val id: String,
    val user_id: String,
    val title: String,
    val slug: String,
    val description: String,
    val github_url: String,
    val live_url: String? = null,
    val thumbnail_url: String? = null,
    val demo_video_url: String? = null,
    val gallery_urls: List<String> = emptyList(),
    val tech_stack: List<String> = emptyList(),
    val stars_count: Int = 0,
    val views_count: Int = 0,
    val comments_count: Int = 0,
    val is_featured: Boolean = false,
    val is_starred: Boolean = false,
    val is_bookmarked: Boolean = false,
    val user: ProjectAuthorDto,
    val created_at: String,
    val updated_at: String,
)

// Mirrors backend/app/schema/project.py::PaginatedProjects (cursor is a datetime string)
@Serializable
data class PaginatedProjectsDto(
    val items: List<ProjectDto> = emptyList(),
    val next_cursor: String? = null,
    val has_more: Boolean = false,
)

// Mirrors backend/app/schema/project.py::CommentUser
@Serializable
data class CommentUserDto(
    val id: String,
    val username: String,
    val display_name: String,
    val avatar_url: String? = null,
)

// Mirrors backend/app/schema/project.py::CommentOut / GetComment.
// Two-level threading: replies never nest further, so one class covers both.
@Serializable
data class CommentDto(
    val id: String,
    val user_id: String,
    val project_id: String,
    val parent_id: String? = null,
    val content: String,
    val upvotes_count: Int = 0,
    val downvotes_count: Int = 0,
    val score: Int = 0,
    val is_edited: Boolean = false,
    val created_at: String,
    val updated_at: String,
    val user: CommentUserDto,
    val replies: List<CommentDto> = emptyList(),
)
