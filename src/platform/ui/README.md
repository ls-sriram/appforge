# Platform UI

Caller-facing guide for the shared UI platform API.

Use `@ui` as the only shared import surface. Do not import from `src/platform/ui/*` subpaths in feature code unless you are working on the platform itself.

## Ownership Model

The runtime is assembled from three separate concerns:

- `theme` owns visual tokens
- `variants` own component appearance
- `layouts` own rhythm and density profiles

That ownership is exposed through the runtime API:

```ts
const ui = useUI()

ui.theme.palette.primary
ui.variants.button.primary
ui.layouts.compact
```

Use the narrowest hook that matches the job:

- `useTheme()` or `useThemeTokens()` when you only need tokens
- `useUI()` when you need variant or layout lookup
- `useLayout()` when you need the active layout profile or an explicit named profile

## App Setup

Wrap the app once at the root:

```tsx
import { UIProvider } from "@ui"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <UIProvider>{children}</UIProvider>
}
```

To select a layout profile for a subtree, add `LayoutProvider`:

```tsx
import { LayoutProvider } from "@ui"

export function SettingsPage() {
  return (
    <LayoutProvider layout="comfortable">
      <SettingsScreen />
    </LayoutProvider>
  )
}
```

## Writing UI

Use open layout primitives for composition:

```tsx
import { XStack, YStack, Body, Heading, Button } from "@ui"

export function EmptyState() {
  return (
    <YStack gap="$md" ai="center" p="$lg">
      <Heading size="lg">No projects yet</Heading>
      <Body tone="secondary">Create one to get started.</Body>
      <Button variant="primary">Create project</Button>
    </YStack>
  )
}
```

Use closed primitives with semantic props, not raw visual styling:

- `Button`, `Badge`, `Tag`, `Avatar`, `Tabs`, `Table`, `SizingToolbar`, `TabbedPanel` use `variant`
- `Body`, `Heading`, `Label`, `Display` use `tone`, `size`, and `weight`
- open layout styling belongs on `XStack`, `YStack`, and `ScrollView`

This is correct:

```tsx
<Button variant="primary">Save</Button>
<Body tone="muted" size="sm">Last updated 2m ago</Body>
```

This is not:

```tsx
<Button bg="red" px="$4">Save</Button>
```

## Hook Usage

Read tokens directly when composing custom layout:

```tsx
import { useTheme, YStack } from "@ui"

export function Pane({ children }: { children: React.ReactNode }) {
  const theme = useTheme()

  return (
    <YStack
      bg={theme.palette.surface}
      borderColor={theme.palette.border}
      borderWidth={1}
      br={theme.radii.lg}
      p={theme.spacing.md}
    >
      {children}
    </YStack>
  )
}
```

Read runtime lookups when you need owned appearance or layout contracts:

```tsx
import { useUI, useLayout } from "@ui"

export function TableMeta() {
  const ui = useUI()
  const layout = useLayout()

  const table = ui.variants.table?.default

  return {
    rowHeight: layout.rowHeight,
    headerColor: table?.headerBackgroundColor,
  }
}
```

## Overrides And Custom Runtimes

Use token overrides to change token ownership only:

```tsx
import { UIProvider, uiRuntime, type ThemeOverride } from "@ui"

const themeOverride: ThemeOverride = {
  palette: {
    primary: "#0F766E",
  },
  spacing: {
    md: 18,
  },
}

<UIProvider value={uiRuntime} override={themeOverride} />
```

Use runtime overrides when changing layout profiles or component variants:

```tsx
import { UIProvider, uiRuntime, type UiRuntimeOverride } from "@ui"

const runtimeOverride: UiRuntimeOverride = {
  layouts: {
    dashboard: {
      rowHeight: 44,
      panelPadding: 20,
    },
  },
  variants: {
    button: {
      primary: {
        minHeight: 44,
      },
    },
  },
}

<UIProvider value={uiRuntime} override={runtimeOverride} />
```

If you need a dedicated branded runtime, build it once and pass it into `UIProvider`:

```ts
import { createAppUiRuntime } from "@ui"

export const acmeUi = createAppUiRuntime({
  brand: {
    primary: "#2563EB",
  },
  fontFamily: "'IBM Plex Sans', sans-serif",
})
```

## Extension Rules

For platform contributors extending the system:

- add new token fields in `theme/factory.ts`
- set platform defaults in `theme/defaults.ts`
- derive appearance in `theme/variants.ts`
- derive rhythm profiles in `theme/layouts.ts`
- assemble final runtime in `theme/runtime.ts`

For feature callers:

- prefer existing variants and layouts first
- add new variants when a primitive needs a reusable appearance
- add new layouts when a screen family needs a reusable rhythm profile
- do not hardcode platform theme values into primitives
- do not depend on raw Tamagui theme access through `@ui`

## Related Docs

- Ownership and layering: [`docs/ui-layer-boundary.md`](/Users/sriraml/Documents/GitHub/appforge/docs/ui-layer-boundary.md)
- Durable repository architecture: [`docs/architecture/overview.md`](/Users/sriraml/Documents/GitHub/appforge/docs/architecture/overview.md)
- Contributor rules for platform UI: [`src/platform/ui/AGENTS.md`](/Users/sriraml/Documents/GitHub/appforge/src/platform/ui/AGENTS.md)
