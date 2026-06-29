# AGENTS.md for `src/platform/ui`

## Scope

Applies to `src/platform/ui/**`.

## Purpose

Shared, domain-free UI foundation built on Tamagui.

`src/platform/ui/index.ts` is the only supported shared UI import surface. Prefer `@ui` in consumers.

## Composition Rules

1. Use official Tamagui props and shorthands directly on open layout primitives (`YStack`, `XStack`, `ScrollView`).
2. Re-export from `src/platform/ui/index.ts`; do not create alternate shared import paths.
3. Do not invent repo-specific layout or surface styling props such as `paint`, `frame`, `pad`, `between`, `spread`, `fill`, `inset`, or `space`.
4. Shared wrappers are allowed only when they encapsulate behavior, accessibility, icon mapping, non-trivial rendering, or unavoidable React Native interop.
5. Shared wrappers must keep ordinary props. They must not become a parallel styling DSL.
6. Use theme tokens (`$spaceN`, `$radiusN`, `$colorName`) for styling on open layout primitives.

## Primitive Classes

**Open layout primitives** — accept ordinary Tamagui layout props:
- `YStack`, `XStack`, `ScrollView`

**Closed value primitives** — define their own prop contracts; raw style props are forbidden on these:
- `Body`, `Heading`, `Label`, `Display`
- `Button` — requires `variant: string`; children are the label text
- `Input` — passes through TextInput props; always uses `"default"` variant internally
- `TextArea` — requires `variant: string`
- `Select`, `MultiSelect` — require `variant: string`
- `ColorPalettePicker`, `ColorSwatch`
- `Icon` — accepts `name`, `size: number`, `color: string`
- `SelectableChip` — requires `variant: string`
- `SizingToolbar`, `Tabs`, `TabbedPanel`
- `Avatar`, `Badge`, `Tag`, `ProgressBar` — require `variant: string`
- `Table` — requires `variant: string`; accepts optional `layout?: string`
- `dialog`, `linking`

Closed primitives must not be treated as arbitrary layout surfaces. Do not pass `bg=`, `borderWidth=`, `px=`, `color=`, or other visual style props to them. Use `variant=` instead.

## Text Atoms

`Display`, `Heading`, `Label`, and `Body` are open text wrappers. Pass explicit text values such as `color`, `fontFamily`, `fontSize`, and `lineHeight`. Do not add semantic text props that reintroduce resolution below `UiRuntime`.

## Contracts

The contracts directory (`contracts/`) exports:

- `InteractionContract` — hover, pressed, focused, selected, loading states for variant-driven primitives
- `LayoutContract` — density-driven spatial fields (`controlHeight`, `rowHeight`, `rowPadding`, `cellGap`, `panelPadding`, `sectionGap`, `itemGap`, `iconSize`, `fontSize`, `labelSize`)
- `PrimitiveContracts` — the assembled map of resolved primitive contract records consumed by `ThemeProvider`
- Individual contract interfaces (`ButtonContract`, `TableContract`, `AvatarContract`, etc.)

The `contracts/` barrel is the source of truth for the variant and layout contract types.

## Shared Surface

- `theme/`: theme factory, realized runtime defaults, `LayoutProvider`, `ThemeProvider`, `Viewport`
- `contracts/`: interaction, variant, and layout contract types
- `primitives/`: closed-form leaf primitives
- `scaffolds/`: slot-structured layout scaffold helpers
- `config.ts`, `Provider.tsx`, `index.ts`: Tamagui config, app-level provider, root barrel

## Removed APIs

The following no longer exist and must not be imported:

- `Block` — use `XStack`/`YStack` with raw Tamagui props
- `Col`, `Row`, `Card`, `Screen`, `Rule`, `Divider`, `AbsLayer` (from old `SStack`) — removed
- `shared panels` and `shared blocks` — removed; compose inline per feature
- `Text variant="h3"` / old text weight enum — use `Heading`/`Body`/`Label`/`Display` with explicit text props
- `PLATFORM_SCAFFOLDS`, `SCAFFOLD_KINDS`, `SCAFFOLD_SLOT_BEHAVIORS`, `SCAFFOLD_SLOT_PLACEMENTS` — removed; scaffold structure is code, not data
- `VALUE_PRIMITIVES`, `LAYOUT_PRIMITIVES`, `PLATFORM_BYPASS_PROPS` — removed; use the actual TypeScript interfaces
- `SelectableChipSize` — removed; use `variant: string`
