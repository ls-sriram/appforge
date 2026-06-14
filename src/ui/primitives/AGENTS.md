# AGENTS.md for `src/ui/primitives`

## Scope

Applies to `src/ui/primitives/**`.

## Responsibility

Primitives are the lowest reusable UI atoms. They divide into two groups:

**Block** — the universal composition element. Every non-leaf container is a Block.
It combines frame (space occupation), paint (visual surface), and layout (child arrangement)
into a single constrained API. There is **no `style` prop**.

**Leaf atoms** — stateless display controls:
`Text`, `Button`, `Icon`, `Input`, `TextArea`, `Avatar`, `Badge`, `Tag`,
`Chip`, `SelectableChip`, `Link`, `Toggle`, `ProgressBar`, `Skeleton`, `EmptyState`, `LayoutGrid`, `TapTarget`

**Scroll** — `ScrollArea` wraps `ScrollView` with a `fill` shorthand.

## Block API

```tsx
<Block
  frame="fill"          // fill | shrink | center | expand | fluid
  paint="panel"         // see PaintVariant — design-system surfaces only
  direction="vertical"  // vertical | horizontal
  space="md"            // none | xxs | xs | sm | md | lg | xl | 2xl | 3xl
  align="center"        // stretch | center | start | end
  justify="start"       // start | center | end | space-between | space-around
  wrap                  // boolean
  pad="md"              // SpaceToken — explicit padding override
  overflow="hidden"     // "hidden" | undefined
>
  {children}
</Block>
```

**`PaintVariant` (design-system only — no domain concepts)**:
`none | page | wash | panel | panel-muted | panel-strong | panel-subtle | panel-inverse |
selected | neutral | danger | chip-success | chip-warning | chip-danger | chip-info |
table | table-row | table-row-selected`

Use `<Chip tone="success|warning|danger|info">` rather than reaching for `chip-*` paint on
Block directly. `chip-*` paint variants are the implementation detail; `Chip` is the API.

Domain surfaces (application cards, cost cards, icon boxes, etc.) are **not** in
`PaintVariant`. Each domain component owns its own surface via a local `View` +
`StyleSheet` using raw theme tokens.

## Rules

- **No `style` prop on Block.** Every visual decision is a named token prop.
- **No domain terms** — dental, interview, application, etc. do not appear here.
- **No feature imports** — no app, router, or viewmodel imports.
- **Leaf atoms expose semantic APIs** — `variant`, `tone`, `intent`, `size`, `state`, `weight`.
  Avoid CSS-like props (exact padding, arbitrary colors, hard-coded radii).
- **`Icon`, `Tag`, and `ProgressBar` use semantic `tone` and tokenized `size` only.**
  Do not pass raw color strings or numeric icon sizes through the primitive API.
- **`TextArea` uses tokenized `size`, not raw `minHeight`.**
- **`TapTarget` uses semantic `feedback`, not raw `activeOpacity`.**
- **Use `SelectableChip` for selected/default pill interactions** before hand-rolling
  local `Pressable` + border/background/text state for filter chips or tag toggles.
- **Prefer `TapTarget` for simple touch wrappers** in shared UI instead of repeating
  raw `TouchableOpacity` with local opacity tuning.
- **`Surface`, `Stack`, `Inline`, `Frame`, `Center`, `Inset` are deleted.** Do not recreate them.
  Use `Block` for all composition; it covers all those roles.
- **`RecordingTimer` has moved to `src/ui/blocks/`.** Import from `@blocks`, not `@primitives`.
- **Text variants** are generic roles only: `h1–h3`, `pageTitle`, `displayLg`, `displaySm`,
  `tableHeader`, `statLabel`, `statValue`, `numericLg`, `action`, `body`, `bodySm`, `caption`,
  `link`, `mono`. Do not add domain-named variants.
- **Text tones** are semantic only: `primary`, `secondary`, `muted`, `tertiary`, `accent`,
  `success`, `warning`, `danger`, `action`, `inverse`. Do not add domain-named tones.
- **`Text` does not expose `color` or `style`.** Use `tone`, `weight`, `align`, and `frame`.
  If a local implementation truly needs dynamic colour or raw text geometry, use `RNText`
  with `getVariantStyle(...)` inside that implementation instead of pushing an escape hatch
  into the primitive API.
- **Prefer named text roles before raw `Text` variants in shared UI.** Start with
  `MetaText` and `ActionText` for repeated shared semantics; add new roles only when a
  pattern recurs across multiple shared callers.
- **In `src/ui/blocks/**`, do not use `RNText`.** If a common block needs a text treatment
  that `Text` cannot express, add a semantic `Text` prop or a named shared role first.
- **Theme token names** for accent colors are generic: `alertAccent`, `successAccent`,
  `actionAccent`. Do not introduce domain names like `deadlineAccent` or `costAccent`.

## Good Examples

```tsx
// Vertical card with padding
<Block paint="panel" space="sm" pad="md">
  <Text variant="label">{title}</Text>
  <Text variant="body">{body}</Text>
</Block>

// Horizontal row that fills available width
<Block direction="horizontal" space="sm" frame="fill" align="center">
  <Icon name="star" />
  <Text variant="body" frame="fluid">{label}</Text>
</Block>

// Domain component owns its own surface (NOT via Block paint)
function IconBoxWell({ name, tone }: { name: IconName; tone: IconTone }) {
  const theme = useTheme();
  return (
    <View style={[styles.well, { backgroundColor: theme.colors.surfaceWash }]}>
      <Icon name={name} size="lg" tone={tone} />
    </View>
  );
}
const styles = StyleSheet.create({
  well: { width: 30, height: 30, alignItems: "center", justifyContent: "center" },
});
```

## Bad Examples

```tsx
// Bad: style prop on Block
<Block style={{ marginTop: 8 }} />

// Bad: domain concept in PaintVariant
<Block paint="application-card" />  // type error — not in PaintVariant

// Bad: recreating deleted primitives
<Stack space={8}><Text>{x}</Text></Stack>  // Stack is gone — use Block
```
