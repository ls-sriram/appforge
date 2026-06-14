# AGENTS.md for `src/ui`

## Scope

Applies to `src/ui/**`.

## Purpose

Shared, domain-free UI building blocks used across all apps and features.

```
primitives/   atoms — Block, Text, Button, Icon, Input, Avatar, Badge, Tag,
               Chip, Link, Toggle, ProgressBar, Skeleton, EmptyState, ScrollArea

panels/       surface wrappers — Panel, SectionPanel, CalloutPanel, OverlaySheetShell
               maps semantic variant names → Block paint

blocks/       composites — ErrorBanner, MetricCard, SearchBar, SettingsRow,
               RecordingTimer, … compose primitives + panels only

layouts/      shared page layout containers — centered single-column pages,
               narrow content wrappers, and similar domain-free page geometry
```

`scaffolds/` is gone. Screen-level safe-area handling uses `Block safeArea="all|top|bottom"`.
App-specific navigation chrome lives in each app's own `ui/scaffolds/`.

## Rules

1. **No domain terms** — dental, interview, application, auth, etc. do not appear here.
2. **No `style` prop on Block or Panel** — every visual decision goes through named token props.
3. **No raw `View` in blocks** — if you need a fixed-size or dynamic-color container, name it first (e.g. `IconBoxWell`, `BadgePill`).
4. **Blocks compose primitives only** — no feature imports, no router imports.
5. **All styling via theme tokens** (`useTheme()`) — no hardcoded colours or spacing.
6. **`components/` is gone** — import from `panels/`, not `components/`.
7. **`scaffolds/` is gone** — use `<Block safeArea="...">` for screen wrappers.
