# UI Layer Boundary

Strict UI layering for this app. Lower layers must not import from higher layers.

## Layer 1 — Design Tokens (`src/theme/**`)

- Owns palette, semantic colors, spacing, typography, radii, borders, elevation, motion, breakpoints.
- Raw hex/rgba values belong here or in token utilities.
- No feature, route, service, repository, or viewmodel logic.

## Layer 2 — Primitives (`src/ui/primitives/**`)

**`Block`** — the universal composition element. Combines frame, paint, layout, and
safe-area into one constrained API. **No `style` prop.** Every visual decision is a
named token prop.

`safeArea="all|top|bottom"` wraps the Block in `SafeAreaView` with the given edges.
Use on full-screen root blocks that sit directly under a route entry — this replaces
`PageScaffold`, `OnboardingScaffold`, and similar screen-wrapper components.

`PaintVariant` contains only design-system surfaces. Domain concepts are not in
`PaintVariant` — each domain component owns its surface via a local `View` + `StyleSheet`.

**Leaf atoms** — `Text`, `Button`, `Icon`, `Input`, `TextArea`, `Avatar`, `Badge`,
`Tag`, `Toggle`, `ProgressBar`, `Skeleton`, `EmptyState`, `RecordingTimer`, `BlockGrid`

**Scroll** — `ScrollArea` (thin `ScrollView` wrapper with `fill` shorthand)

> `Surface`, `Stack`, `Inline`, `Frame`, `Center`, `Inset` are **deleted**. Use `Block`.
> `src/ui/scaffolds/` is **deleted**. Use `<Block safeArea="...">` for screen wrappers.

## Layer 3 — Panels (`src/ui/panels/**`)

Surface wrappers that map semantic variant names to Block paint:
`Panel`, `SectionPanel`, `CalloutPanel`, `OverlaySheetShell`

`PanelVariant` = `default | muted | strong | subtle | inverse | selected`

Panels may use `Block`, `Text`, and other primitives internally. No feature imports.

> `src/ui/components/` is **deleted**. Import panels from `src/ui/panels/`.

## Layer 4 — Blocks (`src/ui/blocks/**`)

App-agnostic composites. Compose primitives + panels into named reusable patterns.
Examples: `SearchBar`, `MetricCard`, `SettingsRow`, `SelectableRow`, `NavigationTileGrid`.

- No `style` prop passthrough.
- No raw unnamed `View` — name it first (`IconBoxWell`, `ScoreRing`, etc.).
- Named local `View` components with `StyleSheet` + `useTheme()` are permitted for
  pixel-exact geometry that can't be expressed via `Block`.
- No feature, router, or domain imports.

App-wide blocks belong at `src/apps/<app>/ui/blocks/`.
Single-feature blocks belong at `src/apps/<app>/features/<feature>/<name>.block.tsx`.

## Layer 5 — App-Shared UI (`src/apps/<app>/ui/**`)

- `components/` — app-shared components reused across ≥2 features of the app.
- `scaffolds/` — app-specific navigation chrome (e.g. `DipNavigationScaffold`,
  `DaDashboardScaffold`). These are Block compositions with named slots and
  `useViewport()` branching. No equivalent lives in `src/ui/`.
- `theme/` — app-specific semantic tokens and palette overrides.

No repositories, stores, or router imports.

## Layer 6 — Feature UI (`src/apps/<app>/features/**`, `src/features/**/ui`)

Owns feature composition and behavior wiring. Maps viewmodel state to visual layers.
Must not hardcode visual styling or recreate shared UI patterns.

## Layer 7 — Routes (`app/**`, `app-*/*`)

Thin navigation wiring only. No visual styling or domain rendering.

## Enforcement

- `PaintVariant` enforces the design-system surface boundary at compile time — domain
  paint names are type errors.
- `Block` has no `style` prop — visual escapes require creating a named primitive instead.
- Architecture lint: `npm run lint:arch`
- Type check: `npm run typecheck`
