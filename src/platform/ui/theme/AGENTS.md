# AGENTS.md for `src/platform/ui/theme`

## Scope

Applies to `src/platform/ui/theme/**`.

## Responsibility

The theme layer owns:

- design tokens: palette, semantic colors, typography, spacing, radii, breakpoints
- the `Theme` interface and `createTheme()` factory
- the default token set in `defaults.ts`
- the default variant library via `createVariants(theme)`
- the default layout contract library via `createLayouts(theme)`
- runtime assembly via `UiRuntime` and `createUiRuntime(theme)`
- layout lookup via `LayoutProvider` and `useLayout()`

Ownership is distinct from runtime containment:

- `Theme` owns token values only
- `Variants` owns component appearance
- `LayoutContract` owns density/rhythm presets
- `UiRuntime` assembles those three for React lookup

```ts
UiRuntime {
  theme: Theme
  variants: Variants
  layouts: Record<string, LayoutContract>
}
```

Do not infer ownership from `useUI()` object shape.

## Module Structure

- `factory.ts`: token-level `Theme` interface and `createTheme()`
- `defaults.ts`: default brand and default token set
- `variants.ts`: variant factory
- `layouts.ts`: layout factory
- `runtime.ts`: `UiRuntime`, runtime assembly, and override application
- `ThemeProvider.tsx`: React context hooks (`useUI()`, `useTheme()`)

## Runtime Overrides

`ThemeOverride` owns token overrides.

Supported sections:

- `palette`
- `spacing`
- `typography`
- `radii`
- `breakpoints`

`UiRuntimeOverride` owns resolved runtime overrides.

Supported sections:

- `layouts`
- `variants`

`UiOverride` is the combined provider-facing surface accepted by `ThemeProvider` and `UIProvider`.

Rules:

- Token sections override `Theme` ownership only.
- `layouts` override the resolved layout library after `createLayouts(theme)`.
- `variants` override the resolved variant library after `createVariants(theme)`.
- Do not add new primitive-only visual defaults in render functions when a token, layout, or variant override can carry that value.

## Token Rules

- Prefer semantic, app-agnostic token names over feature-specific names.
- Raw hex and rgba values belong here or in token utilities, not in feature UI.
- Add tokens when a value is reused, expresses a semantic role, or supports a shared component contract.
- Avoid adding one-off tokens for a single screen unless they describe a reusable visual role.

## Variant Contract

`createVariants(theme)` returns the default `Variants` map used by `UiRuntime`. Applications can extend it:

```ts
const appVariants = {
  ...createVariants(theme),
  button: {
    ...createVariants(theme).button,
    meditate: { ... },
  },
};
```

Rules:
- Variant fields are concrete resolved values (`string | number`), never token references.
- Each variant key must satisfy its variant interface (`satisfies Record<string, XxxVariant>`).
- `fontFamily` is not a variant field. Primitives read it from `ui.theme.typography.family`.
- Visual decisions that primitives make at render time (sizes, colors, radii) belong in variants, not hardcoded in primitive render functions.

## Layout Contract

`createLayouts(theme)` returns the default named layout contracts. Each entry implements `LayoutContract`:

```ts
LayoutContract {
  controlHeight, rowHeight, rowPadding, cellGap,
  panelPadding, sectionGap, itemGap, iconSize
}
```

`LayoutProvider` sets the active named layout profile. `useLayout(name?)` reads it from `ui.layouts`.

Primitives that are density-sensitive accept `layout?: string` and call `useLayout(layout)`. Feature code reads `useLayout()` to consume the active layout for feature-level spacing.

## Checks

- Run `npm run typecheck` after changing token interfaces, runtime assembly, or theme factory output.
- Focused runtime checks live in `theme.test.ts`.
- Any access to `theme.colors.radii` is a bug — use `theme.radii` instead.
