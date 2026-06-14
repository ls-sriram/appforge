# Standalone DB Dashboard (Local, External)

This utility reads local Postgres through Docker and generates a static HTML report.

## Prerequisites

- Docker running
- Local DB container available (default: `appforge-postgres`)

## Generate Static Dashboard

```bash
node tools/db-dashboard/generate-report.mjs
# or
npm run db:dashboard
```

Output:

- `tools/db-dashboard/out/dashboard.html`

## Flip Early Access

Approve:

```bash
APP_ID=example-app \
node tools/db-dashboard/toggle-early-access.mjs --email you@example.com --status approved
```

Move back to waitlist:

```bash
APP_ID=example-app \
node tools/db-dashboard/toggle-early-access.mjs --email you@example.com --status waitlist
```

## Optional overrides

```bash
APP_ID=example-app \
CONFIG_DB=/Users/you/.config/my-app/example-app/infra.db \
node tools/db-dashboard/toggle-early-access.mjs --email you@example.com --status approved
```
