# AGENTS.md for `src/ui/primitives`

## Scope

Applies to `src/ui/primitives/**`.

## Responsibility

Primitives are the small set of retained shared helpers that still make sense after the Tamagui migration.

Examples:
- `Button`
- `Input`
- `TextArea`
- `Icon`
- `SelectableChip`
- `Tag`
- `Text` role exports such as `Display`, `Heading`, `Label`, `Body`

## Rules

- Use ordinary props only. Do not expose custom layout/surface/text vocabularies.
- No feature imports.
- No domain terms in names or prop contracts.
- Prefer re-exporting or lightly wrapping Tamagui behavior over creating a new API layer.
- If a helper becomes a thin alias with no meaningful behavior, delete it instead of keeping it for naming convenience.
