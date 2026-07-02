package com.devmaniac.app

import android.app.Application
import com.clerk.api.Clerk
import com.devmaniac.app.di.AppContainer

class DevManiacApp : Application() {

    private val clerkEnabled = BuildConfig.CLERK_PUBLISHABLE_KEY.isNotEmpty()

    val container: AppContainer by lazy { AppContainer(this, clerkEnabled) }

    override fun onCreate() {
        super.onCreate()
        if (clerkEnabled) {
            Clerk.initialize(this, BuildConfig.CLERK_PUBLISHABLE_KEY)
        }
    }

    companion object {
        fun from(application: Application): DevManiacApp = application as DevManiacApp
    }
}
