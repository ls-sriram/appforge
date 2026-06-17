# AGENTS.md for `src/ui`

## Scope

Applies to `src/ui/**`.

## Purpose

Shared, domain-free UI building blocks used across all apps and features.
Built on **Tamagui** (`@tamagui/core`) — no `style` props, all styling via `styled()` variants.

```
config.ts       Tamagui token/font/theme config — single source of styling truth
Provider.tsx    UIProvider: wraps TamaguiProvider + ThemeProvider for the whole app

primitives/
  SStack.tsx    Layout atoms: Screen, Col, Row, Card, Rule, Divider, AbsLayer, …
  Text.tsx      Typography atoms: Display, Heading, Label, Body (+ legacy Text)
  Block.tsx     LEGACY — kept for feature-layer compat; new code uses Col/Row/Card
  Button.tsx    Interactive leaf — uses ThemeProvider tokens
  Input.tsx     Leaf primitive
  Icon.tsx      Leaf primitive
  Avatar, Badge, Tag, Chip, Toggle, ProgressBar, Skeleton, EmptyState, …

panels/         Surface containers — thin wrappers over Card
  Panel.tsx     Named wrapper: Panel variant → Card variant
  SectionPanel  Title + content stack
  CalloutPanel  Icon + label + message card

blocks/         Composites — compose primitives only, no feature imports
  SectionHeader, MetricCard, ErrorBanner, SettingsRow, TableBlock, ListBlock, …

layouts/        Page-level geometry (centered single-column, narrow content wrappers)
```

## Composition rules

1. **Tamagui only in new code** — `styled()` from `@tamagui/core`, never `tamagui` package.
2. **No domain terms** — names must be generic (`Card`, `Row`, not `AuthPanel`, `BillingRow`).
3. **No `style` prop on layout atoms** — every visual property is a named variant.
4. **No raw `View` in blocks** — if you need a fixed-size container, name it (e.g. `IconWell`).
5. **Blocks compose primitives only** — no feature imports, no router imports.
6. **All new styling via Tamagui tokens** — reference `$colorName`, `$spaceN`, `$radiusN`.
7. **Variant naming avoids Tamagui prop collisions** — use `between` (not `gap`), `inset` (not `px`), `spread` (not `justifyContent`), `centered` (not `alignItems`).

## Typography atom usage

| Atom      | Size  | Use                              |
|-----------|-------|----------------------------------|
| `Display` | 32px  | Hero numbers, page titles        |
| `Heading` | 24px  | Section headers, metric values   |
| `Label`   | 13px  | UI labels, captions, table heads |
| `Body`    | 15px  | Reading text, list items         |

Tone variants: `dim`, `soft`, `tertiary`, `primary`, `success`, `warning`, `error`, `onDark`.
Weight: `bold` variant steps to 700. No italic anywhere.

## Layout atom usage

| Atom    | Description                                |
|---------|--------------------------------------------|
| `Col`   | Vertical stack (`between`, `inset`, `fill`)|
| `Row`   | Horizontal stack (`between`, `spread`, `centered`) |
| `Card`  | Bordered content card (`variant`, `pad`)   |
| `Screen`| Absolute-fill background layer             |
| `Rule`  | Full-width horizontal hairline separator   |
| `Divider` | Thinner intra-panel separator            |
| `AbsLayer` | Absolute-positioned overlay             |

## Card variants (Panel mapping)

| Card variant | Former Panel variant |
|--------------|----------------------|
| `default`    | `default`            |
| `muted`      | `muted`              |
| `strong`     | `strong`             |
| `subtle`     | `subtle`             |
| `inverse`    | `inverse`            |
| `selected`   | `selected`           |
| `danger`     | (was `Block paint="danger"`) |

## Legacy compatibility

`Block` and `Text` (variant API) remain exported for feature-layer code. New code in `blocks/`
and `panels/` should not use them — use Col/Row/Card/Display/Heading/Label/Body instead.
