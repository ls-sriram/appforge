# AST Search Runbook

## Purpose

- Make structural code search the default for non-trivial discovery and refactors.

## Standard Workflow

1. Define the target code shape (not text tokens).
2. Prototype a minimal rule and test on a snippet.
3. Run repository scan and export JSON when needed.
4. Refine with `kind`, `has`, `inside`, `all`, `any`, `not`.
5. Save reusable rules in `tools/ast-grep/rules/`.

## Quick Commands

From repo root:

```bash
# 1) Verify ast-grep is available
npx -y @ast-grep/cli --help

# 2) Simple pattern search (TypeScript)
npx -y @ast-grep/cli run --pattern 'console.log($ARG)' --lang ts src app

# 3) Debug AST/pattern interpretation
npx -y @ast-grep/cli run --pattern 'function $NAME($$$ARGS) { $$$BODY }' --lang ts --debug-query=pattern src

# 4) Rule-based scan
npx -y @ast-grep/cli scan --rule tools/ast-grep/rules/example.yml src app server

# 5) JSON output for scripting/pipelines
npx -y @ast-grep/cli scan --rule tools/ast-grep/rules/example.yml --json src app server
```

## Rule Authoring Standard

- Always include `id` and `language`.
- For `has`/`inside`, set `stopBy: end` unless intentionally bounded.
- Prefer small composable rules over one giant rule.
- Name rule files by intent: `find-<intent>.yml`.

Example:

```yaml
id: find-async-without-try
language: ts
rule:
  all:
    - kind: function_declaration
    - has:
        pattern: await $EXPR
        stopBy: end
    - not:
        has:
          kind: try_statement
          stopBy: end
```

## Repo Conventions

- Save durable reusable rules in `tools/ast-grep/rules/`.
- Put one-off experiments in temporary files and delete after use.
- Prefer AST search over `rg` when matching behavior/structure.
- Prefer `rg` for plain text discovery only.
