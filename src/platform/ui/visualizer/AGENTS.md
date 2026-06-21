# AGENTS.md — `src/platform/ui/visualizer`

## Scope

Applies to `src/platform/ui/visualizer/**`.

## Purpose

The visualizer barrel in this repo provides the shared visualizer-aware UI wrappers and ID stamping contract used by external visualizer consumers.

Architecture doc: `docs/ui-layer-boundary.md`

---

## Barrel swap — how it works

`src/platform/ui/visualizer/index.ts` re-exports the real barrel and overrides specific exports with wrapped versions from `wrapped.tsx`.

---

## wrapped.tsx — two wrapper factories

**`makeWrapped`** — for Tamagui `styled(Stack)` components (YStack, XStack, Body, Heading, Label, Display, Tag). These forward `data-*` props through to the DOM natively.

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

1. Uses the explicit `__uiid` passed from layout/stage code.
2. Looks up `propOverrides[__uiid]` from `VisualizerContext` and merges into the component's props.
3. Stamps `data-uiid`, `data-viz-type`, `data-viz-selected`, and `onClick` so the DOM walk discovers nodes and CSS selection works.

When `ctx.active === false` or `__uiid` is absent, the wrapper is a passthrough — it renders `<RealComp {...rest} />` with no overhead.

Stage/layout files must pass explicit stamps down through a `ui` helper parameter and spread them onto meaningful shared UI primitives as `{...ui("id")}`. The DOM walk only discovers nodes that are explicitly stamped.

---

## visualizer-context.tsx

Lives at `src/platform/ui/visualizer-context.tsx`.

Provides: `active`, `selectedNodeId`, `onSelect`, `propOverrides`.

---

## Do not

- Add business logic or state to wrapped components.
- Import from feature layers or app-specific code.
- Use `style` prop mixing with Tamagui shorthands — use `data-viz-selected` CSS attribute for selection outline.
- Re-implement Tamagui's prop normalization — pass all props through to the real component unchanged, then layer viz concerns around it.
- Add `makeWrappedInBox` for a component without first confirming its root element strips `data-*` from the DOM.
