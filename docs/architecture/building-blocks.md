# Building Blocks

AppForge frontend code should be assembled from Tamagui-native composition instead of app-owned styling DSLs.

## Shared UI Layers

- `src/ui/index.ts`: the only supported shared UI import surface
- `src/ui/config.ts`: Tamagui tokens, themes, and configuration
- `src/ui/Provider.tsx`: app-level Tamagui provider wiring
- `src/ui/primitives/`: narrowly scoped helpers that remain justified because they encapsulate behavior or rendering details without inventing new styling props
- `src/ui/layouts/`: page-level reusable layout structures

## App Layer

The reference app under `src/apps/example-app/*` should consume `src/ui` directly and only own app-specific composition and behavior.

Screens and feature views should use standard Tamagui props and shorthands such as `f`, `gap`, `ai`, `jc`, `p`, `px`, `py`, `bg`, `br`, `borderColor`, `borderWidth`, and positioning props. Shared wrappers are acceptable only when they encapsulate behavior, accessibility, icon mapping, or non-trivial rendering.

## Scaffold Alignment

The scaffold tool should generate code that imports from `src/ui` and composes `View`, `XStack`, `YStack`, `Text`, `Button`, `Input`, and retained helpers directly. It must not generate `Block`, shared panel wrappers, or legacy text roles.
