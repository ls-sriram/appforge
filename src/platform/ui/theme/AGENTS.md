# AGENTS.md — `src/platform/ui/theme`

## Scope

Applies to `src/platform/ui/theme/**`.

## Module Structure

```
theme/
  definitions/
    tokens.ts       — Theme interface and createTheme()
    options.ts      — ThemeOptions, BrandColors
    overrides.ts    — ThemeOverride, DeepPartial
    defaults.ts     — default token set, defaultContracts, defaultLayouts, uiRuntime
    factory.ts      — createContracts(), createLayouts(), createUiRuntime()
    ui-runtime.ts   — UiRuntime and LayoutLibrary type definitions
    index.ts        — barrel for definitions exports

  providers/
    ThemeProvider.tsx   — ThemeProvider, useUI(), useTheme(), useThemeTokens()
    DensityProvider.tsx — LayoutProvider, DensityProvider, useLayout()
    ViewportProvider.tsx — ViewportProvider, useViewportOverride()
    Viewport.ts         — ViewportInfo, ViewportTier, useViewport(), getViewportTier()
    index.ts            — barrel for providers exports
```

Flat files at `theme/*.ts` are backward-compat re-export stubs only. Do not add new logic to them.

## Responsibility

- `definitions/` — semantic construction layer: tokens → realized runtime. No React, no providers, no hooks.
- `providers/` — React runtime access layer: context and hooks only. No token math, no contract assembly.

## Contract Construction Rules

The semantic → realized transition occurs exactly once, inside `createContracts()`.

### Location

`theme/definitions/factory.ts`

Exports:
- `createContracts(theme: Theme): PrimitiveContracts`
- `createLayouts(theme: Theme): LayoutLibrary`
- `createUiRuntime(theme: Theme): UiRuntime`

### Ownership

`createContracts()` owns:
- semantic interpretation
- token lookup
- visual derivation
- default appearance policy
- contract assembly

`createContracts()` does NOT own:
- React context
- runtime lookup
- rendering
- primitive behavior

### Input / Output

```
Theme { palette, spacing, typography, radii, elevation, breakpoints }
        ↓
createContracts()
        ↓
PrimitiveContracts
```

### Allowed Operations

`createContracts()` MAY:
- read any `theme.*` field
- derive muted, selected, hover, disabled colors via `alpha()` or arithmetic
- derive padding, spacing, borders, radii, typography values
- derive shadows from `theme.elevation`

Example:
```ts
const primaryMuted = alpha(theme.palette.primary, 0.12)
```

### Forbidden Operations

`createContracts()` MAY NOT:
- import React
- access providers, hooks, `useTheme()`, `useUI()`, `useLayout()`
- access runtime state
- return semantic values, token references, or contract lookup names

Bad:
```ts
color: "$primary"
tone: "danger"
contract: "primary"
```

Good:
```ts
color: "#4F8EF7"
borderRadius: 16
fontSize: 14
```

### Contract Completeness

Every primitive contract must supply all render-critical values the primitive reads.
Primitives must never invent values at render time.

Required field groups by contract:

| Contract | Required top-level fields |
|---|---|
| `ButtonContract` | `frame`, `text`, `interaction` |
| `BadgeContract` | `container`, `text`, `interaction` |
| `TagContract` | `container`, `text`, `interaction` |
| `InputContract` | `field`, `interaction` |
| `TextAreaContract` | `field`, `interaction` |
| `SelectContract` | `label`, `trigger`, `text`, `icon`, `menu`, `option`, `helper`, `layout`, `interaction` |
| `MultiSelectContract` | `label`, `trigger`, `text`, `icon`, `menu`, `option`, `token`, `helper`, `layout`, `interaction` |
| `SelectableChipContract` | `container`, `shape`, `text`, `interaction` |
| `AvatarContract` | `frame`, `text`, `interaction` |
| `ProgressBarContract` | `track`, `fill` |
| `TableContract` | `container`, `header`, `row`, `cell`, `empty`, `interaction` |
| `TabsContract` | `list`, `item`, `icon`, `text` |
| `SizingToolbarContract` | `container`, `button`, `icon` |
| `TabbedPanelContract` | `actionButton`, `actionIcon`, `layout` |
| `ColorPalettePickerContract` | `preview`, `swatch`, `input`, `label`, `helper`, `error`, `icon` |

### Architecture Invariant

```
theme/definitions
        ↓
createContracts() / createLayouts()
        ↓
UiRuntime { theme, contracts, layouts }
────────────────────────────────────────
contracts/runtime → contracts/primitives
        ↓
primitives
        ↓
render
```

All semantic decisions terminate inside `createContracts()`.
Everything below `UiRuntime` consumes only fully realized values.

## Token Rules

- Prefer semantic, app-agnostic token names over feature-specific names.
- Raw hex and rgba values belong in `factory.ts` or `defaults.ts`, not in feature UI.
- Add tokens when a value is reused, expresses a semantic role, or supports a shared contract.
- Avoid one-off tokens for a single screen unless they describe a reusable visual role.

## Resolution Boundary

- `ThemeProvider` and `UIProvider` receive a fully realized `UiRuntime`. They do not merge, override, or re-resolve runtime state.
- Do not add primitive-only visual defaults in render functions when a contract field can carry the value.

## Checks

- `npm run typecheck` after changing token interfaces, runtime assembly, or factory output
- `npx jest theme.test.ts` for runtime assembly regression tests
- Any access to `theme.colors.radii` is a bug — use `theme.radii` instead
