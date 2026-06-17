# UI Layer Boundary

Strict UI layering for this app. Lower layers must not import from higher layers.

## Layer 1 — Design Tokens (`src/theme/**`)

- Owns palette, semantic colors, spacing, typography, radii, borders, elevation, motion, breakpoints.
- Raw hex/rgba values belong here or in token utilities.
- No feature, route, service, repository, or viewmodel logic.

## Layer 2 — Shared UI Contract (`src/ui/**`)

- `src/ui/index.ts` is the only supported shared UI import surface.
- `src/ui/config.ts` owns the Tamagui config.
- `src/ui/Provider.tsx` owns provider wiring.
- `src/ui/primitives/**` may contain a small number of retained helpers, but only if they solve a real rendering or behavior concern without adding a custom style vocabulary.

Allowed exports:
- direct Tamagui components and types from `src/ui`
- provider/config
- narrowly justified helpers like icon mapping or special input wrappers with ordinary props

Removed shared UI APIs:
- `Block` and its prop/type system
- shared `panels`
- shared `blocks`
- legacy text variants/tones/weights as a public API

## Layer 3 — App and Feature UI (`src/apps/<app>/**`, `src/features/**`)

App and feature UI should compose Tamagui primitives directly:

```tsx
import { Body, Button, Heading, View, XStack, YStack } from "../../ui";

<YStack bg="$bg" f={1} p="$4" gap="$4">
  <Heading>Profile</Heading>
  <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$4" p="$4">
    <Body color="$textMuted">Direct Tamagui props only.</Body>
  </View>
  <XStack gap="$3">
    <Button bg="$primary">
      <Body color="$textInverse" fontFamily="$bold">Save</Body>
    </Button>
  </XStack>
</YStack>
```

Rules:
- Use official Tamagui props and shorthands directly.
- Do not introduce app- or repo-specific styling props such as `paint`, `frame`, `pad`, `between`, `spread`, or custom text tones/variants.
- Named local components are allowed for pixel-specific geometry, accessibility, or rendering that Tamagui props do not express cleanly.
- Feature-local wrappers may exist, but they should compose direct Tamagui primitives rather than recreate a parallel styling DSL.

## Layer 4 — Routes (`app/**`, `app-*/*`)

Thin navigation wiring only. No visual styling or domain rendering.

## Enforcement

- `src/ui/index.ts` is the only supported shared UI import surface.
- Shared helpers must keep ordinary props. No repo-specific public styling DSL.
- Architecture lint: `npm run lint:arch`
- Type check: `npm run typecheck`
