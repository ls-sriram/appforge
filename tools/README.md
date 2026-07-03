# Contract Tooling

The canonical contract system lives under `.architecture/` and `src/**/.contract.yaml`.

There are two current tooling surfaces:

- `scripts/contract-system.ts` powers the package scripts used in normal repo workflows.
- `tools/cli.mjs` and `tools/check-layer-boundaries.mjs` are repo-local inspection helpers for contract resolution and layer enforcement.

Commands:

```bash
npm run contracts:validate
npm run contracts:analyze
npm run contracts:task -- --objective "…" src/features/example/example.screen.tsx
npm run contracts:drift
node tools/cli.mjs resolve --file src/features/home/home.screen.tsx
node tools/cli.mjs list layers
node tools/cli.mjs list contracts
node tools/cli.mjs validate
node tools/check-layer-boundaries.mjs
```

Rules:

- `.architecture/repository.yaml` and `.architecture/layers.yaml` are the source of truth for repository structure and layer definitions.
- `src/agent/contracts/**` is the typed implementation used by package scripts.
- `tools/*.mjs` should stay thin and read from the same `.architecture` contracts rather than reintroducing parallel architecture rules.
- Scaffolding flows are not part of the current repo-local tooling surface.
