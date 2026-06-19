import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar

plugins {
    kotlin("jvm") version "1.9.24"
    kotlin("plugin.serialization") version "1.9.24"
    application
    id("com.github.johnrengelman.shadow") version "8.1.1"
}

group = "com.exampleapp"
version = "0.1.0"

repositories {
    mavenCentral()
}

dependencies {
    // Platform core — resolved via Gradle composite build (settings.gradle.kts)
    implementation("com.appforge:appforge-server")

    // Ktor Netty engine — the app owns the server runtime
    implementation("io.ktor:ktor-server-netty-jvm:2.3.12")
}

application {
    mainClass.set("com.exampleapp.server.MainKt")
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions.jvmTarget = "17"
}

java {
    toolchain.languageVersion.set(JavaLanguageVersion.of(17))
}

tasks.named<ShadowJar>("shadowJar") {
    archiveBaseName.set("example-app-server")
    archiveClassifier.set("")
    mergeServiceFiles()
}
