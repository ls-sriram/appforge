# Behavioral Guidelines for Coding Work

These guidelines reduce common LLM coding mistakes. Merge them with project-specific instructions as needed.

Tradeoff: these guidelines bias toward caution over speed. For trivial tasks, use judgment.

## UI Work Prerequisite

Before any UI change, invoke `Use UI skill` and follow:

- `skills/ui-skill.md`
- `docs/ui-layer-boundary.md`

## 1. Think Before Coding

Do not assume. Do not hide confusion. Surface tradeoffs.

Before implementing:

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them. Do not pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what is confusing. Ask.

## 2. Simplicity First

Use the minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No flexibility or configurability that was not requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: would a senior engineer say this is overcomplicated? If yes, simplify.

## 3. Surgical Changes

Touch only what you must. Clean up only your own mess.

When editing existing code:

- Do not improve adjacent code, comments, or formatting.
- Do not refactor things that are not broken.
- Match existing style, even if you would do it differently.
- If you notice unrelated dead code, mention it. Do not delete it.

When your changes create orphans:

- Remove imports, variables, and functions that your changes made unused.
- Do not remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user’s request.

## 4. Goal-Driven Execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

- "Add validation" -> "Write tests for invalid inputs, then make them pass"
- "Fix the bug" -> "Write a test that reproduces it, then make it pass"
- "Refactor X" -> "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

1. Step -> verify: check
2. Step -> verify: check
3. Step -> verify: check

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

These guidelines are working if:

- Fewer unnecessary changes land in diffs.
- Fewer rewrites are needed due to overcomplication.
- Clarifying questions come before implementation rather than after mistakes.

## 5. Nullability Discipline

Default policy: avoid `| null` in domain/app logic.

- Domain, viewmodel, usecase, and route-facing contracts should prefer:
  - required values, or
  - discriminated unions, or
  - typed `Result` errors.
- Nullable fields are allowed only at raw transport boundaries:
  - generated DTOs (`src/generated/**`)
  - generated OpenAPI type defs (`src/types/api.d.ts`)
  - external library type declarations we do not control.
- Convert boundary uncertainty immediately at the service edge.
- Do not use nullable unions to silently absorb invalid data.
- Invalid required data should fail explicitly (typed error), not degrade to `null`.

Current enforcement:

- Global CI rule: no `| null` in `src/**` and `app/**`.
- Allowlist exceptions:
  - `src/generated/**`
  - `src/types/api.d.ts`
- Additional MVVM guardrails remain active via `npm run lint:arch`.

## 6. Formatter Structure

- Prefer reusable formatters over inline JSX string logic for repeated display rules.
- Place cross-app generic formatters in `src/core/formatters/*`.
- Place app/domain-specific formatters in `src/apps/<app>/formatters/*`.
- UI components may call formatters directly; mappers are optional.
- Keep formatter functions pure and explicit (`formatX(value, options?) => string`).
