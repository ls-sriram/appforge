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
