# Architecture Invariants

## Purpose

- Capture non-negotiable rules that protect correctness.

## Invariants

- API schema and route mappings are defined in `api/proto/*`.
- API time fields use `google.protobuf.Timestamp`.
- Generated artifacts are derived and not hand-edited.
- Most specific scoped `AGENTS.md` instruction takes precedence.

## Update Rule

- Add, change, or remove invariants only with explicit rationale.
