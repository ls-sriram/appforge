package com.exampleapp.server

import com.appforge.server.config.AppEnv
import com.appforge.server.installAppforgePlatform
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty

fun main() {
    val env = AppEnv.load()
    embeddedServer(Netty, port = env.runtime.port, host = env.runtime.host) {
        installAppforgePlatform(env)
    }.start(wait = true)
}
