package com.devmaniac.app.ui.navigation

import kotlinx.serialization.Serializable

@Serializable
data object ExploreRoute

@Serializable
data object ProjectsRoute

@Serializable
data object LiveProjectsRoute

@Serializable
data object SearchRoute

@Serializable
data object ProfileTabRoute

@Serializable
data class ProjectDetailRoute(val slug: String)

@Serializable
data class LiveProjectDetailRoute(val slug: String)

@Serializable
data class UserProfileRoute(val username: String)

@Serializable
data object SettingsRoute

@Serializable
data object SignInRoute

@Serializable
data class JournalComposerRoute(val slug: String)
