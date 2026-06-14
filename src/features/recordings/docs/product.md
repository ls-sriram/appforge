# Recordings Feature Product

## Scope
- Platform-level recordings capability for authenticated users.
- API surface remains `/api/v1/recordings` and should stay app-agnostic.
- App context is provided via request identity (`X-App-Id`) and must be enforced by backend data scoping.

## User Outcomes
- Create interview/audio recordings.
- List recent recordings for the current authenticated user context.
- Stream/download recording content by recording id.

## Contract Intent
- Endpoint namespace: `/api/v1/recordings`.
- Auth required on all endpoints.
- Request context must include app identity and user identity.
- Backend acts as a platform pass-through API but must enforce tenant-safe isolation at persistence/query boundaries.

## Data Isolation Requirement
- No cross-app or cross-user leakage.
- Same user id across different apps must not read/write each other's recordings.
- App scoping can be enforced via table schema (`app_id`) and query predicates, or equivalent guaranteed partitioning.
