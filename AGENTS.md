# AGENTS.md

## Scope

- Applies to the whole repository.
- Purpose: global execution rules and routing only.

## Must Follow

- Make the smallest correct change first.
- Reuse existing patterns before introducing abstractions.
- Keep instructions hierarchical; prefer scoped `AGENTS.md` over root details.
- Keep durable architecture knowledge in `docs/architecture/*`, not in `AGENTS.md`.
- If rules conflict, the most specific path-scoped `AGENTS.md` wins.

## Checks

- Run the nearest targeted checks for changed files first.
- Expand to broader checks only when needed.

## End-of-Task Doc Sync

- Update docs at the end of implementation, after code and checks stabilize.
- Update exactly one owning doc by default (nearest path-scoped owner).
- Update multiple docs only for true cross-cutting changes.
- Keep updates delta-only; avoid restating unchanged architecture.

## Doc Selection Order

1. Nearest scoped doc for changed code path.
2. Cross-cutting architecture doc only if invariant/boundary changed.
3. ADR in `docs/decisions/` only for new tradeoff or policy decision.
4. Root map docs only when navigation/ownership changed.

## Key References

- `docs/INDEX.md`
- `docs/architecture/overview.md`
- `docs/runbooks/ast-search.md`
- `docs/decisions/`

## Out of Scope

- Detailed per-folder implementation rules.
- Long-form architecture or decision history.

## Path Map

- `app/**` -> `app/AGENTS.md`
- `api/**` -> `api/AGENTS.md`
- `server/**` -> `server/AGENTS.md`
- `docs/**` -> `docs/AGENTS.md`
- `scripts/**` -> `scripts/AGENTS.md`
- `src/ui/**` -> `src/ui/AGENTS.md`
- `src/ui/visualizer/**` -> `src/ui/visualizer/AGENTS.md`
- `src/apps/appforge-site/features/ui-visualizer/**` -> `src/apps/appforge-site/features/ui-visualizer/AGENTS.md`
