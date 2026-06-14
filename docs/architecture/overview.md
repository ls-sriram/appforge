# Architecture Overview

AppForge is a starter/framework repository for building one app across web, mobile, desktop, and a co-located backend.

## Structure

- `app-example-app/`: Expo Router entry root for the reference app
- `src/apps/example-app/`: app-specific routes and screens for the reference app
- `src/features/`: shared product features and viewmodel/usecase slices
- `src/ui/`: shared primitives, panels, blocks, and layouts
- `src/theme/`: tokens and theme assembly
- `server/`: backend runtime, routing, services, and infrastructure
- `tools/scaffold/`: app and feature generation tooling
- `tools/config-manager/`: local runtime config and secret storage for development

## Boundaries

- App-specific code lives under `src/apps/*`.
- Shared frontend platform code stays in shared `src/*` layers.
- Runtime config and secrets live in config-manager, not in committed `.env` files.
- The backend is shared infrastructure, even when the frontend app surface is a single example app.
