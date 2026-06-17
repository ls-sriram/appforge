# UI Guidelines Summary

Condenses the repo's UI AGENTS files and main UI principles into one place.
Full boundary spec: `docs/ui-layer-boundary.md`.

## Core Rules

- Reuse existing patterns before creating new abstractions.
- Use `src/ui/index.ts` as the only shared UI import surface.
- Compose official Tamagui props and shorthands directly in app and feature code.
- Respect the layer boundary: theme → shared UI contract → app/feature UI → routes.
- Route, feature, and scaffold files are composition-only.
- Run `npm run typecheck` and `npm run lint:arch` after UI changes.

## Shared UI Contract

- `src/ui` owns Tamagui config/provider wiring and the root barrel.
- Shared exports should be Tamagui components/types or narrowly justified helpers with ordinary props.
- Removed public APIs include `Block`, shared `panels`, shared `blocks`, and legacy text variants/tones.

```tsx
import { Body, Button, Heading, View, XStack, YStack } from "../src/ui";

<YStack bg="$bg" f={1} p="$4" gap="$4">
  <Heading>{title}</Heading>
  <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$4" p="$4">
    <Body color="$textMuted">{body}</Body>
  </View>
  <XStack gap="$3" ai="center">
    <Button bg="$primary">
      <Body color="$textInverse" fontFamily="$bold">Continue</Body>
    </Button>
  </XStack>
</YStack>
```

## Layer Ownership

| Layer | Path | Owns |
|---|---|---|
| Tokens | `src/theme/**` | Colors, spacing, typography, radii, breakpoints |
| Shared UI | `src/ui/**` | Tamagui config/provider, root barrel, narrow helpers |
| App UI | `src/apps/<app>/ui/**` | App-shared components, scaffolds, theme |
| Features | `src/apps/<app>/features/**`, `src/features/**` | Feature composition, viewmodel wiring |
| Routes | `app/**`, `app-*/*` | Navigation wiring only |

## Allowed Wrappers

- Keep a shared wrapper only if it encapsulates behavior, accessibility, icon mapping, non-trivial rendering, or unavoidable React Native interop.
- Do not keep a shared wrapper that only renames spacing, layout, surface, or text props.
- Feature-local wrappers are acceptable when they stay compositional and do not become a new styling language.

```tsx
function ScoreRing({ children }: { children: React.ReactNode }) {
  return <View borderWidth={3} borderColor="$primary" br="$10">{children}</View>;
}
```

## Practical Checklist

- Need a color? Use a theme token.
- Need a layout container? Use `View`, `XStack`, or `YStack` with Tamagui props.
- Need a card surface? Compose it with `bg`, `borderColor`, `borderWidth`, `br`, and padding tokens directly.
- Need a fixed-size geometric shape? Create a named local component.
- Need app-wide shared presentation? Put it in `src/apps/<app>/ui/components/`.
- Avoid inventing custom UI prop vocabularies.
