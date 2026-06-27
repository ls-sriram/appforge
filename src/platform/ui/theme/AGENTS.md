# AGENTS.md for `src/platform/ui/theme`

## Scope

Applies to `src/platform/ui/theme/**`.

## Responsibility

The theme layer owns:

- design tokens: palette, semantic colors, typography, spacing, radii, borders, elevation, breakpoints, layout constants
- the `Theme` interface and `createTheme()` factory
- the default variant library via `createVariants(tokens)`
- the default layout contract library via `createLayouts(tokens)`
- density management via `DensityProvider` and `useLayout()`

## Theme Structure

`Theme` (returned by `createTheme()`) has two top-level branches:

```ts
Theme {
  colors: { ... }   // all color, space, typography tokens
  radii: { none, sm, md, lg, xl, pill, full }  // top-level, NOT under colors
}
```

`radii` is top-level on `Theme`. Do not nest it under `colors`.

## Token Rules

- Prefer semantic, app-agnostic token names over feature-specific names.
- Raw hex and rgba values belong here or in token utilities, not in feature UI.
- Add tokens when a value is reused, expresses a semantic role, or supports a shared component contract.
- Avoid adding one-off tokens for a single screen unless they describe a reusable visual role.

## Variant Contract

`createVariants(tokens)` returns the default `Variants` map that applications pass to `ThemeProvider`. Applications can extend it:

```ts
const appVariants = {
  ...createVariants(tokens),
  button: {
    ...createVariants(tokens).button,
    meditate: { ... },
  },
};
```

Rules:
- Variant fields are concrete resolved values (`string | number`), never token references.
- Each variant key must satisfy its variant interface (`satisfies Record<string, XxxVariant>`).
- `fontFamily` is not a variant field. Primitives read it directly from `theme.colors.typography.fontFamily`.
- Visual decisions that primitives make at render time (sizes, colors, radii) belong in variants, not hardcoded in primitive render functions.

## Layout Contract

`createLayouts(tokens)` returns the default named layout contracts. Each entry implements `LayoutContract`:

```ts
LayoutContract {
  controlHeight, rowHeight, rowPadding, cellGap,
  panelPadding, sectionGap, itemGap, iconSize
}
```

`DensityProvider` sets the active named layout contract. `useLayout(name?)` reads it.

Primitives that are density-sensitive accept `layout?: string` and call `useLayout(layout)`. Feature code reads `useLayout()` to consume the active layout for feature-level spacing.

## Checks

- Run `npm run typecheck` after changing token interfaces or theme factory output.
- Any access to `theme.colors.radii` is a bug — use `theme.radii` instead.
