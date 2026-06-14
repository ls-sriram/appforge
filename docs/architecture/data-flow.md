# Architecture Data Flow

## Purpose

- Document core request/response and async flows.

## Synchronous Flow

- Client calls API routes defined by proto annotations.
- Client `src/services/ApiClient.ts` normalizes transport failures (timeout/network/http) and returns a stable `{ ok, status, data | error }` result contract to services/repositories.
- Server validates, executes domain logic, persists as needed.
- Response shape follows protobuf contract.

## Asynchronous Flow

- Document background jobs/events here as they are introduced.

## Update Rule

- Update this doc when request paths or async pipelines change.
