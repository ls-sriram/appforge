# AGENTS.md for `src/platform/ui/primitives`

## Scope

Applies to `src/platform/ui/primitives/**`.

## Ownership Model

```text
Application
    owns:
        tokens
        layout contracts
        visual variants
        visual hierarchy
        density

AppForge
    owns:
        primitive APIs
        rendering
        behavior
        accessibility
        interaction semantics

Tamagui
    owns:
        rendering implementation
```

---

## Responsibility

Primitives are the retained shared UI building blocks that encapsulate:

- behavior
- accessibility
- interaction semantics
- composition
- non-trivial rendering

Primitives do not own application appearance.

---

## Core Invariant

**AppForge must never introduce a non-overridable visual opinion.**

When adding a visual value, ask:

> Could two applications reasonably disagree on this?

If yes, the value belongs to the application.

---

## Primitive Rules

Primitive APIs are closed.

Allowed:

```tsx
<Button variant="save" />
<Input variant="search" />
<Table variant="default" layout="compact" />
```

Forbidden:

```tsx
<Button
    backgroundColor="red"
    borderRadius={12}
    padding={16}
/>
```

---

## Visual Ownership

Applications own:

- tokens
- variants
- layout contracts
- colors
- typography values
- spacing values
- radii
- shadows
- density
- component appearance

Primitives own:

- rendering
- interaction behavior
- focus behavior
- loading behavior
- disabled behavior
- accessibility
- composition

---

## Variants

Variants are resolved visual definitions.

```text
tokens
    ↓
createVariants(tokens)
    ↓
resolved variants
    ↓
primitives
```

Rules:

- Never introduce TokenRef.
- Never introduce runtime token resolution.
- Missing variants are programming errors and must throw.
- Variants own appearance.
- Primitives own behavior.

Each primitive that is variant-driven exports its own variant interface (e.g. `ButtonVariant`, `TableVariant`). `contracts/variants.ts` assembles them into the `Variants` map. Applications pass a `Variants` object to `ThemeProvider` via `createVariants(tokens)` (optionally extended with app-specific variants).

---

## Layout Contracts

Layout contracts define:

- density
- rhythm
- spacing
- sizing

Examples:

```text
compact
comfortable
propertyEditor
inspector
```

Layout contracts do not define:

- colors
- shadows
- feature semantics
- row vs column
- business concepts

The active layout contract is set by `DensityProvider` and read with `useLayout(layout?)`. Primitives that are density-sensitive (e.g. `Table`) accept an optional `layout?: string` prop and call `useLayout(layout)` internally.

`LayoutContract` fields are defined in `contracts/layouts.ts`. Applications create layout contracts via `createLayouts(tokens)` and may extend them.

---

## Feature Ownership

Features own:

- row vs column
- wrap
- arrangement
- business semantics

Bad:

```ts
theme.arrangements.universities
theme.arrangements.fees
```

Good:

```tsx
<XStack gap={layout.itemGap} />
<YStack gap={layout.sectionGap} />
```

---

## Text

Text semantics remain platform-owned.

Allowed:

```tsx
<Body tone="primary" />
<Body tone="muted" />
<Heading />
<Label />
```

Applications redefine token values.

---

## Scaffolds

Scaffolds own:

- structure
- responsiveness
- composition

Scaffolds do not own:

- colors
- spacing values
- typography
- visual appearance

---

## Contracts

A contract is a public API.

`contracts/` may contain only:

- APIs consumed by applications
- APIs consumed by primitives
- APIs enforced by AppForge

Delete:

- inert metadata
- preset tables
- unused constants
- documentation-only structures

---

## Existing Primitives

| File | What it provides |
|---|---|
| `Text.tsx` | `Display`, `Heading`, `Label`, `Body` — typographic role wrappers with `tone`/`size`/`weight` variants |
| `Button.tsx` | `Button` — pressable with variant, loading, disabled, interaction state |
| `Input.tsx` | `Input` — controlled text field; uses `"default"` variant internally |
| `TextArea.tsx` | `TextArea` — multiline controlled field with required `variant` |
| `Icon.tsx` | `Icon` — icon name→component map, `tone` color mapping |
| `Avatar.tsx` | `Avatar` — initials avatar with required `variant` (xs/sm/md/lg/xl/2xl in defaults) |
| `Badge.tsx` | `Badge` — small status labels with required `variant` |
| `Tag.tsx` | `Tag` — label chip with required `variant` |
| `SelectableChip.tsx` | `SelectableChip` — toggleable chip with required `variant` and selected state |
| `ProgressBar.tsx` | `ProgressBar` — determinate fill bar with required `variant` |
| `Select.tsx` | `Select` — single-value dropdown with required `variant` |
| `MultiSelect.tsx` | `MultiSelect` — multi-value token field with required `variant` |
| `ColorPalettePicker.tsx` | `ColorPalettePicker` — hex/swatch color editor |
| `ColorSwatch.tsx` | `ColorSwatch` — read-only color preview |
| `SizingToolbar.tsx` | `SizingToolbar` — closed sm/md/lg size selector for compact action regions |
| `Tabs.tsx` | `Tabs` — one-of-many tab navigation |
| `TabbedPanel.tsx` | `TabbedPanel` — controlled tabbed panel host |
| `Table.tsx` | `Table` — data table with column/cell specs, variant, and optional layout contract |
| `dialog.ts` | `dialog` — imperative alert/confirm API |
| `linking.ts` | `linking` — URL open utility |

---

## Code Review Checklist

Reject:

- hardcoded colors
- hardcoded spacing
- hardcoded radii
- hardcoded shadows
- hardcoded typography
- platform-owned visual semantics
- silent fallback behavior
- runtime token resolution
- raw style props passed to closed primitives (`bg=`, `borderWidth=`, `px=`, `color=`, etc.)
- `label=` prop on Button (use children)
- missing `variant=` on variant-driven primitives

Require:

- ownership clarity
- explicit contracts
- variant validation (throw on unknown variants)
- application-controlled appearance
- no feature imports
- no domain terminology in primitive APIs
