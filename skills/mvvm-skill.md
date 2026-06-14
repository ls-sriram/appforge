# MVVM Skill (Mandatory for Feature Work)

Invoke with: `Use MVVM skill`

## Non-negotiable

1. View emits intent only.
2. ViewModel handles intent -> state transition.
3. ViewModel calls UseCase only.
4. UseCase calls Repository only.
5. Repository calls Service/DataSource only.
6. Route files wire dependencies, but do not call services directly.

## Pragmatic Scope

- Keep boundaries strict, but keep layering minimal for simple features.
- Add repository/data/store layers only when feature complexity requires them.
- Do not create extra files that add no ownership clarity.

## Pre-merge checklist

1. Any `src/features/*/views/*` file importing service/api? If yes, reject.
2. Any `*Controller` / `viewmodel` importing service directly? If yes, reject.
3. Any `app/*` file importing `src/services/*`? If yes, reject.
4. `npm run lint:arch` passes.
