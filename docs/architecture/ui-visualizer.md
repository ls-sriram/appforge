# UI Visualizer Architecture

The AppForge UI visualizer is a design-time inspector embedded in the appforge-site web app. It renders each screen's real layout component in a phone-frame canvas, allows users to click nodes to inspect their token values, and propagates inspector edits back to the live canvas.

---

## Three-layer layout architecture

Every screen follows this structure:

| Layer | File | Owns |
|---|---|---|
| Layout | `*.layout.tsx` | Visual structure — pure JSX using `src/ui` primitives and semantic variant contracts |
| Screen | `*.screen.tsx` | Data wiring — hooks, handlers, state, passes props to Layout |
| Blocks | `src/blocks/` | Shared visual components reused across screens |

Layout files are the unit the visualizer operates on. They must:
- Import only from `src/ui` and `src/blocks`.
- Accept all text/labels/handlers as props with defaults.
- Use semantic variant contracts (`tone`, `size`, `weight`, `variant`) instead of raw Tamagui token props.
- Stamp every meaningful element with `ui("id", <Element />)` so the canvas and inspector share node IDs.

---

## Canvas rendering — LiveLayout only

Every screen renders via its actual `*.layout.tsx` component until the in-memory document structure diverges. Pure additions keep the live layout shell and inject inserted subtrees into the stamped parent DOM node; destructive edits such as removals or reparenting switch the canvas to the in-memory renderer.

```
UiCanvasView
  → if structure unchanged:
      LIVE_LAYOUTS[documentId]        live-layout-registry.tsx
      → <LiveLayout />                the real *.layout.tsx component
          wrapped by VisualizerProvider
  → if only additive changes:
      <LiveLayout />
      + createPortal(renderUiNode(insertedRoot)) into stamped parent `data-uiid`
  → if destructive structural changes:
      renderUiNode(document.rootId)   renders the in-memory UiDocument tree directly
```

`renderers/render-ui-node.tsx` remains the fallback for block/fixture previews and for edited screen structures that no longer match the static layout source.

---

## Click-to-select — `data-uiid` DOM walk

Every meaningful JSX element in a layout file is stamped with `ui("id", element)`:

```tsx
// src/ui/viz.ts
export function ui(id: string, element: React.ReactElement): React.ReactElement {
  return React.cloneElement(element, { __uiid: id, "data-uiid": id });
}
```

The visualizer barrel's wrapped components receive `__uiid` and place `data-uiid` on their DOM element. On canvas click, `use-live-node-selection.ts` walks up the DOM from the click target looking for the nearest `data-uiid` attribute:

```ts
while (el && el !== containerRef.current) {
  const id = el.getAttribute("data-uiid");
  if (id) { onSelectNode(id); return; }
  el = el.parentElement;
}
```

Node IDs in the layout file match node IDs in the scanned `UiDocument`, so the same ID drives both canvas selection and the inspector/layers panel.

---

## Barrel swap — visualizer-aware primitives

When `APP_ID=appforge-site`, `metro.config.js` aliases:

```
src/ui/index.ts  →  src/ui/visualizer/index.ts
```

This means every `import { Body, Button, ... } from '@app/ui'` in a layout file gets the wrapped version automatically — no source change required in layout files.

The visualizer barrel (`src/ui/visualizer/index.ts`) re-exports the same runtime surface as `src/ui/index.ts` and overrides the primitives that need visualizer behavior with wrapped versions from `wrapped.tsx`.

Imports originating from within `src/ui/visualizer/` are excluded from the alias (prevents circular resolution: the wrapped barrel imports the real barrel).

### Two wrapper strategies

**`makeWrapped`** — Tamagui `styled(Stack)` components forward `data-*` to the DOM natively. Passes viz props directly on the component.

**`makeWrappedInBox`** — used for components whose root does not forward `data-*` to the DOM, including `Button`, `Icon`, and retained helper primitives such as `Avatar`, `Badge`, `Input`, `TextArea`, `SelectableChip`, and `ProgressBar`. Wraps in a `display:contents` div so viz attributes land on the DOM without affecting layout. This barrel is web-only so `div` is safe.

### Each wrapped component

1. Reads `__uiid` from props.
2. Looks up `ctx.propOverrides[__uiid]` and merges into the component's props (live inspector edits).
3. Sets `data-viz-selected` and `onClick` for CSS selection outline and click handling.
4. Falls through to `<RealComp {...rest} />` when `ctx.active === false`.

---

## Inspector → live canvas prop flow

```
Inspector change
  → updateSelectedNodeProp(key, value)
  → applyDocument(updateNodeProps(...))      keeps UiDocument in sync (inspector re-renders)
  → setLivePropOverrides({ [nodeId]: {…} }) only for LiveLayout screens
  → <UiCanvasView propOverrides={livePropOverrides} />
  → <VisualizerProvider propOverrides={propOverrides} />
  → ctx.propOverrides[__uiid]               consumed by wrapped component
  → merged into the real component's props  live canvas re-renders
```

`livePropOverrides` is cleared when switching screens.

---

## Screen composition

`ui-visualizer.screen.tsx` is a thin composition shell. It owns feature-level orchestration only:

- `useUiPlayground()` and `useDesktopRepoSource()`
- panel collapse / left-mode state
- wiring props into the visualizer views

Top bar, left panel, workspace, right panel, status bar, and panel handles live under `views/` as pure render components. They may keep tiny local UI state such as a dropdown open/closed flag, but they must not own document mutation or feature state.

---

## Scanner — `scripts/scan-ui-documents.mjs`

Produces `src/generated/ui-documents.<appId>.ts`. Run after any structural change to a `*.layout.tsx` file:

```
node scripts/scan-ui-documents.mjs <app-id>
```

### What the scanner captures

- Full JSX tree: component type, layout/spacing/color props, text content.
- Semantic props: `tone`, `size`, `weight`, `variant`, `label` (mapped to `text` for Button).
- Block references: `<ProfileCard />` expands inline using the block's pre-scanned node tree.
- Transparent `ui()` wrappers: the scanner unwraps `ui("id", element)` and scans the inner element.

### What the scanner skips

- Conditional branches (`{error ? … : null}`) → emits a dim placeholder View.
- Dynamic children (`{items.map(…)}`) → emits one placeholder View for the expression.
- Runtime-only props (event handlers, booleans computed from state).

### ID assignment

IDs are assigned sequentially (`${prefix}-${counter++}`) in DFS pre-order: a node's ID is assigned before its children are walked. The counter resets per file. IDs in layout `ui()` stamps must match the generated IDs exactly.

### Semantic prop whitelist (`VISUAL_PROPS`)

```
bg, color, borderColor, borderWidth, br, p, px, py, pt, pb, pl, pr,
gap, ai, jc, f, flexWrap, flexShrink, w, h, maxWidth, minWidth,
maxHeight, minHeight, fontFamily, fontSize, ta, tt, letterSpacing,
opacity, tone, size, weight, variant, label
```

Add to this set when a new semantic prop is added to a primitive.

---

## Selection outline — CSS, not style prop

`UiCanvasView` injects a `<style>` tag on mount:

```css
[data-viz-selected="true"] {
  outline: 1.5px solid #4F8EF7 !important;
  outline-offset: -1px;
  border-radius: 3px;
}
[data-viz-node], [data-uiid] { cursor: pointer; }
```

Selection state is expressed as a DOM attribute (`data-viz-selected="true"`), not a React `style` prop. This avoids mixing with Tamagui's shorthand prop expansion, which can leak non-DOM props onto DOM elements.

---

## Adding a new screen to the visualizer

1. Create `*.layout.tsx` using semantic props and default prop values.
2. Run the scanner: `node scripts/scan-ui-documents.mjs <app-id>`.
3. Add `ui("prefix-N", ...)` stamps to every meaningful element, using IDs from the generated document.
4. Register the layout in `renderers/live-layout-registry.tsx`.
5. Verify in the canvas: click each element and confirm the inspector shows the correct node.

---

## Key files

| Path | Role |
|---|---|
| `src/ui/viz.ts` | `ui()` stamper |
| `src/ui/visualizer-context.tsx` | `VisualizerProvider` and `useVisualizerContext` |
| `src/ui/visualizer/index.ts` | Visualizer barrel |
| `src/ui/visualizer/wrapped.tsx` | Wrapped primitive components |
| `metro.config.js` | Barrel swap resolver |
| `scripts/scan-ui-documents.mjs` | Layout → UiDocument scanner |
| `src/generated/ui-documents.<app-id>.ts` | Generated — do not edit |
| `src/apps/appforge-site/features/ui-visualizer/renderers/live-layout-registry.tsx` | documentId → component |
| `src/apps/appforge-site/features/ui-visualizer/renderers/use-live-node-selection.ts` | DOM click → node selection |
| `src/apps/appforge-site/features/ui-visualizer/state/use-ui-playground.ts` | All visualizer state |
| `src/apps/appforge-site/features/ui-visualizer/views/ui-canvas.view.tsx` | Canvas + CSS injection |
| `src/apps/appforge-site/features/ui-visualizer/views/ui-inspector.view.tsx` | Inspector panel |
