package com.exampleapp.server

import com.appforge.server.extensions.PlatformExtension
import com.appforge.server.extensions.PlatformServices
import io.ktor.server.routing.Routing

object ExampleAppExtension : PlatformExtension {
    override val appId: String = "example-app"

    override fun registerRoutes(routing: Routing, services: PlatformServices) {
        // App-specific routes go here.
    }
}
