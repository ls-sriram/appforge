# AGENTS.md for `src/ui`

## Scope

Applies to `src/ui/**`.

## Purpose

Shared, domain-free UI foundation built on Tamagui.

`src/ui/index.ts` is the only supported shared UI import surface.

## Composition rules

1. Use official Tamagui props and shorthands directly in consumers.
2. Re-export from `src/ui/index.ts`; do not create alternate shared import paths.
3. Do not invent repo-specific styling props such as `paint`, `frame`, `pad`, `between`, `spread`, or text tone/variant enums.
4. Shared wrappers are allowed only when they encapsulate behavior, accessibility, icon mapping, non-trivial rendering, or unavoidable React Native interop.
5. Shared wrappers must keep ordinary props. They must not become a parallel styling DSL.
6. Use theme tokens (`$spaceN`, `$radiusN`, `$colorName`) for styling.

## Shared Surface

- `config.ts`: Tamagui config and theme tokens
- `Provider.tsx`: app-level provider wiring
- `index.ts`: root barrel for Tamagui exports and approved helpers
- `layouts/`: shared layout geometry helpers when truly reusable
- `primitives/`: retained helpers only

## Removed APIs

- `Block`
- shared `panels`
- shared `blocks`
- legacy custom text variants/tones/weights
