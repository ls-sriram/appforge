# Current State

## Backend Route Contract (Verified)
- Route root: `server/src/main/kotlin/com.appforge/server/routing/RecordingRoutes.kt`
- Base path: `/api/v1/recordings`
- Methods:
  - `POST /api/v1/recordings`
  - `GET /api/v1/recordings?limit=<n>`
  - `GET /api/v1/recordings/{id}/content`

## Auth and Request Context
- `UserAuthPlugin` is installed on recordings routes.
- Requests require auth and request context resolution.
- Tests include `Authorization: Bearer ...` and `X-App-Id` headers for authorized flows.

## Request/Response Behavior
- `POST` validates:
  - `contentType` must start with `audio/`
  - `audioBase64` must decode
  - audio payload non-empty
  - `durationSeconds >= 0` when provided
- `GET list`:
  - default limit `20`
  - clamped to `1..100`
- `GET content`:
  - missing id -> `400`
  - not found/denied -> mapped to `404` in route handler
  - success returns raw bytes with recording content type

## Persistence Contract
- SQL resource: `server/src/main/resources/com.appforge/server/services/recordings/recordings.sql`
- Repository queries filter by `uid` (`WHERE uid = ?`, `WHERE id = ? AND uid = ?`).

## Gap Identified
- Request context includes `appId`, but route SQL context currently passes only `userId` (`withRouteSqlUserContext`).
- Recordings SQL and repository do not currently include explicit `app_id` scoping predicates.
- Result: app-level isolation relies on globally unique user ids and/or external assumptions, not explicit app-scoped data constraints.
