# UI Layer Boundary

This document is the canonical architecture contract for the AppForge UI layer.

Its purpose is to keep ownership explicit, keep the public UI API stable, and prevent platform internals from leaking into feature code or external callers.

## Core Rule

Every visual decision has exactly one owner.

When adding or changing a visual value, ask:

> Could two applications reasonably disagree on this?

If yes, the value must be overridable by the application through tokens, primitive contracts, or layouts. AppForge must not hardcode it into primitive render functions as a non-overridable platform opinion.

## Ownership Model

```text
Application
    owns:
        token values
        primitive contract definitions
        layout profiles
        feature composition
        business semantics

AppForge
    owns:
        primitive APIs
        rendering
        behavior
        accessibility
        interaction semantics
        runtime assembly mechanism

Tamagui
    owns:
        renderer implementation
        styled primitives
        token-aware prop resolution
```

Lower layers must not import from higher layers.

## Public UI Surface

`src/platform/ui/index.ts` is the only supported shared UI import surface. Callers should use `@ui`.

Platform callers may rely on:

- open layout primitives such as `YStack`, `XStack`, and `ScrollView`
- closed shared primitives such as `Button`, `Input`, `TextArea`, `Select`, `MultiSelect`, `Avatar`, `Badge`, `Tag`, `ProgressBar`, `Tabs`, `TabbedPanel`, `SizingToolbar`, `ColorPalettePicker`, and `Table`
- token access through `useTheme()` / `useThemeTokens()`
- runtime access through `useUI()`
- layout profile access through `useLayout()`
- provider/bootstrap APIs such as `UIProvider`, `ThemeProvider`, `LayoutProvider`, `createTheme()`, `createContracts()`, `createLayouts()`, and `uiRuntime`

Platform callers may not rely on:

- internal files under `src/platform/ui/*` as a public API
- raw Tamagui theme access through `@ui`
- alternative shared UI import paths
- repo-specific styling DSLs layered on top of the shared primitives
- mutable workspace/tab session state exported through `@ui`

Tamagui is an implementation dependency of the platform, not the primary caller-facing API.

## Layer 1: Theme Tokens

Path: `src/platform/ui/theme/factory.ts`

`Theme` owns only fundamental visual tokens:

- `palette`
- `spacing`
- `typography`
- `radii`
- `breakpoints`

Examples:

- `theme.palette.primary`
- `theme.spacing.md`
- `theme.typography.size.lg`
- `theme.radii.lg`
- `theme.breakpoints.desktop`

`Theme` does not own:

- component appearance
- density or rhythm profiles
- primitive interaction styling
- feature composition
- application semantics

This is a token schema, not an assembled runtime graph.

## Layer 2: Layout Contracts

Path: `src/platform/ui/contracts/layouts.ts`

`LayoutContract` owns density and rhythm.

It defines the shared spatial contract:

- `controlHeight`
- `rowHeight`
- `rowPadding`
- `cellGap`
- `panelPadding`
- `sectionGap`
- `itemGap`
- `iconSize`

Named layout profiles such as `compact`, `comfortable`, or `dashboard` are application-provided implementations of that contract.

Layout contracts do not own:

- colors
- borders
- shadows
- feature arrangement
- business semantics

Examples:

```ts
const layout = useLayout("compact")
```

```tsx
<YStack gap={layout.sectionGap} />
```

```tsx
const { contracts } = useUI()

<Table contract={contracts.table["default"]} layout="compact" />
```

## Layer 3: Primitive Contracts

Paths:

- `src/platform/ui/contracts/primitives/` — one file per primitive, defines the contract interface
- `src/platform/ui/contracts/runtime/contracts.ts` — `PrimitiveContracts` registry (aggregation only)
- `src/platform/ui/contracts/shared/` — reusable realized render concepts (TextContract, ContainerContract, etc.)

Primitive contracts own component appearance.

Examples:

- `contracts.button!["primary"]`
- `contracts.table!["default"]`
- `contracts.avatar!["md"]`
- `contracts.badge!["success"]`
- `contracts.tabs!["default"]`

Primitive contracts may define:

- colors
- borders
- radii
- padding
- typography values used by a primitive
- interaction-state appearance

Primitive contracts do not define:

- feature composition
- row/column arrangement
- business behavior
- cross-feature semantics

Primitive contracts are resolved values consumed by primitives. They are derived from tokens via `createContracts(theme)` above the runtime boundary. Contracts contain only realized render values — no token references or runtime resolution logic.

## Layer 4: UI Runtime

Paths:

- `src/platform/ui/theme/definitions/ui-runtime.ts` — `UiRuntime` and `LayoutLibrary` type definitions
- `src/platform/ui/theme/definitions/factory.ts` — `createContracts()`, `createLayouts()`, `createUiRuntime()`
- `src/platform/ui/theme/definitions/defaults.ts` — default realized runtime (`uiRuntime`, `defaultContracts`, `defaultLayouts`)
- `src/platform/ui/theme/providers/ThemeProvider.tsx` — React context and `useUI()` hook

Runtime containment is not ownership.

The assembled runtime is:

```ts
UiRuntime {
  theme: Theme
  contracts: PrimitiveContracts
  layouts: Record<string, LayoutContract>
}
```

This object exists to make the dependency graph available to React consumers through one lookup surface.

Ownership remains:

- `Theme` owns tokens
- `PrimitiveContracts` owns appearance
- `LayoutContract` owns density/rhythm
- `UiRuntime` is the realized handoff object consumed below the boundary

More precisely:

- AppForge owns the runtime schemas, providers, hooks, and primitive renderers
- applications own the concrete token values, named primitive contracts, named layout profiles, and feature composition that feed that runtime

Use the narrowest API that matches the need:

- `useTheme()` when only tokens are needed
- `useUI()` when a primitive needs platform contracts or named layouts
- `useLayout()` when only the active or named layout profile is needed

## Feature Boundary

Feature UI has its own hard boundary above reusable blocks.

- `View`
  - may resolve theme, layout, and primitive contracts into explicit realized values
  - may assemble feature-local shared styles in `ui/contracts/`
- `Block`
  - may not resolve theme, layout, or primitive contracts for visuals
  - consumes realized values only
- `Scaffold`
  - may resolve layout contracts and structural chrome only
  - must not become a visual semantic-resolution layer

Recommended feature structure:

```text
ui/
  views/
  blocks/
  scaffolds/
  contracts/
```

Stateful tab/workspace orchestration is not part of the UI runtime. `Tabs` and `TabbedPanel` are controlled primitives only. Shared workspace state, controllers, and providers must live outside `src/platform/ui` in non-UI platform modules or feature state/viewmodel layers, then bind into the primitives through explicit props.

Use `*View.tsx`, `*Block.tsx`, and `*Scaffold.tsx` as the naming contract. Avoid `Surface`, `Panel`, and `Card` as architectural layer names.

## Layer 5: Primitives

Path: `src/platform/ui/primitives/**`

Primitives own:

- rendering
- accessibility
- focus behavior
- disabled/loading behavior
- interaction semantics
- internal composition needed to implement the primitive

Primitives do not own application appearance.

Primitives consume the layers below them:

```text
theme/definitions
        ↓
createContracts() / createLayouts()
        ↓
UiRuntime { theme, contracts, layouts }
        ↓
contracts/runtime → contracts/primitives
        ↓
primitives
        ↓
features
```

Semantics terminate at `UiRuntime`. Everything below consumes only fully realized values.

The platform primitive API is intentionally split into two classes.

### Open Layout Primitives

Open layout primitives remain open composition surfaces:

- `YStack`
- `XStack`
- `ScrollView`

Applications own arrangement with these primitives.

Allowed examples:

```tsx
<YStack gap="$md" p="$lg">
  <XStack gap="$sm" ai="center" />
</YStack>
```

AppForge does not attempt to close ordinary flexbox composition for feature code.

### Closed Value Primitives

Closed value primitives expose finite APIs and must not become arbitrary styling surfaces.

Examples:

- `Button`
- `Input`
- `TextArea`
- `Select`
- `MultiSelect`
- `Avatar`
- `Badge`
- `Tag`
- `ProgressBar`
- `Tabs`
- `TabbedPanel`
- `SizingToolbar`
- `ColorPalettePicker`
- `Table`

Allowed examples:

```tsx
const { contracts } = useUI()

<Button contract={contracts.button!["primary"]}>Save</Button>
<Table contract={contracts.table!["default"]} layout="comfortable" />
```

Forbidden direction:

```tsx
<Button bg="red" px="$4" borderRadius={12}>Save</Button>
<Button contract="primary">Save</Button>  {/* contract lookup — resolved too late */}
```

If a visual decision must vary across apps or use cases, it belongs in tokens, primitive contracts, or layouts rather than in arbitrary visual props or late-resolved semantic contract lookups on a closed primitive.

## Text Semantics

Text roles remain platform-owned through:

- `Display`
- `Heading`
- `Label`
- `Body`

These primitives expose semantic props such as `tone`, `size`, and `weight`. Applications may redefine token values, but they should not replace the platform text-role model with ad hoc text styling APIs.

## Scaffolds

Path: `src/platform/ui/scaffolds/**`

Scaffolds own:

- reusable screen structure
- slot composition
- responsive structural behavior

Scaffolds do not own:

- colors
- decorative surface styling
- typography
- app-specific business semantics

Scaffolds may consume layout contracts, but they must not become a dumping ground for visual policy that belongs in primitive contracts or tokens.

## Overrides

Path: `src/platform/ui/theme/definitions/overrides.ts`

Override types are split by ownership.

`ThemeOverride` owns token overrides only:

- `palette`
- `spacing`
- `typography`
- `radii`
- `breakpoints`

There are no runtime-level overrides. Realized values (contracts, layouts) are assembled above the `UiRuntime` boundary by calling `createContracts()` and `createLayouts()` with your theme, then passing the assembled object to `ThemeProvider`.

Rules:

- applications may change values only within the existing schema
- applications may provide their own named contract entries and layout profiles by assembling a custom `UiRuntime` above the provider
- applications may not extend the token schema from feature code
- primitives must not introduce new hardcoded visual defaults where an overridable token field or contract field should carry the value

## Feature Ownership

Feature code under `src/features/**` owns:

- row vs column decisions
- wrapping and local arrangement
- content hierarchy
- business semantics

Good:

```tsx
<XStack gap={layout.itemGap} />
<YStack gap={layout.sectionGap} />
```

Bad:

```ts
theme.arrangements.universities
theme.arrangements.fees
```

The platform provides shared primitives and contracts. Features compose them. Features do not extend the platform contract ad hoc.

## Tool-Editable Surface

External tools and visualizer flows may rely on:

- stable UI IDs and human-readable labels exposed through the platform visualizer helpers
- existing primitive APIs
- existing contract names and contract fields
- existing layout profiles and layout fields
- existing token override fields

They may not treat the following as open-ended editable surfaces:

- arbitrary Tamagui props on closed primitives
- arbitrary CSS or raw style overrides
- arbitrary positioning or transform props
- new platform APIs invented outside the shared contract

If a new kind of edit must become durable, the platform must model it explicitly as a token field, contract field, layout field, or primitive prop.

## Enforcement

- `@ui` / `src/platform/ui/index.ts` is the only supported shared UI import surface
- `src/platform/ui/contracts/primitives/` — one interface per primitive; no semantic names or token refs
- `src/platform/ui/contracts/runtime/` — `PrimitiveContracts` registry; no render logic
- `src/platform/ui/contracts/shared/` — reusable realized render concepts
- `src/platform/ui/theme/definitions/` — semantic construction layer (tokens → realized runtime)
- `src/platform/ui/theme/providers/` — React runtime access layer (ThemeProvider, hooks)
- `src/platform/ui/primitives/**` — closed primitive APIs; consume only realized contract values
- `src/platform/ui/scaffolds/**` — reusable structural helpers

Checks:

- `npm run typecheck`
- targeted UI tests near changed primitives or theme/runtime files

Architecture violations include:

- exporting renderer-specific escape hatches as part of the public platform API
- hardcoding non-overridable application appearance into primitives
- treating runtime containment as ownership
- adding feature-specific visual schema to `Theme`
- adding alternative shared styling DSLs on top of `@ui`
