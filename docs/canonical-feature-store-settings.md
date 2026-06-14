# Canonical Example: Feature Store (Settings)

Use `settings` as the reference implementation for in-memory feature state.

## Why this pattern

- Keeps state close to feature.
- Avoids global mega-store.
- Supports multi-screen flows (`/settings` + `/settings/profile`).
- Preserves strict MVVM boundaries.

## File Layout

- `src/features/settings/state/store.ts`
  - Single in-memory owner for settings feature state.
  - Exposes `useSettingsStore`, `settingsStoreSetState`.
- `src/features/settings/settings.hook.ts` or equivalent feature hook entry
  - Loads identity via usecase and updates feature store.
- `src/features/settings/profile-edit.hook.ts` or equivalent screen hook entry
  - Reads/writes profile draft name through feature store.
- `src/features/settings/usecases/*`
  - Business actions + repository orchestration.

## State Contract

`SettingsStoreState`
- `loading`
- `identity`
- `profileDraftName`

Owner: settings feature store only.

## Screen Interaction

1. View emits intent (`onChangeText`, `onPress`).
2. ViewModel handles intent.
3. ViewModel updates store (`settingsStoreSetState`) or calls usecase.
4. Views re-render from `useSettingsStore` snapshots.

## Rules to Copy For New Features

1. One store per feature only when 2+ screens share workflow state.
2. No service imports in views or route files.
3. ViewModels call usecases; do not call services directly.
4. Store holds session-level mutable UI/domain draft state only.
5. Persisted truth stays in backend/repository layer.
