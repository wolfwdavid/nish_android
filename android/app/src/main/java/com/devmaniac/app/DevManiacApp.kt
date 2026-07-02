package com.devmaniac.app

import android.app.Application
import com.devmaniac.app.di.AppContainer

class DevManiacApp : Application() {

    val container: AppContainer by lazy { AppContainer(this) }

    companion object {
        fun from(application: Application): DevManiacApp = application as DevManiacApp
    }
}
