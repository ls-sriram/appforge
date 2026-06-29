# AGENTS.md for `src/platform/ui/theme`

## Scope

Applies to `src/platform/ui/theme/**`.

## Responsibility

The theme layer owns:

- design tokens: palette, semantic colors, typography, spacing, radii, breakpoints
- the `Theme` interface and `createTheme()` factory
- the default token set in `defaults.ts`
- the default primitive contract library via `createContracts(theme)`
- the default layout contract library via `createLayouts(theme)`
- the `UiRuntime` boundary and default realized runtime assembly
- layout lookup via `LayoutProvider` and `useLayout()`

Ownership is distinct from runtime containment:

- `Theme` owns token values only
- `PrimitiveContracts` own resolved component appearance
- `LayoutContract` owns density/rhythm presets
- `UiRuntime` assembles those three for React lookup

```ts
UiRuntime {
  theme: Theme
  contracts: PrimitiveContracts
  layouts: Record<string, LayoutContract>
}
```

Do not infer ownership from `useUI()` object shape.

## Module Structure

- `factory.ts`: token-level `Theme` interface and `createTheme()`
- `defaults.ts`: default brand and default token set
- `variants.ts`: resolved primitive contract factory
- `layouts.ts`: layout factory
- `runtime.ts`: `UiRuntime` and the default realized runtime
- `ThemeProvider.tsx`: React context hooks (`useUI()`, `useTheme()`)

## Resolution Boundary

`createTheme()`, `createContracts()`, and `createLayouts()` are construction helpers only.

Rules:

- resolve all token, variant, and layout values before constructing `UiRuntime`
- `ThemeProvider` and `UIProvider` do not merge, override, or re-resolve runtime state
- do not add new primitive-only visual defaults in render functions when a token, layout, or variant contract can carry that value

## Token Rules

- Prefer semantic, app-agnostic token names over feature-specific names.
- Raw hex and rgba values belong here or in token utilities, not in feature UI.
- Add tokens when a value is reused, expresses a semantic role, or supports a shared component contract.
- Avoid adding one-off tokens for a single screen unless they describe a reusable visual role.

## Primitive Contracts

`createContracts(theme)` returns the default resolved primitive contract map used by `UiRuntime`. Applications can extend it:

```ts
const appContracts = {
  ...createContracts(theme),
  button: {
    ...createContracts(theme).button,
    meditate: { ... },
  },
};
```

Rules:
- Contract fields are concrete resolved values (`string | number`), never token references.
- Each contract key must satisfy its contract interface (`satisfies Record<string, XxxContract>`).
- primitives must not read visual values from `ui.theme` after variant/layout lookup; add explicit fields when needed
- Visual decisions that primitives make at render time (sizes, colors, radii) belong in resolved contracts, not hardcoded in primitive render functions.

## Layout Contract

`createLayouts(theme)` returns the default named layout contracts. Each entry implements `LayoutContract`:

```ts
LayoutContract {
  controlHeight, rowHeight, rowPadding, cellGap,
  panelPadding, sectionGap, itemGap, iconSize, fontSize, labelSize
}
```

`LayoutProvider` sets the active named layout profile. `useLayout(name?)` reads it from `ui.layouts`.

Primitives that are density-sensitive accept `layout?: string` and call `useLayout(layout)`. Feature code reads `useLayout()` to consume the active layout for feature-level spacing.

## Checks

- Run `npm run typecheck` after changing token interfaces, runtime assembly, or theme factory output.
- Focused runtime checks live in `theme.test.ts`.
- Any access to `theme.colors.radii` is a bug — use `theme.radii` instead.
