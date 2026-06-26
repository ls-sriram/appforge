# AGENTS.md for `src/platform/ui`

## Scope

Applies to `src/platform/ui/**`.

## Purpose

Shared, domain-free UI foundation built on Tamagui.

`src/platform/ui/index.ts` is the implementation for the supported shared UI import surface. Prefer `@ui` in consumers.

## Composition rules

1. Use official Tamagui props and shorthands directly in consumers.
2. Re-export from `src/platform/ui/index.ts`; do not create alternate shared import paths.
3. Do not invent repo-specific layout or surface styling props such as `paint`, `frame`, `pad`, `between`, `spread`, `fill`, `inset`, or `space`.
4. Shared wrappers are allowed only when they encapsulate behavior, accessibility, icon mapping, non-trivial rendering, or unavoidable React Native interop.
5. Shared wrappers must keep ordinary props. They must not become a parallel styling DSL.
6. Use theme tokens (`$spaceN`, `$radiusN`, `$colorName`) for styling.

## Text atom variants

`Display`, `Heading`, `Label`, and `Body` expose `tone`, `size`, and `weight` variant props. These are **retained** — they express typographic role and semantic color, not a parallel styling DSL:

- `tone`: `primary` | `secondary` | `muted` | `accent` | `inverse` | `danger` | `success` | `warning` | `info`
- `size`: component-specific scale (e.g. `xs`/`sm`/`md`/`lg`/`xl` for `Body`)
- `weight`: `regular` | `bold`

Use these instead of raw `color`, `fontFamily`, or `fontSize` when the semantic maps cleanly. Do not add new variant enums beyond those already defined.

## Shared Surface

- `config.ts`: Tamagui config and theme tokens
- `Provider.tsx`: app-level provider wiring
- `index.ts`: root barrel for Tamagui exports and approved helpers
- `scaffolds/`: shared slot-structured scaffold helpers when truly reusable
- `primitives/`: retained leaf primitives only

## Removed APIs

The following no longer exist and must not be imported:

- `Block` — use `XStack` and `YStack` with raw Tamagui props
- `Col`, `Row`, `Card`, `Screen`, `Rule`, `Divider`, `AbsLayer` (all from old `SStack`) — removed; use `XStack`/`YStack`
- `shared panels` — removed; compose `XStack`/`YStack` inline per screen
- `shared blocks` — removed; compose inline per feature
- `Text variant="h3"` / `Text variant="bodySm"` / `Text weight="bold"` (old enum API) — use `Heading`/`Body`/`Label`/`Display` with `tone`/`size`/`weight` props instead
