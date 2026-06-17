# AGENTS.md for `src/apps/appforge-site`

## Scope

- Applies to `src/apps/appforge-site/**`.

## Purpose

- Owns AppForge-specific frontend code: feature slices, navigation, and app-owned presentation.

## Must Follow

- Keep app-specific features under `features/`.
- Keep app-specific route constants under `navigation/`.
- Keep app-owned reusable presentation under `ui/` only when reused by multiple features.
- Prefer shared `src/ui`, providers, and shared feature use cases before adding app-local primitives.
- Do not import from other app scopes under `src/apps/*`.
