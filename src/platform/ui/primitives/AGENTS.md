# AGENTS.md for `src/ui/primitives`

## Scope

Applies to `src/ui/primitives/**`.

## Responsibility

Primitives are the small set of retained shared helpers that encapsulate behavior, icon mapping, accessibility, or non-trivial rendering — not styling convenience.

## Retained helpers

| File | What it provides |
|---|---|
| `Text.tsx` | `Display`, `Heading`, `Label`, `Body` — typographic role wrappers with `tone`/`size`/`weight` variants |
| `TextRoles.tsx` | `MetaText`, `ActionText` |
| `Button.tsx` | `Button` — pressable with accessibility, loading, disabled, fullWidth handling |
| `Input.tsx` | `Input` — controlled text field with RN interop |
| `TextArea.tsx` | `TextArea` — multiline controlled field |
| `Icon.tsx` | `Icon` — icon name→component map, `tone` color mapping |
| `Avatar.tsx` | `Avatar` |
| `Badge.tsx` | `Badge` — small status labels |
| `Tag.tsx` | `Tag` |
| `Chip.tsx` | `Chip` |
| `SelectableChip.tsx` | `SelectableChip` — toggleable chip with selected state |
| `Link.tsx` | `Link` — tappable URL with RN/web interop |
| `Toggle.tsx` | `Toggle` |
| `ProgressBar.tsx` | `ProgressBar` |
| `Skeleton.tsx` | `Skeleton` — loading placeholder |
| `EmptyState.tsx` | `EmptyState` |
| `TapTarget.tsx` | `TapTarget` |
| `LayoutGrid.tsx` | `LayoutGrid` |
| `Layout.tsx` | `ScrollArea` |

## Rules

- Use ordinary props only. Do not expose custom layout/surface/text vocabularies.
- No feature imports.
- No domain terms in names or prop contracts.
- Prefer re-exporting or lightly wrapping Tamagui behavior over creating a new API layer.
- If a helper becomes a thin alias with no meaningful behavior, delete it instead of keeping it for naming convenience.

## Removed

The following were removed and must not be recreated:

- `SStack.tsx` and all exports: `Col`, `Row`, `Card`, `Screen`, `Rule`, `Divider`, `AbsLayer`, `SegmentRow`, `SegmentOpt`, `VRule`, `NavBar`, `ChipBtn`, `BlockBtn`
- `Block` — the layout container with `direction`/`space`/`pad`/`align` props
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

`contract.ts` may contain only:

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

- Text.tsx
- TextRoles.tsx
- Button.tsx
- Input.tsx
- TextArea.tsx
- Icon.tsx
- Avatar.tsx
- Badge.tsx
- Tag.tsx
- Chip.tsx
- SelectableChip.tsx
- Link.tsx
- Toggle.tsx
- ProgressBar.tsx
- Skeleton.tsx
- EmptyState.tsx
- TapTarget.tsx
- LayoutGrid.tsx
- Layout.tsx

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

Require:

- ownership clarity
- explicit contracts
- variant validation
- application-controlled appearance
- no feature imports
- no domain terminology in primitive APIs