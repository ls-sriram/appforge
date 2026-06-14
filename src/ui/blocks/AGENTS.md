# AGENTS.md for `src/ui/blocks`

## Scope

Applies to `src/ui/blocks/**`.

## Responsibility

Blocks are app-agnostic composites. They combine primitives and panels into
reusable, named UI patterns — search bars, metric cards, settings rows, navigation
tiles, empty states, etc. They must stay free of domain concepts.

## Placement Rule

| Scope | Location |
|---|---|
| Reusable across all apps | `src/ui/blocks/` |
| App-wide, used across ≥2 features | `src/apps/<app>/ui/blocks/` |
| Single-feature only | `src/apps/<app>/features/<feature>/<name>.block.tsx` |

Account settings cards, snippet editors, and other app-owned workflows do not belong in
`src/ui/blocks/` even if they are visually simple. Place them in the app or feature layer.

## Composition Hierarchy (imports only from)

```
blocks  →  panels + primitives  →  theme
```

Blocks must not import feature controllers, models, stores, router modules,
or app-specific code.

## Styling Rules

- **No `style` prop on Block or Panel** — every visual decision goes through named token props.
- **No raw unnamed `View`** — if a block needs a fixed-size or dynamic-color container,
  name it first: `IconBoxWell`, `BadgePill`, `ScoreRing`, etc.
- **Named local View components are allowed.** A named function component with its own
  `StyleSheet` (using `useTheme()` tokens) is the correct pattern for pixel-geometry shapes
  that can't be expressed with Block. See example below.
- **No `RNText` in blocks.** If text needs a special treatment, extend shared text semantics
  or introduce a named shared text role instead of bypassing `Text`.
- **Prefer shared touch wrappers for simple press behavior.** Use `TapTarget` before adding
  another raw `TouchableOpacity` with a local `activeOpacity` in blocks.
- **Use raw `Pressable` only when pressed-state styling is truly required.** If a block just
  needs a tappable wrapper, default to `TapTarget`.
- **No hardcoded color literals** — use `useTheme()` for all color values.

## API Rules

- Expose semantic props (data + actions + states), not style escape hatches.
- No `style` passthrough props.
- Keep APIs narrow and typed.

## Good Example

```tsx
// Named local component — owns its geometry, uses theme tokens
function IconBoxWell({ name, tone }: { name: IconName; tone: IconTone }) {
  const theme = useTheme();
  return (
    <View style={[styles.well, {
      backgroundColor: theme.colors.surfaceWash,
      borderColor: theme.colors.borderSubtle,
      borderRadius: theme.colors.radii.sm,
    }]}>
      <Icon name={name} size="lg" tone={tone} />
    </View>
  );
}
const styles = StyleSheet.create({
  well: { width: 30, height: 30, borderWidth: 1, alignItems: "center", justifyContent: "center" },
});

export function SettingsRow({ icon, iconTone, label, value, onPress }: Props) {
  return (
    <Block direction="horizontal" space="sm" align="center">
      <IconBoxWell name={icon} tone={iconTone} />
      <Text variant="body" frame="fluid">{label}</Text>
      {value ? <Text variant="caption">{value}</Text> : null}
    </Block>
  );
}
```

## Bad Examples

```tsx
// Bad: raw unnamed View
<View style={{ width: 30, height: 30 }}>
  <Icon name="star" />
</View>

// Bad: domain concept in paint
<Block paint="application-card">...</Block>  // domain paint variants are removed

// Bad: style prop passthrough
export function MyBlock({ style, ...props }: { style?: ViewStyle }) { ... }
```
