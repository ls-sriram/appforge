# Architecture Dependency Rules

## Purpose

- Define allowed dependency directions across layers.

## Rules

- App depends on API contracts, not server internals.
- Server depends on API contracts for transport mapping, not app code.
- Shared conventions belong in docs/contracts, not copied per layer.
- `src/apps/<app-name>/*` may depend on shared `src/*` modules.
- Shared `src/*` modules (outside `src/apps/*`) must not depend on `src/apps/*`.
- `src/apps/<app-a>/*` must not depend on `src/apps/<app-b>/*`.

## Violations

- If a change requires breaking a rule, record the rationale in `docs/decisions/` first.
