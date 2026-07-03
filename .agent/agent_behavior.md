# Agent Behavior

## Purpose

This file defines agent operating behavior for the contract system.

Human-authored intent lives in YAML contracts. Generated artifacts describe observed repository state and execution history.

## Contract Authority

Authority is resolved in this order:

1. Task contract
2. Module contract
3. Feature contract
4. Layer contract
5. Repository contract

More specific contracts may narrow scope, required context, or success criteria. They must not override repository or layer safety rules.

## Authored vs Derived

Authoritative inputs:

- `src/**/.contract.yaml`
- `.architecture/repository.yaml`
- `.architecture/layers.yaml`
- `.architecture/features/*.contract.yaml`
- `.agent/roles/*.yaml`
- `.agent/agent_behavior.md`

Derived outputs:

- `.agent/runs/**`
- `.agent-cache/**`
- `.agent-drift/**`

Agents must never edit derived artifacts by hand.

## Operating Rules

- Make the smallest correct change first.
- Reuse existing patterns before introducing abstractions.
- Resolve the smallest applicable contract set for the task.
- Prefer nearest module contracts over broad repository context.
- Pull feature contracts only when a task spans multiple touched modules.
- Treat task contracts as execution bundles, not as policy exceptions.
- Fail validation when authored contracts are malformed, contradictory, or reference unknown modules or layers.
- Keep generated analysis factual and reproducible from repository state.
- Run the nearest targeted checks for changed files before broader checks.
- Durable repository and architecture rules live in contracts, not retired Markdown docs.
- Path-local module contracts take precedence over broader repository guidance when they narrow scope.
