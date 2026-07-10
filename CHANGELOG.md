# Changelog

All notable **public API changes** to `@appforge/platform` are documented here.
Patch-level refactors, internal moves, and non-breaking additions are omitted.

Format: `## [version] — YYYY-MM-DD` / `### Added | Changed | Removed`

---

## [0.3.0] — 2026-07-10

### `@appforge/platform/ui`

**Controls**
- `ListItem` — row primitive for tree/table/nav rows. `variant: "button" | "option"`, `selected`, leading/trailing content slots, arbitrary `children` for multi-column rows. `trailingAction` renders as a sibling of the row's own Pressable rather than nesting a second interactive element inside it — fixes the button-inside-a-button pattern.
- `Chip` — themeable alternative to `SelectableChip`: selected-state fill is a full contract variant (`neutral`/`accent` tones ship by default) instead of one hardcoded inversion, and renders through the platform's own text system instead of raw `Text`.
- `SegmentedTab` — segmented-control shape (Figma-style Hug/Fixed/Fill), distinct from the existing tab-strip `Tabs`.
- `IconButton` (also exported as `ToolbarButton`, same component) — fixed-square icon-only control; `accessibilityLabel` required at the type level, since there's no visible-text fallback.
- `Card` — larger clickable surface with title/subtitle/leading-slot/body-children.
- `MenuItem` — checkbox-style dropdown row, `accessibilityRole="menuitemcheckbox"` (not `"button"`) with its own `checked` state, separate from `selected`.
- `Pressable` gained a `checked` accessibility state (separate from `selected`, for menuitemcheckbox/checkbox-style roles) and `frame.flex`/`width`/`height` sizing, needed by the variants above.

## [0.2.0] — 2026-07-10

### `@appforge/platform/ui`

**Controls**
- `Pressable` — base closed primitive for keyboard-operable custom controls: built-in `tabIndex`, Enter/Space activation (including roles react-native-web's own Pressable doesn't cover out of the box), a themed focus ring via `theme.palette.borderFocus`, required `accessibilityLabel`, and `disabled`/`selected` state. First of the `Pressable` family — variants (list item, chip, tab, toolbar/icon button, card, menu item) land as follow-ups composing this primitive.

---

## [0.1.0] — 2026-06-20

Initial public surface.

### `@appforge/platform/ui`

**Layout**
- `YStack` — vertical flex container
- `XStack` — horizontal flex container
- `Stack` — unstyled base (alias for `View`; prefer `YStack`/`XStack`)
- `View` — raw Tamagui view (re-exported for compat; prefer `YStack`/`XStack`)
- `ScrollView`

**Typography**
- `Display`, `Heading`, `Label`, `Body`, `Text`

**Controls**
- `Button`, `Input`, `TextArea`
- `SelectableChip` (`SelectableChipSize`, `SelectableChipShape`, `SelectableChipFrame`)
- `Tag` (`TagProps`)

**Indicators**
- `Badge` (`BadgeTone`), `ProgressBar` (`ProgressBarTone`)

**Media**
- `Avatar`, `Icon` (`IconName`, `IconSize`, `IconTone`)

**System**
- `dialog` (`DialogButton`), `linking`
- `UIProvider`, `SafeAreaView`
- `TamaguiProvider`, `Theme`, `config`, `styled`, `useTheme`, `GetProps`

### `@appforge/platform/core`

- Identity utilities (`ids`)
- Date utilities (`dates`)
- Formatters
- Metadata helpers
- Storage primitives
- Runtime detection
- Shared types

### `@appforge/platform/theme/*`

- `ThemeProvider`, `ViewportProvider`, theme tokens and factory

### `@appforge/platform/navigation/*`

- Route definitions

### `@appforge/platform/providers/*`

- `SessionProvider`, `EntitlementProvider`
