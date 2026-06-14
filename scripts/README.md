# Scripts

## Local Run

- `npm run local:init`
  - Requires `APP_ID`.
  - Initializes the local config-manager database, seeds missing app config rows, and writes the app-selection artifacts used by the run scripts.
  - Frontend Firebase values live in the app-scoped SQLite config DB and are exported by the frontend launch scripts.
  - If you pass `-- --firebase-json /path/to/service-account.json`, backend Firebase config is updated in config-manager and enabled.
  - The default init flow only creates an empty `FIREBASE_SERVICE_ACCOUNT_JSON` placeholder row. It does not store a real secret unless you explicitly point at a JSON file.

```bash
APP_ID=example-app npm run local:init
APP_ID=example-app npm run local:init -- --firebase-json /path/to/service-account.json
```

- `npm run config:firebase:set -- --json /path/to/service-account.json`
  - Rerunnable backend Firebase update command.
  - Updates `FIREBASE_PROJECT_ID`, `FIREBASE_SERVICE_ACCOUNT_JSON`, and `FIREBASE_ENABLED=true` in config-manager.

```bash
APP_ID=example-app npm run config:firebase:set -- --json /path/to/service-account.json
```

- `npm run local:frontend`
  - Starts Expo using runtime env/config defaults.
- `npm run local:backend`
  - Uses the in-repo backend and runs the local SQL backend.
- `npm run local:start`
  - Starts backend in background and frontend in foreground.
- `npm run local:stop`
  - Stops background backend started by `local:start`.
- `npm run local:verify`
  - Verifies required backend config keys and backend integrations.

## Feature Scaffold

```bash
node tools/scaffold/cli.mjs feature --app example-app --feature profile-card
```

## App Scaffold

```bash
node tools/scaffold/cli.mjs init --name another-app
```
