# Platform UI Changelog

This document records public UI/theme contract changes that affect apps or tools built on top of AppForge.

## 2026-06-21

### Theme contract

- `@appforge/platform/theme` is now the supported theme contract import surface.
- `ThemeOverride` is the canonical editable interface for theme changes.
- `ThemeDefinition` is the canonical base schema for the platform theme.
- Theme overrides are applied through the platform via `applyThemeOverride(...)`, `createAppTheme(...)`, and `ThemeProvider`.
- There is no separate theme payload schema; downstream code should import the exported TypeScript types directly.

### UI surface

- `View` is no longer part of the public `@ui` export surface.
- `Stack` is no longer part of the public `@ui` export surface.
- Feature and reusable block composition should prefer `YStack`, `XStack`, `ScrollView`, and approved leaf primitives.
- `Table` is now part of the public `@ui` surface as a closed-form data table primitive.
- `Table` owns widths, alignment, density, borders, and row geometry. Callers provide `columns`, `rows`, and per-column cell content only.
- Rich cells are supported through finite cell kinds (`text`, `tag`, `badge`, `avatar`, `image`, `custom`), but callers may not control table layout with raw `style` or per-row width overrides.
- The stable visualizer/inspector contract remains the explicit `ui("id")` stamping flow and rendered `data-uiid` nodes.
- Visualizer-participating roots should create IDs from a unique root prefix via `createUi(prefix)`, then derive child IDs with `ui.scope(...)` so the final `data-uiid` values are hierarchical and non-colliding.

### Docs consolidation

- Top-level UI guidance was consolidated into:
  - `docs/architecture/overview.md`
  - `docs/ui-layer-boundary.md`
- Removed top-level docs:
  - `docs/architecture/building-blocks.md`
  - `docs/architecture/ui-visualizer.md`
  - `docs/ui-guidelines-summary.md`

### Downstream impact

- If downstream code imported `ThemeOverride` via a deep file path, switch to `@appforge/platform/theme`.
- If downstream code imported `View` or `Stack` from `@ui`, replace those imports with approved layout primitives or consume a platform primitive that already expresses the intended layout.
