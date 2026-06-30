# AGENTS.md for `src/platform/ui/primitives`

## Scope

Applies to `src/platform/ui/primitives/**`.

## Ownership Model

```text
Application
    owns:
        tokens
        layout contracts
        visual contracts
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
const { contracts } = useUI()

<Button contract={contracts.button["primary"]}>Save</Button>
<Input contract={contracts.input["default"]} />
<Table contract={contracts.table["default"]} layout="compact" />
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
- contracts
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

## Contracts

Resolved contracts are explicit visual definitions.

```text
tokens
    ↓
createContracts(tokens)
    ↓
resolved contracts
    ↓
primitives
```

Rules:

- Never introduce TokenRef.
- Never introduce runtime token resolution.
- Missing contracts are programming errors and must throw.
- Contracts own appearance.
- Primitives own behavior.

Each closed primitive exports its own resolved contract interface (e.g. `ButtonContract`, `TableContract`). `contracts/runtime/contracts.ts` assembles them into the `PrimitiveContracts` map. Applications pass that resolved contract map to `ThemeProvider` via `createContracts(theme)` (optionally extended with app-specific contract entries).

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

The active layout profile is set by `LayoutProvider` and read with `useLayout(layout?)`. Primitives that are density-sensitive (e.g. `Table`) accept an optional `layout?: string` prop and call `useLayout(layout)` internally.

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

Text wrappers stay open, but rendering below `UiRuntime` must be explicit.

Allowed:

```tsx
<Body color="$textPrimary" fontSize="$3" lineHeight="$3" />
<Heading fontFamily="$bold" fontSize="$5" lineHeight="$5" />
```

Do not add semantic text props that resolve visual meaning inside primitives.

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
| `Text.tsx` | `Display`, `Heading`, `Label`, `Body` — typographic wrappers that accept explicit text values |
| `Button.tsx` | `Button` — pressable with explicit contract, loading, disabled, interaction state |
| `Input.tsx` | `Input` — controlled text field with required `contract` |
| `TextArea.tsx` | `TextArea` — multiline controlled field with required `contract` |
| `Icon.tsx` | `Icon` — icon name→component map with explicit `color` and numeric `size` |
| `Avatar.tsx` | `Avatar` — initials avatar with required `contract` |
| `Badge.tsx` | `Badge` — small status labels with required `contract` |
| `Tag.tsx` | `Tag` — label chip with required `contract` |
| `SelectableChip.tsx` | `SelectableChip` — toggleable chip with required `contract` and selected state |
| `ProgressBar.tsx` | `ProgressBar` — determinate fill bar with required `contract` |
| `Select.tsx` | `Select` — single-value dropdown with required `contract` |
| `MultiSelect.tsx` | `MultiSelect` — multi-value token field with required `contract` |
| `ColorPalettePicker.tsx` | `ColorPalettePicker` — hex/swatch color editor |
| `ColorSwatch.tsx` | `ColorSwatch` — read-only color preview |
| `SizingToolbar.tsx` | `SizingToolbar` — closed sm/md/lg size selector for compact action regions |
| `Tabs.tsx` | `Tabs` — one-of-many tab navigation |
| `TabbedPanel.tsx` | `TabbedPanel` — controlled tabbed panel host |
| `Table.tsx` | `Table` — data table with column/cell specs, explicit contract, and optional layout contract |
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
- missing `contract=` on closed primitives

Require:

- ownership clarity
- explicit contracts
- explicit contract lookup and validation before render
- application-controlled appearance
- no feature imports
- no domain terminology in primitive APIs
