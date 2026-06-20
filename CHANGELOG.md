# Changelog

All notable **public API changes** to `@appforge/platform` are documented here.
Patch-level refactors, internal moves, and non-breaking additions are omitted.

Format: `## [version] — YYYY-MM-DD` / `### Added | Changed | Removed`

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
