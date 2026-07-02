package com.devmaniac.app.data.dto

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonObject

// Mirrors backend/app/schema/liveProjects.py::GetLiveProject
@Serializable
data class LiveProjectDto(
    val id: String,
    val user_id: String,
    val user: PublicUserDto,
    val title: String,
    val slug: String,
    val goal: String,
    val description: String? = null,
    val github_url: String? = null,
    val live_url: String? = null,
    val demo_video_url: String? = null,
    val thumbnail_url: String? = null,
    val gallery_urls: List<String> = emptyList(),
    val tech_stack: List<String> = emptyList(),
    val progress_percentage: Int = 0,
    val current_status: String? = null,
    val current_goal: String? = null,
    val status: String = "active",
    val category: String? = null,
    val is_public: Boolean = true,
    val is_featured: Boolean = false,
    val views_count: Int = 0,
    val journal_count: Int = 0,
    val days_count: Int = 0,
    val completed_at: String? = null,
    val created_at: String,
    val updated_at: String,
)

// Mirrors backend/app/schema/liveProjects.py::ProblemSolution
@Serializable
data class ProblemSolutionDto(
    val problem: String,
    val solution: String,
)

// Mirrors backend/app/schema/liveProjects.py::GetLiveProjectJournal.
// entry_type: progress | milestone | bugfix | deployment | architecture | announcement | failure
@Serializable
data class JournalDto(
    val id: String,
    val live_project_id: String,
    val user_id: String,
    val day_number: Int,
    val content: String,
    val entry_type: String = "progress",
    val media_urls: List<String> = emptyList(),
    val code_snippets: List<String> = emptyList(),
    val problem_solutions: List<ProblemSolutionDto> = emptyList(),
    val progress_percentage: Int? = null,
    val likes_count: Int = 0,
    val comments_count: Int = 0,
    val created_at: String,
    val updated_at: String,
)

// Mirrors backend/app/schema/liveProjects.py::FeedLiveProject
@Serializable
data class FeedLiveProjectDto(
    val id: String,
    val title: String,
    val slug: String,
    val description: String? = null,
    val current_status: String? = null,
    val progress_percentage: Int? = null,
    val status: String? = null,
    val tech_stack: List<String> = emptyList(),
    val thumbnail_url: String? = null,
)

// Mirrors backend/app/schema/liveProjects.py::GetFeedEvent
@Serializable
data class FeedEventDto(
    val id: String,
    val user_id: String,
    val user: PublicUserDto,
    val live_project_id: String? = null,
    val live_project: FeedLiveProjectDto? = null,
    val event_type: String,
    val content: String? = null,
    val event_metadata: JsonObject = JsonObject(emptyMap()),
    val likes_count: Int = 0,
    val comments_count: Int = 0,
    val is_public: Boolean = true,
    val created_at: String,
)
