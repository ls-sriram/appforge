# AGENTS.md for `src/ui/panels`

## Scope

Applies to `src/ui/panels/**`.

## Responsibility

Panels are semantic surface wrappers. They map named variant tokens to Block paint
so callers reason in surface intent ("muted", "strong") rather than raw paint tokens.
Panel is the **public card API** — Block is the implementation detail.

```
Panel              content card — default | muted | strong | subtle | inverse | selected
SectionPanel       titled group — optional header + children + footer
CalloutPanel       labelled callout with icon — default | inverse tone
OverlaySheetShell  modal bottom sheet shell — Modal + keyboard-avoid + scroll
```

## Composition Hierarchy (imports only from)

```
panels  →  primitives  →  theme
```

Panels must not import feature controllers, models, stores, router modules,
or app-specific code.

## PanelVariant → PaintVariant Mapping

| PanelVariant | PaintVariant    |
|--------------|-----------------|
| default      | panel           |
| muted        | panel-muted     |
| strong       | panel-strong    |
| subtle       | panel-subtle    |
| inverse      | panel-inverse   |
| selected     | selected        |

Domain-specific surfaces (cost cards, application tiles, etc.) are **not** variants
here. Each domain component owns its surface via a named local `View` + `StyleSheet`
using raw theme tokens.

## Rules

1. **No `style` prop** — Panel, SectionPanel, CalloutPanel expose no `style` passthrough.
2. **No domain terms** — dental, interview, application, auth, etc. do not appear here.
3. **No feature imports** — no app, router, or viewmodel imports.
4. **Expose structural tokens only** — `pad`, `padH`, `padV`, `overflow`, `frame`, `variant`.
5. **Shell geometry via named local Views** — OverlaySheetShell is the only component
   allowed to use raw `View` + `Modal` + `KeyboardAvoidingView`. Its geometry
   (border-radius, maxHeight) lives in a named local component, not on Panel.

## Good Example

```tsx
// Semantic card — callers say "muted", not "panel-muted"
<Panel variant="muted" pad="md">
  <Text variant="body">{content}</Text>
</Panel>

// Sheet geometry in a named local View, not on Panel
function SheetShell({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  return (
    <View style={[styles.sheet, {
      borderTopLeftRadius: t.colors.radii.xl,
      borderTopRightRadius: t.colors.radii.xl,
    }]}>
      {children}
    </View>
  );
}
```

## Bad Examples

```tsx
// Bad: style passthrough on Panel
<Panel style={{ marginTop: 8 }}>…</Panel>

// Bad: domain concept in variant
<Panel variant="application-card">…</Panel>  // not a PanelVariant

// Bad: geometry directly on Panel
<Panel variant="strong" style={[styles.sheet, { borderTopLeftRadius: r }]}>…</Panel>
```
