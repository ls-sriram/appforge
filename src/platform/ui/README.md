# Platform UI

Caller-facing guide for the shared UI platform API.

Use `@ui` as the only shared import surface. Do not import from `src/platform/ui/*` subpaths in feature code unless you are working on the platform itself.

## Ownership Model

The UI system has a hard resolution boundary at `UiRuntime`.

Above `UiRuntime`:

- `theme` owns visual tokens
- `contracts` own resolved component appearance
- `layouts` own rhythm and density profiles
- application/bootstrap code assembles those values

Below `UiRuntime`:

- `ThemeProvider` only provides a fully realized runtime
- primitives only render explicit values
- feature rendering consumes realized values

That ownership is exposed through the runtime API:

```ts
const ui = useUI()

ui.theme.palette.primary
ui.contracts.button["primary"]
ui.layouts.compact
```

Use the narrowest hook that matches the job:

- `useTheme()` or `useThemeTokens()` when you only need tokens
- `useUI()` when you need primitive contract or layout lookup
- `useLayout()` when you need the active layout profile or an explicit named profile

For layout contracts, the source of truth now lives in [`contracts/layouts.ts`](/Users/sriraml/Documents/GitHub/appforge/src/platform/ui/contracts/layouts.ts):

- `LayoutContract` defines the stable semantic field names
- `layoutContractDefinition` shows what each field means and which platform primitives consume it
- `platformLayoutDefaults` shows the platform's default profile realization side by side
- layout values are fully resolved numbers, including `iconSize`, `fontSize`, and `labelSize`

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

Use open layout primitives for composition. For closed primitives, get a realized contract from `useUI()`:

```tsx
import { XStack, YStack, Body, Heading, Button, useUI } from "@ui"

export function EmptyState() {
  const { contracts } = useUI()

  return (
    <YStack gap="$md" ai="center" p="$lg">
      <Heading fontSize="$5" lineHeight="$5">No projects yet</Heading>
      <Body color="$textSecondary">Create one to get started.</Body>
      <Button contract={contracts.button["primary"]}>Create project</Button>
    </YStack>
  )
}
```

Use closed primitives with realized contracts, not raw visual styling:

- `Button`, `Badge`, `Tag`, `Avatar`, `Tabs`, `Table`, `SizingToolbar`, `TabbedPanel`, `Input`, `TextArea`, `Select`, `MultiSelect`, `SelectableChip`, `ColorPalettePicker` require an explicit `contract` prop — a fully realized value from `useUI().contracts`
- `Body`, `Heading`, `Label`, `Display` accept explicit text values such as `color`, `fontSize`, `lineHeight`, and `fontFamily`
- `Icon` accepts explicit `color` and numeric `size`
- open layout styling belongs on `XStack`, `YStack`, `ZStack`, and `ScrollView`

This is correct:

```tsx
const { contracts } = useUI()

<Button contract={contracts.button["primary"]}>Save</Button>
<Body color="$textMuted" fontSize="$2" lineHeight="$2">Last updated 2m ago</Body>
```

This is not:

```tsx
<Button contract="primary">Save</Button>  {/* contract keys must be resolved before render */}
<Button bg="red" px="$4">Save</Button>    {/* arbitrary styling */}
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
  const { contracts } = useUI()
  const layout = useLayout()

  const table = contracts.table["default"]

  return {
    rowHeight: layout.rowHeight,
    headerColor: table?.header.textColor,
  }
}
```

## Overrides And Custom Runtimes

Runtime/provider overrides no longer exist. Resolve values before you cross the `UiRuntime` boundary.

If you need a dedicated branded runtime, assemble it above the provider:

```ts
import { createTheme, createContracts, createLayouts } from "@ui"

const theme = createTheme({
  brand: {
    primary: "#0F766E",
  },
  fontFamily: "'IBM Plex Sans', sans-serif",
})

export const acmeUi = {
  theme,
  contracts: createContracts(theme),
  layouts: createLayouts(theme),
}
```

Then pass the realized runtime directly:

```tsx
<UIProvider value={acmeUi} />
```

`theme.elevation` remains a semantic token family of resolved cross-platform presets:

```ts
theme.elevation.none
theme.elevation.sm
theme.elevation.md
theme.elevation.lg
theme.elevation.xl
```

## Extension Rules

For platform contributors extending the system:

- add new token fields in `theme/definitions/tokens.ts`
- set platform defaults in `theme/definitions/defaults.ts`
- derive resolved appearance contracts in `theme/definitions/factory.ts` (`createContracts`)
- add new primitive contract interfaces in `contracts/primitives/<name>.ts`
- add new aggregate fields to `contracts/runtime/contracts.ts` (`PrimitiveContracts`)
- derive rhythm profiles in `theme/definitions/factory.ts` (`createLayouts`)
- assemble the final realized runtime above `ThemeProvider`

For feature callers:

- prefer existing contracts and layouts first
- add new contract entries when a primitive needs a reusable appearance
- add new layouts when a screen family needs a reusable rhythm profile
- do not resolve semantics inside primitives or below `UiRuntime`
- do not depend on raw Tamagui theme access through `@ui`

## Related Docs

- Ownership and layering: [`docs/ui-layer-boundary.md`](/Users/sriraml/Documents/GitHub/appforge/docs/ui-layer-boundary.md)
- Durable repository architecture: [`docs/architecture/overview.md`](/Users/sriraml/Documents/GitHub/appforge/docs/architecture/overview.md)
- Contributor rules for platform UI: [`src/platform/ui/AGENTS.md`](/Users/sriraml/Documents/GitHub/appforge/src/platform/ui/AGENTS.md)
