# AGENTS.md for docs/

## Scope

- Applies to `docs/**`.

## Must Follow

- Keep docs concise, task-oriented, and command-specific.
- Separate durable architecture docs from session memory docs.
- Update docs in the same change when behavior/workflow changes.
- Prefer links over duplicated explanations.

## Checks

- Verify referenced paths and commands exist.
- Remove stale links when touching related docs.

## Doc Hygiene Rule

- Prefer nearest-owner doc updates over central docs.
- Reject broad doc edits that do not map to a concrete code change.
- Keep change notes short and specific to what changed.

## Key References

- `docs/INDEX.md`
- `docs/architecture/`
- `docs/runbooks/ast-search.md`

## Out of Scope

- Source-code behavior changes.
- Long-form design notes inside `AGENTS.md` files.
