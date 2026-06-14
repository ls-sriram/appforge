# AGENTS.md for src/theme

## Scope

- Applies to `src/theme/**`.

## Responsibility

- Theme owns design tokens: palette, semantic colors, typography, spacing, radii, borders, elevation, motion, breakpoints, and layout constants.
- Theme should make visual systems reusable without requiring feature-level hardcoded styles.

## Token Rules

- Prefer semantic, app-agnostic token names over feature-specific names.
- Raw hex and rgba values belong here or in token utilities, not in feature UI or blocks.
- Add tokens when a value is reused, expresses a semantic role, or supports a shared component contract.
- Avoid adding one-off tokens for a single screen unless they describe a reusable visual role.

## Checks

- Run `npm run typecheck` after changing token interfaces or theme factory output.
