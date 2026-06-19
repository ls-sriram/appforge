rootProject.name = "example-app-server"

// Resolve appforge-server from local source during development.
// For production builds, remove includeBuild and publish appforge-server
// to a Maven repository, then consume it as a versioned dependency.
includeBuild("../../../../appforge-server") {
    dependencySubstitution {
        substitute(module("com.appforge:appforge-server")).using(project(":"))
    }
}
