# UI Guidelines Summary

Condenses the repo's UI AGENTS files and main UI principles into one place.
Full boundary spec: `docs/ui-layer-boundary.md`.

## Core Rules

- Reuse existing patterns before creating new abstractions.
- Every visual decision flows through named token props — never inline style objects.
- Respect the layer boundary: theme → primitives → panels → blocks → feature UI → routes.
- Route, feature, and scaffold files are composition-only.
- Run `npm run typecheck` and `npm run lint:arch` after UI changes.

## Primitive System

`Block` is the universal composition element (replaces `Frame`, `Stack`, `Inline`,
`Inset`, `Center`, `Surface` — all deleted). Every non-leaf container is a Block.

```tsx
// Vertical stack with panel paint
<Block paint="panel" space="md" pad="md">
  <Text variant="h2">{title}</Text>
  <Text variant="body">{body}</Text>
</Block>

// Horizontal row, fills parent, children aligned center
<Block direction="horizontal" space="sm" frame="fill" align="center">
  <Icon name="check" />
  <Text variant="body" frame="fluid">{label}</Text>
  <Badge label="3" />
</Block>
```

`PaintVariant` covers design-system surfaces only (`panel`, `wash`, `selected`,
`chip-*`, `table-row`, etc.). Domain surfaces live in the domain component itself —
not as Block paint variants.

## Layer Ownership

| Layer | Path | Owns |
|---|---|---|
| Tokens | `src/theme/**` | Colors, spacing, typography, radii, breakpoints |
| Primitives | `src/ui/primitives/**` | `Block`, leaf atoms, `ScrollArea` |
| Panels | `src/ui/panels/**` | `Panel`, `SectionPanel`, `CalloutPanel`, `OverlaySheetShell` |
| Blocks | `src/ui/blocks/**` | App-agnostic composites |
| App UI | `src/apps/<app>/ui/**` | App-shared components, scaffolds, theme |
| Features | `src/apps/<app>/features/**` | Feature composition, viewmodel wiring |
| Routes | `app/**`, `app-*/*` | Navigation wiring only |

> `src/ui/components/` is **deleted** and `src/ui/**` does not exist.
> Import panels from `src/ui/panels/`, blocks from `src/ui/blocks/`.

## Block Naming Rule

**No raw unnamed `View` in blocks.** If a block needs a fixed-size or dynamic-color
container, create a named local component:

```tsx
// Good — named, owns its geometry
function ScoreRing({ score }: { score: number }) {
  const theme = useTheme();
  return <View style={[styles.ring, { borderColor: theme.colors.primary }]} />;
}
const styles = StyleSheet.create({ ring: { width: 48, height: 48, borderRadius: 24, borderWidth: 3 } });

// Bad — anonymous View with magic numbers inline
<View style={{ width: 48, height: 48 }}>...</View>
```

## Scaffold Contract

App-specific navigation chrome lives in `src/apps/<app>/ui/scaffolds/`. Scaffolds
expose semantic slot props, call `useViewport()` internally, and never receive an
`isDesktop` prop from callers. `src/ui/scaffolds/` is deleted — screen-level
safe-area handling uses `<Block safeArea="all|top|bottom">` instead.

```tsx
// App scaffold with named slots
<DipNavigationScaffold content={<FeatureView />} />

// Full-screen root block (replaces PageScaffold)
<Block frame="fill" paint="page" safeArea="all">
  {children}
</Block>
```

## Domain Surface Rule

Domain-specific visual surfaces (application cards, cost cards, icon boxes) are **not**
`PaintVariant` entries. Each domain block component creates its own `View` + `StyleSheet`
using raw theme color tokens:

```tsx
// Good — ApplicationCard owns its own surface
const cardStyle = {
  backgroundColor: applied ? theme.colors.surfaceWash : theme.colors.surface,
  borderWidth: borderWidths.normal,
  borderColor: applied ? theme.colors.borderSubtle : theme.colors.border,
  borderRadius: theme.radii.md,
};
return <View style={cardStyle}>{children}</View>;

// Bad — domain concept in Block paint
<Block paint="application-card">  // compile-time type error
```

## DIP Content Shell

Any DIP layout that owns a `ScrollView` must use `DipContentShell` (from
`src/ui/layouts/CenteredPageLayout`):

```tsx
<DipContentShell maxWidth={800}>
  <SectionPanel title="QUESTION BANK">
    {children}
  </SectionPanel>
</DipContentShell>
```

`DIP_CONTENT_SPACING = { mobile: 16, desktop: 30, sectionGap: 16 }` — never hardcode
padding pixel values. Import and use these constants instead.

## Practical Checklist

- Need a color? Use a theme token.
- Need a layout container? Use `Block` with `frame`/`direction`/`space`/`pad`.
- Need a card surface? Use `Panel` (or `SectionPanel`/`CalloutPanel`).
- Need a shared UI pattern? Check `src/ui/blocks/` first.
- Need a fixed-size geometric shape? Create a **named** local component, not an inline View.
- Need app-wide shared presentation? Put it in `src/apps/<app>/ui/components/`.
- Avoid `StyleSheet` in feature views — visual structure belongs in blocks/components.
