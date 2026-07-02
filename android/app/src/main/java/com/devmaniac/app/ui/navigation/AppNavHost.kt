package com.devmaniac.app.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.toRoute
import com.devmaniac.app.ui.explore.ExploreScreen
import com.devmaniac.app.ui.liveproject.LiveProjectScreen
import com.devmaniac.app.ui.liveproject.LiveProjectsScreen
import com.devmaniac.app.ui.profile.ProfileScreen
import com.devmaniac.app.ui.projectdetail.ProjectDetailScreen
import com.devmaniac.app.ui.projects.ProjectsScreen
import com.devmaniac.app.ui.search.SearchScreen
import com.devmaniac.app.ui.settings.SettingsScreen

@Composable
fun AppNavHost(navController: NavHostController = rememberNavController()) {
    val backStackEntry by navController.currentBackStackEntryAsState()

    fun navigateTopLevel(route: Any) {
        navController.navigate(route) {
            popUpTo(navController.graph.startDestinationId) { saveState = true }
            launchSingleTop = true
            restoreState = true
        }
    }

    Scaffold(
        bottomBar = {
            BottomNavBar(
                currentBackStackEntry = backStackEntry,
                onNavigate = ::navigateTopLevel,
            )
        },
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = ExploreRoute,
            modifier = Modifier.padding(innerPadding),
        ) {
            composable<ExploreRoute> {
                ExploreScreen(
                    onOpenLiveProject = { navController.navigate(LiveProjectDetailRoute(it)) },
                    onOpenUser = { navController.navigate(UserProfileRoute(it)) },
                )
            }
            composable<ProjectsRoute> {
                ProjectsScreen(
                    onOpenProject = { navController.navigate(ProjectDetailRoute(it)) },
                    onOpenUser = { navController.navigate(UserProfileRoute(it)) },
                )
            }
            composable<LiveProjectsRoute> {
                LiveProjectsScreen(
                    onOpenLiveProject = { navController.navigate(LiveProjectDetailRoute(it)) },
                    onOpenUser = { navController.navigate(UserProfileRoute(it)) },
                )
            }
            composable<SearchRoute> {
                SearchScreen(
                    onOpenUser = { navController.navigate(UserProfileRoute(it)) },
                )
            }
            composable<ProfileTabRoute> {
                ProfileScreen(
                    username = null,
                    onOpenSettings = { navController.navigate(SettingsRoute) },
                    onOpenProject = { navController.navigate(ProjectDetailRoute(it)) },
                    onOpenLiveProject = { navController.navigate(LiveProjectDetailRoute(it)) },
                )
            }
            composable<ProjectDetailRoute> { entry ->
                val route = entry.toRoute<ProjectDetailRoute>()
                ProjectDetailScreen(
                    slug = route.slug,
                    onBack = { navController.popBackStack() },
                    onOpenUser = { navController.navigate(UserProfileRoute(it)) },
                )
            }
            composable<LiveProjectDetailRoute> { entry ->
                val route = entry.toRoute<LiveProjectDetailRoute>()
                LiveProjectScreen(
                    slug = route.slug,
                    onBack = { navController.popBackStack() },
                    onOpenUser = { navController.navigate(UserProfileRoute(it)) },
                )
            }
            composable<UserProfileRoute> { entry ->
                val route = entry.toRoute<UserProfileRoute>()
                ProfileScreen(
                    username = route.username,
                    onOpenSettings = { navController.navigate(SettingsRoute) },
                    onOpenProject = { navController.navigate(ProjectDetailRoute(it)) },
                    onOpenLiveProject = { navController.navigate(LiveProjectDetailRoute(it)) },
                )
            }
            composable<SettingsRoute> {
                SettingsScreen(onBack = { navController.popBackStack() })
            }
        }
    }
}
