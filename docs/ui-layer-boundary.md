# UI Layer Boundary

This is the canonical phase-1 contract for the platform UI system.

The platform is a closed-form design system contract. It defines the only legal UI vocabulary that apps, features, and external tools may use.

Lower layers must not import from higher layers.

## Phase 1 Scope

This phase defines:
- the token schema
- the theme schema
- the shared primitive set
- the allowed primitive props and semantic variants
- the stable UI ID contract for inspectable elements
- the allowed theme override surface

This phase does not define:
- block extensibility
- block registries
- block authoring contracts
- editor-specific product UX

## Closed-Form Rule

Outside the platform contract:
- values may change
- composition may change
- theme overrides may change values within the allowed schema

Outside the platform contract, the following may not change unless the platform itself is revised:
- token categories
- theme schema shape
- primitive set
- primitive prop surface
- semantic variant families
- repo-specific styling DSLs

## Layer 1 — Design Tokens (`src/platform/theme/**`)

- Owns palette, semantic colors, spacing, typography, radii, borders, elevation, motion, breakpoints.
- Raw hex/rgba values belong here or in token utilities.
- No feature, route, service, repository, or viewmodel logic.

Platform guarantee:
- token names and categories are finite and platform-owned
- consumers may choose token values through existing props, but may not define new token categories in feature code

## Layer 2 — Shared UI Contract (`src/platform/ui/**`)

- `src/platform/ui/index.ts` is the implementation for the supported shared UI import surface.
- Prefer the package alias `@ui` in consumers.
- `src/platform/ui/config.ts` owns the Tamagui config.
- `src/platform/ui/Provider.tsx` owns provider wiring.
- `src/platform/ui/primitives/**` may contain a small number of retained helpers, but only if they solve a real rendering or behavior concern without adding a custom style vocabulary.

Allowed exports:
- direct Tamagui components and types from `@ui`
- provider/config
- narrowly justified helpers like icon mapping or special input wrappers with ordinary props

Platform guarantee:
- the primitive set is finite and platform-owned
- allowed props and semantic variants are finite and platform-owned
- shared helpers must preserve ordinary props and must not become a secondary styling language

Removed shared UI APIs:
- `Block` and its prop/type system
- shared `panels`
- shared `blocks`
- legacy text variants/tones/weights as a public API

## Allowed Theme Override Surface

Theme overrides are part of the platform contract only when they stay within the platform-defined theme schema.

Definition:
- the base theme schema is defined by `ThemeDefinition` in `src/platform/theme/contracts.ts`
- the default platform theme is assembled in `src/platform/theme/index.ts`
- the allowed override type is `ThemeOverride`
- higher tooling and external consumers should import `ThemeOverride` from `@appforge/platform/theme`
- the current override surface is limited to `ThemeOverride["colors"]`
- nested keys may be overridden only where they already exist in the schema, including semantic colors, spacing, radii, typography, breakpoints, layout, state, and elevation

Application:
- overrides are applied through `applyThemeOverride(baseTheme, override)`
- `ThemeProvider` accepts `override` and re-derives platform shapes from the overridden theme
- overrides change values only; they do not extend the schema

Allowed:
- changing token or semantic theme values through predefined override keys
- supplying app/site-specific theme values at provider/bootstrap time
- tooling that edits those override values

Authoring contract:
- the platform exports the actual TypeScript contract; there is no separate theme-override payload schema
- the intended import surface is `@appforge/platform/theme`

Example:

```ts
import type { ThemeOverride } from "@appforge/platform/theme";

const override: ThemeOverride = {
  colors: {
    primary: "#2563EB",
    textPrimary: "#111827",
    space: {
      md: 20,
    },
    radii: {
      lg: 18,
    },
  },
};
```

Not allowed:
- adding new theme keys outside the platform schema
- removing existing required theme keys
- bypassing the theme contract with app-specific visual APIs

Global theme/layout tokens:
- page-level geometry such as `maxContentWidth`, `maxPageWidth`, `pagePadding`, and `headerHeight` belongs in `ThemeDefinition["colors"]["layout"]`
- those values are global theme/layout tokens, not an editable per-element styling schema

## Layer 3 — Feature UI (`src/features/**`)

App and feature UI should compose the approved platform primitives directly:

```tsx
import { Body, Button, Heading, XStack, YStack } from "@ui";

<YStack bg="$bg" f={1} p="$md" gap="$md">
  <Heading>Profile</Heading>
  <YStack bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$lg" p="$md">
    <Body color="$textMuted">Direct Tamagui props only.</Body>
  </YStack>
  <XStack gap="$sm">
    <Button bg="$primary">
      <Body color="$textInverse" fontFamily="$bold">Save</Body>
    </Button>
  </XStack>
</YStack>
```

Rules:
- Use official Tamagui props and shorthands directly.
- Prefer `YStack`, `XStack`, and other approved platform primitives for feature composition.
- Do not introduce app- or repo-specific styling props such as `paint`, `frame`, `pad`, `between`, `spread`, or custom text tones/variants.
- Named local components are allowed for pixel-specific geometry, accessibility, or rendering that Tamagui props do not express cleanly.
- Feature-local wrappers may exist, but they should compose direct Tamagui primitives rather than recreate a parallel styling DSL.

Feature guarantee:
- features may compose the contract
- features may not extend the contract
- features may define blocks from existing primitives, but block extensibility itself is deferred to a later phase

## Visualizer Contract

This repository keeps the shared visualizer-aware UI support, but not the prototype site that hosted the full visualizer product.

Rules:
- Visualizer-participating stage/layout files should create a scope with `createUi(prefix)` and thread `ui` through child blocks as needed.
- Every meaningful shared primitive that should be discoverable by the visualizer must be stamped with `{...ui("id")}`.
- Wrapped visualizer primitives read `__uiid`, write `data-uiid` to the DOM, and use that ID for click-to-select and inspector overrides.
- Reusable blocks should default `ui` to `noopUi` so they render normally outside visualizer-aware surfaces.

Platform-side responsibility:
- provide stable identity and inspectable rendered nodes

Tool-side responsibility:
- selection UX
- inspector UX
- edit generation
- preview orchestration

The durable contract here is the stable ID scheme, not the product UI of the editor/tool.

Key implementation files:
- `src/platform/ui/viz.ts`
- `src/platform/ui/visualizer-context.tsx`
- `src/platform/ui/visualizer/index.ts`
- `src/platform/ui/visualizer/wrapped.tsx`

## Layer 4 — Routes (`app/**`, `app-*/*`)

Thin navigation wiring only. No visual styling or domain rendering.

## Inspectable Surface

External tooling may inspect and operate on:
- stable UI IDs produced through `createUi(prefix)` and `ui.scope(...)`
- rendered shared primitives carrying `data-uiid`
- platform-defined theme values through the allowed override surface
- primitive props and semantic variants that already exist in the contract

External tooling may not treat the following as open-ended editing surfaces:
- new primitive APIs
- new theme schema keys
- new variant families
- arbitrary styling vocabularies outside the platform contract

## Out Of Scope For This Phase

The following are intentionally deferred:
- how extensible blocks are defined
- whether blocks are registered/discoverable as first-class platform concepts
- which block-level fields are editable by tooling
- block serialization, persistence, and migration rules
- product-level editor workflows

## Enforcement

- `@ui` / `src/platform/ui/index.ts` is the only supported shared UI import surface.
- Shared helpers must keep ordinary props. No repo-specific public styling DSL.
- Architecture lint: `npm run lint:arch`
- Type check: `npm run typecheck`
