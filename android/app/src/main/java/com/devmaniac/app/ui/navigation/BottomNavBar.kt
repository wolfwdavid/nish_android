package com.devmaniac.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Widgets
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarDefaults
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavBackStackEntry
import androidx.navigation.NavDestination.Companion.hasRoute
import com.devmaniac.app.ui.theme.Background
import com.devmaniac.app.ui.theme.PrimaryBright
import com.devmaniac.app.ui.theme.SurfaceElevated
import com.devmaniac.app.ui.theme.TextFaint
import kotlin.reflect.KClass

data class TopLevelDestination(
    val route: Any,
    val routeClass: KClass<*>,
    val label: String,
    val icon: ImageVector,
)

val topLevelDestinations = listOf(
    TopLevelDestination(ExploreRoute, ExploreRoute::class, "Explore", Icons.Filled.Explore),
    TopLevelDestination(ProjectsRoute, ProjectsRoute::class, "Projects", Icons.Filled.Widgets),
    TopLevelDestination(LiveProjectsRoute, LiveProjectsRoute::class, "Live", Icons.Filled.Bolt),
    TopLevelDestination(SearchRoute, SearchRoute::class, "Search", Icons.Filled.Search),
    TopLevelDestination(ProfileTabRoute, ProfileTabRoute::class, "Profile", Icons.Filled.Person),
)

@Composable
fun BottomNavBar(
    currentBackStackEntry: NavBackStackEntry?,
    onNavigate: (Any) -> Unit,
) {
    NavigationBar(
        containerColor = Background,
        windowInsets = NavigationBarDefaults.windowInsets,
    ) {
        val currentDestination = currentBackStackEntry?.destination
        topLevelDestinations.forEach { destination ->
            val selected = currentDestination?.hierarchy()?.any { it.hasRoute(destination.routeClass) } == true
            NavigationBarItem(
                selected = selected,
                onClick = { onNavigate(destination.route) },
                icon = { Icon(destination.icon, contentDescription = destination.label) },
                label = { Text(destination.label) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = PrimaryBright,
                    selectedTextColor = PrimaryBright,
                    unselectedIconColor = TextFaint,
                    unselectedTextColor = TextFaint,
                    indicatorColor = SurfaceElevated,
                ),
            )
        }
    }
}

private fun androidx.navigation.NavDestination.hierarchy() =
    generateSequence(this) { it.parent }
