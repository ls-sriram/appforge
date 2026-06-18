# AGENTS.md — `src/ui/visualizer`

## Scope

Applies to `src/ui/visualizer/**`.

## Purpose

The visualizer barrel is a build-time swap for `src/ui/index.ts` that makes every UI primitive visualizer-aware. It is active only when `APP_ID=appforge-site` (controlled by `metro.config.js`).

Architecture doc: `docs/architecture/ui-visualizer.md`

---

## Barrel swap — how it works

`metro.config.js` aliases `src/ui/index.ts` → `src/ui/visualizer/index.ts` for all imports that do **not** originate inside `src/ui/visualizer/` itself. This prevents a circular import: the visualizer barrel imports the real barrel, so the real barrel must not be aliased when resolved from within the visualizer dir.

`src/ui/visualizer/index.ts` re-exports everything from the real barrel, then overrides specific exports with wrapped versions from `wrapped.tsx`.

---

## wrapped.tsx — two wrapper factories

**`makeWrapped`** — for Tamagui `styled(Stack)` components (YStack, XStack, View, Body, Heading, Label, Display, Tag). These forward `data-*` props through to the DOM natively.

```tsx
// Passes data-uiid, data-viz-selected, onClick directly on the component.
return <RealComp {...merged} {...vizProps} />;
```

**`makeWrappedInBox`** — for components whose root element does NOT forward `data-*` (Button uses `styled(Pressable)`, Icon uses an RN `View`). Wraps in a `display:contents` div so viz attributes land on the DOM without affecting layout. Safe here: this barrel is web-only.

```tsx
return (
  <div data-uiid={__uiid} data-viz-selected={...} onClick={...} style={{ display: "contents" }}>
    <RealComp {...merged} />
  </div>
);
```

Use `makeWrapped` by default. Switch to `makeWrappedInBox` only when the component's internal root element filters out `data-*` props.

---

## Each wrapper does three things

1. Reads `__uiid` from props (stamped by `ui()` in layout files).
2. Looks up `propOverrides[__uiid]` from `VisualizerContext` and merges into the component's props.
3. Sets `data-viz-selected` and `onClick` so CSS selection outline and click-to-select work.

When `ctx.active === false` (outside the canvas), the wrapper is a passthrough — it renders `<RealComp {...rest} />` with no overhead.

---

## visualizer-context.tsx

Lives at `src/ui/visualizer-context.tsx` (not inside the visualizer dir, so it can be imported by both the real barrel consumers and the visualizer barrel without triggering the metro alias).

Provides: `active`, `selectedNodeId`, `onSelect`, `propOverrides`.

---

## Do not

- Add business logic or state to wrapped components.
- Import from `src/apps/**` or any feature layer.
- Use `style` prop mixing with Tamagui shorthands — use `data-viz-selected` CSS attribute for selection outline.
- Re-implement Tamagui's prop normalization — pass all props through to the real component unchanged, then layer viz concerns around it.
- Add `makeWrappedInBox` for a component without first confirming its root element strips `data-*` from the DOM.
