# MVVM Architecture Contract (Strict)

## Mandatory Layer Order

`View -> ViewModel (Controller) -> UseCase -> Repository -> DataSource (Service/API/Storage)`

No layer may skip over the next layer.

Direction is strict; file count is not.

## Layer Responsibilities

### View (`src/features/*/views/*`)
- Dumb render only.
- Emits typed intents only.
- No service/API/storage imports.
- No domain orchestration.

### ViewModel / Controller (`src/features/*/viewmodel/*`, `*Controller.ts`)
- Owns UI state transitions.
- Receives intents from view.
- Calls use-cases only.
- No direct service/API imports.

### UseCase (`src/features/*/usecases/*`)
- One business action per use-case.
- Orchestrates repository methods.
- No UI imports.

### Repository (`src/features/*/data/*`, `src/features/*/domain/*`)
- Stable feature data contract.
- Chooses datasource implementation(s).
- No view or viewmodel imports.

### DataSource (`src/services/*`)
- Transport/persistence details only.
- No feature UI imports.

## Prohibited Imports

1. `views/*` -> `src/services/*`
2. `views/*` -> `src/features/*/data/*`
3. `viewmodel/*` or `*Controller.ts` -> `src/services/*`
4. `app/*` route files -> `src/services/*`

## Minimum Viable Layering (No Over-Engineering)

Use the minimum number of layers that still preserves direction and ownership.

1. Simple, single-screen feature:
- `view + viewmodel + usecase`
- Repository/data can be thin or shared if no feature-specific complexity exists.

2. Multi-screen feature with shared draft/session state:
- Add `state/store.ts` at feature level.
- Keep writes through viewmodel intents only.

3. Complex feature (multiple data sources, richer domain rules):
- Full split: `view`, `viewmodel`, `usecases`, `domain`, `data`.

Never allow:
- View -> Service direct calls.
- ViewModel -> Service direct calls.
- Route -> Service direct calls.

## Compliance

- Run `npm run lint:arch`.
- Any violation blocks merge.
