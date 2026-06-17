# Code Visualizer

Local web UI that statically scans the repo and shows every aspect of the
codebase in one place: screens, design tokens, UI components, service-layer
calls, and backend routes (both the proto contract and the Kotlin
implementation).

## Run

```bash
npm run visualize
```

Open `http://localhost:4322`.

Optional port:

```bash
VIZ_PORT=4500 npm run visualize
```

## What it shows

- **Screens** — apps from `config/app-manifest.json`, route constants from
  `src/navigation/routes.ts` / `src/apps/*/navigation/routes.ts`, and the
  file-based screen files under `app-example-app/**`.
- **Design Tokens** — color palette and semantic defaults from
  `src/theme/factory.ts`, layout/spacing/motion tokens from
  `src/theme/tokens.ts`, and the full `Theme.colors` shape.
- **UI Components** — every component under `src/ui/{primitives,blocks,panels,layouts}`
  with its extracted `Props` fields.
- **Service Calls** — classes/objects under `src/services/*.ts`, their public
  methods, and which backend route each one calls (via `callProto(...)` or
  direct `api.get/post/...` calls), cross-referenced against the proto
  contract.
- **Backend Routes** — the generated proto route manifest
  (`src/generated/proto/route-manifest.json`) alongside the Kotlin route
  handlers under `server/src/main/kotlin/com/appforge/server/routing/*.kt`.
- **Features (MVVM)** — which architectural layers (`ui`, `viewmodel`,
  `usecases`, `domain`, `data`, `services`, `runtime`) each feature in
  `src/features/*` actually has.

Use the search box to filter any tab. "Rescan" re-reads the filesystem
(no caching, no build step) — useful after pulling new code or generating
new proto routes.

## How it works

`scan.mjs` does plain regex/text based extraction (no TypeScript compiler,
no AST) over the relevant files and folders, then `server.mjs` serves the
result as JSON at `/api/scan`. `public/app.js` renders it client-side. This
keeps the tool dependency-free and fast, at the cost of being a best-effort
approximation rather than a guaranteed-correct parse — if a file's shape
changes significantly, the extraction patterns in `scan.mjs` may need a
small tweak.
