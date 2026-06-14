# AGENTS.md for `src/features/auth/ui`

## Scope

- Applies to `src/features/auth/ui/**`.

## Purpose

- Owns shared auth presentation: blocks, scaffolds, and auth-local theme helpers.
- Used by login, register, forgot-password, and welcome screens.

## Must Follow

- Keep `blocks/` presentational and driven by props only.
- Keep `scaffolds/` responsible for layout chrome only.
- Keep auth-specific tokens in `theme/`.
- Do not import repositories, controllers, or feature hooks into `ui/**`.
