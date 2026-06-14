# Architecture Providers

## Purpose

- Define provider interfaces and implementations that should be reused before adding new server abstractions.

## Canonical Provider Layer

Primary provider packages live under:

- `server/src/main/kotlin/com.appforge/server/providers/`

Current provider areas:

- `config/` — typed app/runtime configuration access.
- `featureflag/` — runtime feature flag evaluation.
- `identifier/` — ID generation helpers.
- `identity/` — authenticated/external identity resolution.
- `time/` — timestamp clock abstraction.
- `transaction/` — transaction boundary abstraction for SQL work.

## Service-Level Provider Composition

Service modules also compose providers using `*Provider.kt` files, for example:

- `server/src/main/kotlin/com.appforge/server/services/auth/AuthProvider.kt`
- `server/src/main/kotlin/com.appforge/server/services/billing/BillingProvider.kt`
- `server/src/main/kotlin/com.appforge/server/services/usage/UsageProvider.kt`
- `server/src/main/kotlin/com.appforge/server/services/uploads/UploadProvider.kt`
- `server/src/main/kotlin/com.appforge/server/services/reviews/ReviewProvider.kt`
- `server/src/main/kotlin/com.appforge/server/services/sharing/ShareProvider.kt`

Auth provider composition is split by service boundary and placed in owning folders:

- `services/login/LoginService` — session login/me/logout + password reset.
- `services/registration/RegistrationService` — signup initialization/provisioning with early-access enforcement.
- `services/onboarding/OnboardingQaService` — onboarding question/answer submission lifecycle.
- `services/userprofile/UserProfileService` — profile projection reads.
- `services/billing/BillingAccountService` + `services/billing/EntitlementService` — billing retrieval and entitlement-to-API projection.
- `services/usage/UsageProvider` — composition root for usage/entitlement services consumed by profile-facing services.
- `services/useraccount/UserAccountService` — profile mutation and account deletion.
- `services/earlyaccess/EarlyAccessAppService` — early-access check/join app endpoints.

`services/auth/*` should remain focused on auth-specific wiring and shared auth primitives, not duplicate domain implementations owned by other service folders.

## Service Internal Pattern (Backend)

For `server/src/main/kotlin/com.appforge/server/services/**`, the default composition pattern is:

`Route -> Service -> Repository -> Models`

With optional helpers:

- `Coordinator` — orchestration across multiple repositories/services for a single domain action.
- `Adapter/Mapper` — transforms wire/DTO forms without owning business rules.
- `Provider` (`*Provider.kt`) — dependency composition boundary only.

Rules:

1. Services own business policy and validation, not transport/framework concerns.
2. Repositories own persistence access (SQL/Firestore/etc.), not route logic.
3. Domain/billing/auth models remain data carriers; no route or Ktor concerns.
4. Coordinators are used only when orchestration spans multiple collaborators.
5. Providers wire dependencies; they do not implement business logic.
6. Route handlers call service interfaces only and keep response mapping centralized.

## Reuse Rule

Before creating a new dependency abstraction in server code:

1. Check canonical provider packages under `server/.../providers/*`.
2. Check existing service `*Provider.kt` composition in related domains.
3. Reuse or extend existing provider contracts where possible.
4. Add a new provider only when existing contracts cannot represent the need.

## Decision Logging

- If a new provider contract is introduced, record rationale in `docs/decisions/`.
