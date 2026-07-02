package com.devmaniac.app.ui.common

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider.AndroidViewModelFactory
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.devmaniac.app.DevManiacApp
import com.devmaniac.app.di.AppContainer

/** Creates ViewModels that take the app's [AppContainer] as their only dependency. */
inline fun <reified VM : ViewModel> containerViewModelFactory(
    crossinline create: (AppContainer) -> VM,
) = viewModelFactory {
    initializer {
        val app = this[AndroidViewModelFactory.APPLICATION_KEY] as DevManiacApp
        create(app.container)
    }
}
