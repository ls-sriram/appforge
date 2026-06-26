# UI Layer Boundary

This is the canonical phase-1 contract for the platform UI system.

The platform is a closed-form design system contract. It defines the only legal UI vocabulary that apps, features, and external tools may use.

Lower layers must not import from higher layers.

## Phase 1 Scope

This phase defines:
- the token schema
- the theme schema
- the shared primitive set
- the allowed primitive props and semantic variants
- the open-authoring vs closed-editable UI split
- the stable UI ID contract for inspectable elements
- the allowed theme override surface

This phase does not define:
- block extensibility
- block registries
- block authoring contracts
- editor-specific product UX

## Closed-Form Rule

Outside the platform contract:
- values may change
- composition may change
- theme overrides may change values within the allowed schema

Outside the platform contract, the following may not change unless the platform itself is revised:
- token categories
- theme schema shape
- primitive set
- primitive prop surface
- semantic variant families
- repo-specific styling DSLs

## Layer 1 — Design Tokens (`src/platform/theme/**`)

- Owns palette, semantic colors, spacing, typography, radii, borders, elevation, motion, breakpoints.
- Raw hex/rgba values belong here or in token utilities.
- No feature, route, service, repository, or viewmodel logic.

Platform guarantee:
- token names and categories are finite and platform-owned
- consumers may choose token values through existing props, but may not define new token categories in feature code

## Layer 2 — Shared UI Contract (`src/platform/ui/**`)

- `src/platform/ui/index.ts` is the implementation for the supported shared UI import surface.
- Prefer the package alias `@ui` in consumers.
- `src/platform/ui/config.ts` owns the Tamagui config.
- `src/platform/ui/Provider.tsx` owns provider wiring.
- `src/platform/ui/primitives/**` may contain a small number of retained helpers, but only if they solve a real rendering or behavior concern without adding a custom style vocabulary.

Allowed exports:
- direct Tamagui components and types from `@ui`
- provider/config
- narrowly justified helpers like icon mapping or special input wrappers with ordinary props

Platform guarantee:
- the primitive set is finite and platform-owned
- allowed props and semantic variants are finite and platform-owned
- shared helpers must preserve ordinary props and must not become a secondary styling language
- raw `style` is not part of the supported primitive override surface

### Platform Surface Modes

The platform has two different surfaces:

- open authoring surface
- closed editable surface

These are related, but they are not the same contract.

### Open Authoring Surface

The open authoring surface is the normal platform engineering experience.

It includes:
- direct layout primitives such as `YStack`, `XStack`, and `ScrollView`
- ordinary Tamagui props and shorthands on those layout primitives
- closed-form shared primitives for value-bearing UI such as `Button`, `Input`, `TextArea`, `Select`, `MultiSelect`, `ColorPalettePicker`, `Tag`, `Badge`, `Avatar`, `ProgressBar`, and `Table`

Intent:
- platform authors and feature authors may compose UI with ordinary Tamagui layout props
- this surface is typed, but it is not a runtime prop firewall
- unsupported or unsafe props are not globally stripped before they reach Tamagui

Source of truth:
- `src/platform/ui/index.ts`
- `src/platform/ui/contract.ts`

### Closed Editable Surface

The closed editable surface is the stable contract for inspectable nodes, visualizer flows, and tool-generated edits.

It is narrower than the open authoring surface.

Intent:
- tooling may only operate on platform-owned primitives, semantic variants, stable UI IDs, and the approved theme override surface
- tooling must not treat arbitrary Tamagui props as an open-ended editing API
- if a layout or visual control needs to be tool-editable, the platform must first model it as a finite prop, variant, or token-backed value

Source of truth:
- `src/platform/ui/contract.ts`
- this document

### Stable UI ID Contract

Inspectable UI must carry a stable explicit UI ID.

Rules:
- stage/layout code must pass explicit stamps through a `ui` helper and spread them onto meaningful shared UI primitives as `{...ui("id")}`
- tooling may only rely on nodes that are explicitly stamped
- wrapped platform visualizer primitives must preserve and surface those stamps as `data-uiid` on the DOM
- if a node is intended to be selectable, inspectable, or editable, the platform UI must expose a stable ID for it

Non-rules:
- not every internal DOM element needs an ID
- decorative wrappers that are not part of the inspectable contract do not need stamps

### Primitive Classes

Open layout primitives:
- `YStack`
- `XStack`
- `ScrollView`

Closed value primitives:
- `Body`
- `Heading`
- `Label`
- `Display`
- `Button`
- `Input`
- `TextArea`
- `Select`
- `MultiSelect`
- `ColorPalettePicker`
- `Icon`
- `SelectableChip`
- `SizingToolbar`
- `Tabs`
- `TabbedPanel`
- `Tag`
- `Avatar`
- `Badge`
- `ProgressBar`
- `Table`
- `dialog`
- `linking`

Rules:
- open layout primitives may accept ordinary Tamagui layout props in author-written code
- closed value primitives define their own supported prop contracts and may not be treated as arbitrary layout surfaces by tooling
- a primitive does not become part of the closed editable contract just because it forwards ordinary props internally

### Scaffold Contract

Scaffolds are part of the closed editable surface as contract metadata.

Definition:
- a scaffold is a non-printing layout region made of named slots
- a scaffold does not define caller content; it defines reusable layout structure
- scaffolds are not shared value primitives and are not a render primitive in this phase

Source of truth:
- `src/platform/ui/contract.ts`

Platform-owned scaffold kinds:
- `page`
- `header`
- `sidebar`
- `panel`
- `panelCollection`

Each scaffold slot is defined by finite platform-owned fields:
- `name`
- `placement`
- `behavior`
- optional `required`
- optional `multiple`

Slot behavior contract:
- `flow`
- `sticky`
- `fixed`

Rules:
- `behavior` describes whether a slot moves with document flow or remains pinned
- tooling may not replace this with arbitrary positioning props

Slot placement contract:
- `inline`
- `top`
- `bottom`
- `left`
- `right`
- `center`
- `leading`
- `trailing`

Rules:
- `placement` describes where a slot belongs within the scaffold
- panels and sidebars must use explicit finite placements in scaffold presets
- tooling may not replace placement with arbitrary coordinates or inset values

Scaffold geometry presets:
- gap presets: `none`, `tight`, `default`, `loose`
- padding presets: `none`, `sm`, `md`, `lg`
- separation presets: `flush`, `separated`

Rules:
- scaffold spacing is bounded by preset families
- tooling may not introduce arbitrary numeric offsets through the scaffold contract

Preset action locations:
- relevant scaffold presets may include platform-owned action slots such as `actions`
- the scaffold owns where the action region lives
- the caller owns which buttons, menus, or controls render inside that region

Sizing toolbar primitive:
- `SizingToolbar` is a closed value primitive for finite size selection in compact action regions
- supported values are fixed: `sm`, `md`, `lg`
- default presentation is icon-only using platform-owned size icons
- callers may override which icon is shown for each fixed size, but may not change the option set
- intended placement is scaffold action regions such as `HeaderScaffold` and `PanelScaffold`
- it is not a generic segmented control or arbitrary sizing DSL

Tabs primitive:
- `Tabs` is a closed value primitive for top-level one-of-many view navigation
- callers provide a finite `options` list, selected `value`, and `onValueChange`
- tabs may include icons and disabled states, but they do not expose arbitrary layout or indicator styling APIs
- intended placement is header, panel, or section navigation where tab semantics are clearer than chips
- `Tabs` remains selection-only and does not own close, move, docking, or panel-lifecycle behavior

Tabbed panel primitive:
- `TabbedPanel` is a closed value primitive for maintaining one active tabbed panel host
- it is controlled through `tabs`, `activeTabId`, and `onActiveTabChange`
- it may expose finite active-tab maintenance actions such as close and left/right move callbacks
- it reuses platform panel structure internally, but it is not itself a scaffold or layout helper in the public contract
- it is not a generic docking system, cross-host transfer surface, or drag/drop workspace DSL

Preset scaffold library:
- `PLATFORM_SCAFFOLDS.page`
- `PLATFORM_SCAFFOLDS.header`
- `PLATFORM_SCAFFOLDS.sidebar`
- `PLATFORM_SCAFFOLDS.panel`
- `PLATFORM_SCAFFOLDS.panelCollection`

Default reusable scaffold layout helpers:
- `PageScaffold`
- `HeaderScaffold`
- `SidebarScaffold`
- `PanelScaffold`
- `PanelCollectionScaffold`

Implementation note:
- these helpers live under `src/platform/ui/layouts/`
- they render the platform-owned slot structure for callers to populate
- they are fixed preset helpers, not a generic runtime scaffold DSL
- they are structural only and must not add default margins, padding, borders, elevation, or decorative surface styling
- they may own flex behavior, slot ordering, collection flow, and responsive slot visibility rules

Responsive collapse options:
- `HeaderScaffold` may collapse `leading` and `actions` slots by viewport tier through finite props
- `SidebarScaffold` may collapse its main content by viewport tier and optionally render `collapsedContent`
- collapse behavior stays finite and viewport-based; it does not introduce arbitrary breakpoint or animation APIs

### Allowed And Forbidden Prop Classes

Forbidden bypass props for platform primitives:
- `style`
- `contentContainerStyle`
- `className`

Closed-editable allowed Tamagui prop classes:
- stack alignment and direction props such as `ai`, `jc`, `fd`, `f`
- token-backed spacing props such as `gap`, `p`, `px`, `py`, `pt`, `pb`, `pl`, `pr`, `m`, `mx`, `my`, `mt`, `mb`, `ml`, `mr`
- token-backed paint props such as `bg`, `color`, `borderColor`
- bounded border and geometry props such as `borderWidth`, `borderTopWidth`, `borderBottomWidth`, `overflow`, `br`
- bounded sizing props already used in the platform contract such as `w`, `h`, `minHeight`, `maxWidth`, `flexBasis`

Closed-editable forbidden Tamagui prop classes:
- arbitrary paint and interaction controls such as `opacity`, `pressStyle`, `hoverStyle`, `focusStyle`, `animation`, `transform`
- arbitrary positioning controls such as `position`, `top`, `right`, `bottom`, `left`, `inset`, `zIndex`
- arbitrary sizing controls such as `minWidth`, `maxHeight`
- fine-grained typographic tuning such as `letterSpacing`

Rules:
- author-written platform code may still use ordinary Tamagui props where needed
- tool-generated or inspectable edits must stay within the closed-editable allowed set
- if a currently-forbidden prop becomes important for tooling, the platform must narrow it into a finite contract first
- examples include width modes, opacity variants, overlay placement enums, and elevation tiers

### Replacement Contracts

When a prop class is forbidden in the closed editable surface, use the platform replacement contract instead of an arbitrary value.

Sizing replacements:
- use `CLOSED_WIDTH_PRESETS` from `src/platform/ui/contract.ts` instead of arbitrary width roles
- use `CLOSED_MIN_HEIGHT_PRESETS` instead of arbitrary `minHeight`
- use `CLOSED_MAX_HEIGHT_PRESETS` instead of arbitrary `maxHeight`

Opacity replacements:
- use `CLOSED_OPACITY_PRESETS` instead of arbitrary `opacity` values

Border replacements:
- use `CLOSED_BORDER_WIDTH_PRESETS` instead of arbitrary repeated border width values

Placement replacements:
- use `CLOSED_OVERLAY_PLACEMENTS` instead of arbitrary absolute positioning and inset combinations

Rules:
- a closed-editable consumer may select a predefined preset
- a closed-editable consumer may not invent a new numeric value outside the preset family
- if a preset family is insufficient, extend the platform contract before using a new raw value

Removed shared UI APIs:
- `Block` and its prop/type system
- shared `panels`
- shared `blocks`
- legacy text variants/tones/weights as a public API

## Allowed Theme Override Surface

Theme overrides are part of the platform contract only when they stay within the platform-defined theme schema.

Definition:
- the base theme schema is defined by `ThemeDefinition` in `src/platform/theme/contracts.ts`
- the default platform theme is assembled in `src/platform/theme/index.ts`
- the allowed override type is `ThemeOverride`
- higher tooling and external consumers should import `ThemeOverride` from `@appforge/platform/theme`
- the current override surface is limited to `ThemeOverride["colors"]`
- nested keys may be overridden only where they already exist in the schema, including semantic colors, spacing, radii, typography, breakpoints, layout, state, and elevation

Application:
- overrides are applied through `applyThemeOverride(baseTheme, override)`
- `ThemeProvider` accepts `override` and re-derives platform shapes from the overridden theme
- `UIProvider` must derive its active Tamagui theme from the same overridden platform theme so `$surface`, `$border`, `$primary`, and related primitive tokens stay aligned with platform theme consumers
- overrides change values only; they do not extend the schema

Allowed:
- changing token or semantic theme values through predefined override keys
- supplying app/site-specific theme values at provider/bootstrap time
- tooling that edits those override values

Authoring contract:
- the platform exports the actual TypeScript contract; there is no separate theme-override payload schema
- the intended import surface is `@appforge/platform/theme`

Example:

```ts
import type { ThemeOverride } from "@appforge/platform/theme";

const override: ThemeOverride = {
  colors: {
    primary: "#2563EB",
    textPrimary: "#111827",
    space: {
      md: 20,
    },
    radii: {
      lg: 18,
    },
  },
};
```

Not allowed:
- adding new theme keys outside the platform schema
- removing existing required theme keys
- bypassing the theme contract with app-specific visual APIs

Global theme/layout tokens:
- page-level geometry such as `maxContentWidth`, `maxPageWidth`, `pagePadding`, and `headerHeight` belongs in `ThemeDefinition["colors"]["layout"]`
- those values are global theme/layout tokens, not an editable per-element styling schema

## Layer 3 — Feature UI (`src/features/**`)

App and feature UI should compose the approved platform primitives directly:

```tsx
import { Body, Button, Heading, XStack, YStack } from "@ui";

<YStack bg="$bg" f={1} p="$md" gap="$md">
  <Heading>Profile</Heading>
  <YStack bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$lg" p="$md">
    <Body color="$textMuted">Direct Tamagui props only.</Body>
  </YStack>
  <XStack gap="$sm">
    <Button bg="$primary">
      <Body color="$textInverse" fontFamily="$bold">Save</Body>
    </Button>
  </XStack>
</YStack>
```

Rules:
- Use official Tamagui props and shorthands directly.
- Prefer `YStack`, `XStack`, and other approved platform primitives for feature composition.
- Do not introduce app- or repo-specific styling props such as `paint`, `frame`, `pad`, `between`, `spread`, or custom text tones/variants.
- Do not pass raw `style` into platform primitives. If a layout or semantic need recurs, express it through existing primitive props, tokens, or a platform-owned primitive variant.
- Named local components are allowed for pixel-specific geometry, accessibility, or rendering that Tamagui props do not express cleanly.
- Feature-local wrappers may exist, but they should compose direct Tamagui primitives rather than recreate a parallel styling DSL.

Important distinction:
- feature composition is allowed to use ordinary Tamagui props on open layout primitives
- this does not make every Tamagui prop part of the stable tool-editable platform contract

Feature guarantee:
- features may compose the contract
- features may not extend the contract
- features may define blocks from existing primitives, but block extensibility itself is deferred to a later phase

## Visualizer Contract

This repository keeps the shared visualizer-aware UI support, but not the prototype site that hosted the full visualizer product.

Rules:
- Visualizer-participating stage/layout files should create a root scope with `createUi(prefix)` and thread `ui` through child blocks as needed.
- Every meaningful shared primitive that should be discoverable by the visualizer must be stamped with `{...ui("id")}`.
- Downstream code should not hand-roll `data-uiid`; IDs should always come from the `ui` helper.
- Wrapped visualizer primitives read `__uiid`, write `data-uiid` to the DOM, and use that ID for click-to-select and inspector overrides.
- Reusable blocks should default `ui` to `noopUi` so they render normally outside visualizer-aware surfaces.

Root-level naming:
- the top-level rendered surface chooses a unique root prefix such as `login`, `register`, `forgot-password`, or `onboarding`
- child blocks derive nested namespaces through `ui.scope("segment")`
- leaf elements use local stamps like `ui("submit")`
- the effective UI ID is hierarchical, so uniqueness comes from the full scoped path rather than from globally unique leaf names
- sibling roots must not reuse the same root prefix within the same rendered tree

Platform-side responsibility:
- provide stable identity and inspectable rendered nodes

Tool-side responsibility:
- selection UX
- inspector UX
- edit generation
- preview orchestration

The durable contract here is the stable ID scheme, not the product UI of the editor/tool.

Key implementation files:
- `src/platform/ui/viz.ts`
- `src/platform/ui/visualizer-context.tsx`
- `src/platform/ui/visualizer/index.ts`
- `src/platform/ui/visualizer/wrapped.tsx`

## Layer 4 — Routes (`app/**`, `app-*/*`)

Thin navigation wiring only. No visual styling or domain rendering.

## Inspectable Surface

External tooling may inspect and operate on:
- stable UI IDs produced through `createUi(prefix)` and `ui.scope(...)`
- rendered shared primitives carrying `data-uiid`
- platform-defined theme values through the allowed override surface
- primitive props and semantic variants that already exist in the closed editable contract

External tooling may not treat the following as open-ended editing surfaces:
- new primitive APIs
- new theme schema keys
- new variant families
- arbitrary styling vocabularies outside the platform contract
- raw per-element `style` overrides on platform primitives
- bypass props such as `contentContainerStyle` and `className`
- arbitrary Tamagui positioning, opacity, sizing, transform, or per-state style props unless the platform has explicitly narrowed them

## Out Of Scope For This Phase

The following are intentionally deferred:
- how extensible blocks are defined
- whether blocks are registered/discoverable as first-class platform concepts
- which block-level fields are editable by tooling
- block serialization, persistence, and migration rules
- product-level editor workflows

## Enforcement

- `@ui` / `src/platform/ui/index.ts` is the only supported shared UI import surface.
- `src/platform/ui/contract.ts` is the platform-owned manifest for open vs closed UI surface categories.
- Shared helpers must keep ordinary props. No repo-specific public styling DSL.
- Public platform primitives must not accept `style` as an override escape hatch.
- Architecture lint: `npm run lint:arch`
- Type check: `npm run typecheck`
