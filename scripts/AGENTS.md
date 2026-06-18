# AGENTS.md — `scripts/`

## Scope

Applies to `scripts/**`.

## Purpose

Build, generation, and tooling scripts. Not shipped. Not imported by app code.

---

## scan-ui-documents.mjs

Scans `*.layout.tsx` files in an app and emits a `UiDocument` tree for each screen.

**Run after any structural change to a layout file:**

```
node scripts/scan-ui-documents.mjs example-app
```

Output: `src/generated/ui-documents.<appId>.ts` — do not edit by hand.

### Key behaviors

- IDs are assigned sequentially (`prefix-0`, `prefix-1`, …) in DFS pre-order.
- `ui("id", element)` wrappers are transparent — the scanner unwraps them and scans the inner element.
- `<ProfileCard />` and other registered blocks expand inline from the block registry.
- Conditional expressions (`{x ? … : null}`) and dynamic children (`{items.map(…)}`) produce a dim placeholder View. They do not recurse into branches.
- Semantic props (`tone`, `size`, `weight`, `variant`, `label`) are in `VISUAL_PROPS` and must be kept in sync with the primitives.
- `label` on Button is stored as `text` in the UiDocument. `variant` defaults to `"primary"` when not explicit.

### Adding a prop to the scanner

Add the prop name to the `VISUAL_PROPS` Set at the top of the file. If the prop needs special handling (remapping, defaulting), add it in the component-specific block of `walkJsxElement`.

### ID stability

IDs depend on the order elements appear in the JSX tree. Reordering, adding, or removing elements changes IDs for all subsequent siblings. After any structural change:

1. Re-run the scanner.
2. Update the `ui()` stamps in the layout file to match the new IDs.
3. Verify selection in the canvas.

---

## Other scripts — brief map

| Script | Purpose |
|---|---|
| `scaffold-app.mjs` | Generate a new app scaffold |
| `scaffold-building-blocks.mjs` | Generate block scaffolds |
| `scan-ui-documents.mjs` | Layout → UiDocument (see above) |
| `generate-api.ts` | API type generation |
| `check-layer-boundaries.js` | Enforce import boundary rules |
| `clean.mjs` | Clean build artifacts |
| `app-registry.mjs` | App ID registry utilities |
