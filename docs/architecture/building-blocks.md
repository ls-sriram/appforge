# Building Blocks

AppForge frontend code should be assembled from reusable UI layers instead of ad hoc screen-owned styling.

## Shared UI Layers

- `src/ui/primitives/`: low-level interaction and layout primitives
- `src/ui/panels/`: semantic containers and shells
- `src/ui/blocks/`: reusable product-facing compositions
- `src/ui/layouts/`: page-level reusable layout structures

## App Layer

The reference app under `src/apps/example-app/*` should consume the shared UI layers and only own app-specific composition and behavior.

## Scaffold Alignment

The scaffold tool should generate code that composes these shared layers instead of introducing new app-local primitives by default.
