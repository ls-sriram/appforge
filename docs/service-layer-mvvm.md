# Service Layer (MVVM)

## Purpose

Define a strict boundary for `src/services/*` and how UI layers interact with backend/data access.

## Current Service Implementations

- `src/services/ApiClient.ts`
  - Low-level HTTP client (`GET/POST`, headers, cookies, base URL).
- `src/services/BackendAuthService.ts`
  - Auth flows (`signIn`, `signUp`, `signOut`, `checkAuthState`) via backend session endpoints.
- `src/services/OnboardingFlowService.ts`
  - Onboarding flow fetch/save/complete.
- `src/services/UserProfileService.ts`
  - Identity/profile/plan/usage aggregation.
- `src/services/AuthService.ts`
  - Alternate Firebase auth service abstraction (legacy path).

## Required MVVM Call Graph

`View (UI)` -> `ViewModel` -> `UseCase` -> `Repository` -> `Service` -> `ApiClient` -> `Backend`

For simple features, some intermediate layers may be very thin, but direction must be preserved.

Rules:
1. Views never import services.
2. ViewModels never import `ApiClient` directly.
3. Services never import UI/viewmodel code.
4. Service methods return typed domain/result objects only.
5. Service methods do not own UI state or navigation.

## Layer Responsibilities (Thin by Design)

### View
- Render-only.
- Emits UI intents.
- No business logic, no network calls.

### ViewModel
- Holds ephemeral UI state.
- Maps UI intents to model/repository calls.
- Converts domain errors to display errors.
- No transport details (`fetch`, headers, endpoint strings).

### UseCase
- Application action orchestration (per intent/use-action).
- Calls repository contracts.
- No UI imports.

### Repository
- Feature-domain orchestration.
- Chooses which service methods to call.
- No view rendering logic.

### Service
- Backend contract adapter.
- Endpoint paths, request payloads, response decoding.
- No UI behavior.

### ApiClient
- Shared HTTP transport details only.

## What Calls Service Layer

Allowed:
- Model/Repository classes.

Disallowed:
- Route files in `app/*`.
- View components in `src/features/*/views/*`.
- UI primitives and patterns (`primitives/components/blocks/features/pages/shells`).

## Current Boundary Notes

- Architecture guard is enforced with `npm run lint:arch`.
- Any new direct route/view/service coupling is a blocking violation.

## Refactor Target

For each feature:
1. Introduce `FeatureViewModel` (hook or class).
2. Move service calls behind `FeatureModel/Repository`.
3. Keep route/page files wiring-only.

## Backend vs Firestore Policy

- Client app reads/writes via backend services.
- Backend reads/writes Firestore privately.
- Avoid direct Firestore client reads in app feature code.

## Timestamp Wire Contract (Required)

- Backend -> frontend timestamp fields must be RFC 3339 UTC strings (serialized as `Date.toISOString()`).
- Frontend domain models must use `IsoUtcTimestamp` from `src/core/dates/index.ts`, not raw `string`.
- Service layer is the only place allowed to normalize/parsing-wire timestamps via `asIsoUtcTimestamp(...)`.
- ViewModel/View/Blocks should consume already-normalized timestamp values and never guess format.
- Invalid or unknown wire timestamps must be coerced to `null` at service boundary.
