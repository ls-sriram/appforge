# Architecture Overview

AppForge is a starter/framework repository for building one app across web, mobile, desktop, and a co-located backend.

## Structure

- `app-example-app/`: Expo Router entry root for the reference app
- `src/apps/example-app/`: app-specific routes and screens for the reference app
- `src/apps/appforge-site/`: editor-first AppForge site experience, including the in-memory `ui-visualizer` UI playground
- `src/features/`: shared product features and viewmodel/usecase slices
- `src/ui/`: shared Tamagui provider/config, the root UI barrel, and a small set of domain-neutral helpers
- `src/theme/`: tokens and theme assembly
- `server/`: backend runtime, routing, services, and infrastructure
- `tools/scaffold/`: app and feature generation tooling
- `tools/config-manager/`: local runtime config and secret storage for development

## Boundaries

- App-specific code lives under `src/apps/*`.
- Shared frontend platform code stays in shared `src/*` layers.
- Feature and app UI should compose `src/ui` exports directly with Tamagui props and shorthands.
- `src/ui/index.ts` is the only supported shared UI import surface.
- For the appforge-site build, Metro aliases `src/ui/index.ts` → `src/ui/visualizer/index.ts` to enable the design-time visualizer. See `docs/architecture/ui-visualizer.md`.
- Shared UI does not expose a repo-specific styling DSL. Removed APIs include `Block`, shared `panels`, shared `blocks`, and legacy text variants/tones.
- Runtime config and secrets live in config-manager, not in committed `.env` files.
- The backend is shared infrastructure, even when the frontend app surface is a single example app.
