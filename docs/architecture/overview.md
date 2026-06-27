# Architecture Overview

AppForge is a shared frontend/backend platform repository centered on reusable features, shared UI infrastructure, and a co-located backend.

## Structure

- `src/features/`: shared product features and viewmodel/usecase slices
- `src/platform/ui/`: shared Tamagui provider/config, the root UI barrel, layouts, visualizer helpers, and a small set of domain-neutral helpers
- `src/platform/ui/theme/`: token schema, defaults, runtime assembly, and theme providers
- `src/platform/*`: shared frontend platform modules such as API, navigation, providers, and core utilities
- `server/`: backend runtime, routing, services, and infrastructure
- `tools/scaffold/`: app and feature generation tooling
- `tools/config-manager/`: local runtime config and secret storage for development

## Boundaries

- Shared frontend platform code stays in `src/platform/*`.
- Feature UI lives under `src/features/*` and composes shared UI exports directly with Tamagui props and shorthands.
- `@ui` / `src/platform/ui/index.ts` is the only supported shared UI import surface.
- `@appforge/platform/theme` is the supported shared theme contract surface for `ThemeOverride`, `UiRuntimeOverride`, `UiOverride`, `ThemeDefinition`, and runtime/theme builders.
- This repository contains the shared visualizer-aware UI support under `src/platform/ui/visualizer*`; the prototype site that consumed it was moved out of this checkout.
- Shared UI does not expose a repo-specific styling DSL. Removed APIs include `Block`, shared `panels`, shared `blocks`, and legacy text variants/tones.
- Runtime config and secrets live in config-manager, not in committed `.env` files.
- The backend is shared infrastructure, even when the frontend app surface is a single example app.

For UI-specific placement and contract rules, use `docs/ui-layer-boundary.md`.
