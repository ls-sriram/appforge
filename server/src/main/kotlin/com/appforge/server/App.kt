package com.appforge.server

import com.appforge.server.api.HealthResponse
import com.appforge.server.config.AppEnv
import com.appforge.server.extensions.PlatformExtension
import com.appforge.server.extensions.exampleapp.ExampleAppExtension
import com.appforge.server.middleware.configureErrorHandling
import com.appforge.server.routing.RoutesModule
import com.appforge.server.routing.analyticsRoutes
import com.appforge.server.routing.configureCors
import com.appforge.server.services.ClientRegistry
import com.appforge.server.services.CoreServices
import com.appforge.server.services.ServicesModule
import io.ktor.server.application.Application
import io.ktor.server.application.call
import io.ktor.server.application.createApplicationPlugin
import io.ktor.server.application.install
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.callid.CallId
import io.ktor.server.plugins.callid.callId
import io.ktor.server.plugins.callid.generate
import io.ktor.server.plugins.callloging.CallLogging
import io.ktor.server.plugins.callloging.processingTimeMillis
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.request.httpMethod
import io.ktor.server.request.path
import io.ktor.server.request.uri
import io.ktor.server.response.respond
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import io.ktor.serialization.kotlinx.json.json
import java.util.UUID
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import org.slf4j.MDC

private val CallMdc = createApplicationPlugin("CallMdc") {
    onCall { call ->
        val requestId = call.callId ?: UUID.randomUUID().toString()
        MDC.put("requestId", requestId)
    }
    onCallRespond { _, _ ->
        MDC.remove("requestId")
        MDC.remove("userId")
        MDC.remove("appId")
        MDC.remove("teamId")
    }
}

fun main() {
    val env = AppEnv.load()
    embeddedServer(Netty, port = env.runtime.port, host = env.runtime.host) {
        module(env)
    }.start(wait = true)
}

fun Application.module(env: AppEnv = AppEnv.load()) {
    install(ContentNegotiation) {
        json(
            Json {
                ignoreUnknownKeys = true
                encodeDefaults = true
            }
        )
    }

    install(CallId) {
        retrieveFromHeader("X-Request-Id")
        generate { UUID.randomUUID().toString() }
        verify { it.isNotBlank() }
    }
    install(CallMdc)
    install(CallLogging) {
        filter { call -> !call.request.path().startsWith("/api/v1/uploads/") }
        format { call ->
            val status = call.response.status()?.value?.toString() ?: "Unhandled"
            val method = call.request.httpMethod.value
            val uri = call.request.uri
            val duration = call.processingTimeMillis()
            val requestId = call.callId ?: "-"
            "$status $method - $uri in ${duration}ms requestId=$requestId"
        }
    }

    configureCors(env)
    configureErrorHandling()

    ClientRegistry.initialize(env)
    ClientRegistry.registerExtension(selectRuntimeExtension(env.runtime.appId))
    if (useReducedBackendBoot(env)) {
        routing {
            get("/health") {
                call.respond(HealthResponse(status = "ok"))
            }
        }
        return
    }

    val coreServices = CoreServices(
        configProvider = ClientRegistry.configProvider,
        firebaseAuth = ClientRegistry.firebaseClient.auth,
        storage = ClientRegistry.storageClient,
        repositoryFactory = ClientRegistry.repositoryFactory,
        database = ClientRegistry.databaseInstance,
        transactionProvider = ClientRegistry.transactionProvider,
        featureFlagProvider = ClientRegistry.featureFlagProvider,
        hookEngine = ClientRegistry.hookEngine,
        extensionRegistry = ClientRegistry.extensionRegistry,
        uploadOwnershipAuthorizer = ClientRegistry.uploadOwnershipAuthorizer,
        uploadMetadataRepository = ClientRegistry.uploadMetadataRepository,
        uploadSignedUrlIssuer = ClientRegistry.uploadSignedUrlIssuer,
        uploadAccessUrlIssuer = ClientRegistry.uploadAccessUrlIssuer,
        dodoPaymentsClient = ClientRegistry.dodoPaymentsClient,
    )

    val servicesModule = ServicesModule(core = coreServices, env = env)

    val analyticsProvider = com.appforge.server.services.analytics.AnalyticsProvider(coreServices, env)
    runBlocking { analyticsProvider.initialize() }
    analyticsProvider.install(this)

    RoutesModule(servicesModule).register(this)

    routing {
        analyticsRoutes(
            analyticsProvider.useCases,
            analyticsProvider.userUseCases,
            env.runtime.internalSecret,
        )
    }
}

private fun selectRuntimeExtension(appId: String): PlatformExtension {
    return when (appId.trim().lowercase()) {
        ExampleAppExtension.appId -> ExampleAppExtension
        else -> error("Unsupported APP_ID '$appId'. Supported: ${ExampleAppExtension.appId}")
    }
}

private fun useReducedBackendBoot(env: AppEnv): Boolean {
    return env.runtime.appId.trim().lowercase() == ExampleAppExtension.appId && !env.firebase.enabled
}
