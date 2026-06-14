# UI Skill (Mandatory for UI Tasks)

Use this skill before any UI change.

## Invocation

- Trigger phrase: `Use UI skill`
- Scope: any work touching `src/theme/**`, `src/ui/primitives/**`,
  `src/ui/panels/**`, `src/ui/blocks/**`,
  `src/apps/**/ui/**`, `src/apps/**/features/**/ui`, `src/features/**/ui`.
- If this skill conflicts with ad-hoc screen styling, this skill wins.

## Non-Negotiable Rules

1. No `style` prop on `Block` or `Panel` — use named token props only.
2. No raw unnamed `View` in blocks — name it first (`IconBoxWell`, `ScoreRing`, etc.).
3. No inline style objects in feature views or route files.
4. No hardcoded color/spacing/radius values in feature-level code.
5. No domain terms in `src/ui/**` — Block paint variants are design-system only.
6. `src/ui/components/` is deleted — import panels from `src/ui/panels/`.
7. `Stack`, `Inline`, `Frame`, `Center`, `Inset`, `Surface` are deleted — use `Block`.

## Layer Ownership

1. `src/theme/**` — Tokens  
   Spacing, typography, semantic colors, radii, elevation, interaction states.

2. `src/ui/primitives/**` — Composition + atoms  
   `Block` (universal container), leaf atoms (`Text`, `Button`, `Icon`, `Input`, etc.),
   `ScrollArea`. No `style` prop on Block.

3. `src/ui/panels/**` — Surface wrappers  
   `Panel`, `SectionPanel`, `CalloutPanel`, `OverlaySheetShell`.
   Map semantic variant names to Block paint.

4. `src/ui/blocks/**` — Composites  
   App-agnostic named composites built from primitives + panels.
   Named local View components are allowed for pixel-geometry shapes.

5. `src/apps/<app>/ui/**` — App-shared presentation  
   `components/`, `scaffolds/`, `theme/`. Reused across ≥2 features of the app.
   App navigation chrome lives in `scaffolds/` here — `src/ui/scaffolds/` is deleted.

6. `src/apps/<app>/features/**` — Feature composition  
   View state + actions only. No inline style.

7. `app/**`, `app-*/*` — Routes  
   Navigation wiring only.

## Forbidden Patterns Outside Layers 1–3

- `style={{ ... }}` or `StyleSheet.create(...)` in feature/route files
- Raw unnamed `<View style={...}>` in blocks
- Hardcoded color/spacing/radius/shadow literals
- `useTheme()` for direct style tuning in feature views
- `<Block paint="application-card">` or any domain term as paint variant
- `import { Stack } from "..."` — Stack is deleted

## DIP Addendum

- Any layout owning a `ScrollView` in `the reference app` must use
  `DipContentShell` and `DIP_CONTENT_SPACING` — never hardcode padding values.
- DIP primary buttons use `DipButton`, not the shared `Button` primitive directly.

## Merge Checklist (UI PRs)

1. No inline styles in feature views or routes.
2. Block/Panel receive no `style` prop.
3. New containers are named (not anonymous inline Views).
4. Domain surfaces own their own View+StyleSheet; not added to PaintVariant.
5. Spacing uses token scale only.
6. `npm run typecheck` passes.
