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
- `ColorPalettePicker` is now part of the public `@ui` surface as a closed-form color swatch + hex editor primitive.
- `Select` and `MultiSelect` are now part of the public `@ui` surface as closed-form option-picker primitives.
- `Table` is now part of the public `@ui` surface as a closed-form data table primitive.
- `SizingToolbar` is now part of the public `@ui` surface as a closed-form icon-only size selector for scaffold action regions.
- `Tabs` is now part of the public `@ui` surface as a closed-form tab navigation primitive with finite options, selected value, and optional icons.
- `Table` owns widths, alignment, density, borders, and row geometry. Callers provide `columns`, `rows`, and per-column cell content only.
- `SizingToolbar` owns a fixed `sm` / `md` / `lg` contract and default dedicated size icons; callers may override icons per fixed value but may not supply arbitrary options.
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

## 2026-06-26

### UI surface

- `Table` now reads row geometry from the platform layout contract instead of an internal density enum.
- `Table` accepts `layout?: string` to resolve an explicit named layout; otherwise it uses the active layout from `useLayout()`.
- Table avatar cells now require an explicit avatar `variant`; the primitive no longer injects a default avatar size.
- Table image cells now require an explicit theme-backed image `variant`; the primitive no longer owns `xs` / `sm` / `md` / `lg` image sizing.
- The shared theme variants contract now includes `variants.image`, and the shared layout contract now includes `rowPadding` and `cellGap` for row-based primitives.
