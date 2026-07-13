# AppForge

AppForge is a scaffold-first workspace for shipping one app across web, mobile, desktop, and a co-located backend from a single codebase.

## Native serverless billing

Paid serverless Expo apps use the exported `ExpoIapAppleImplementation` and
`ExpoIapGooglePlayImplementation` adapters with `ServerlessEntitlementProvider`.
Install the optional `expo-iap` peer in the consuming app. StoreKit and Google
Play Billing require a development or store build and are unavailable in Expo
Go. Product identifiers must exist in App Store Connect and Play Console before
lookup or purchase can succeed.

## Native billing with AppForge Server

Apps with an AppForge backend use `BackendNativeEntitlementProvider` instead of
the serverless provider, normally nested with the existing `EntitlementProvider`.
The native store still presents the purchase UI, but the provider sends the
App Store transaction ID or Google Play purchase token to
`POST /api/v1/billing/native/confirm`. Paid features are exposed only after the
server verifies the purchase and returns its authoritative entitlement.

Platform-specific SKUs can declare `canonicalProductId` to map back to the
server billing catalog:

```ts
const products = [{
  id: "pro_monthly_ios",
  canonicalProductId: "pro_monthly",
  platform: "ios",
  kind: "subscription",
  planKind: "subscription",
  subscriptionPeriod: { unit: "month", count: 1 },
}] satisfies NativeStoreProduct[];
```

## Purpose

This public repo is centered on the `example-app` reference implementation and the tooling around it:

- shared Expo frontend platform code
- shared UI primitives, blocks, and layouts
- backend runtime and config flow
- scaffolding to create new apps and features from the same structure
- optional Electron packaging for desktop distribution

## What Is Included

- `app-example-app/`: Expo Router entry root for the example app
- `src/apps/example-app/`: example-app specific screens and navigation
- `src/ui/`: shared UI primitives, panels, blocks, and layouts
- `src/features/`: shared feature modules used across app variants
- `server/`: backend service code and local runtime scripts
- `tools/scaffold/`: app and feature scaffold tooling
- `tools/config-manager/`: local config and secret management for dev

## Quick Start

```bash
npm install
APP_ID=example-app npm run local:init
APP_ID=example-app npm run config:firebase:set -- --json /path/to/service-account.json
npm run local:start
```

For frontend-only work:

```bash
npm run web
```

## Config And Secrets

Local runtime values are intentionally not committed.

Use:

- `.env.template`
- `server/.env.template`
- `npm run local:init`
- `npm run config:*`

Firebase, database credentials, and other secrets should be set locally through config-manager or environment variables, never committed into the repo.

For backend Firebase, point AppForge at a service account JSON file and let config-manager store the secret locally:

```bash
APP_ID=example-app npm run config:firebase:set -- --json /path/to/service-account.json
```

`local:init` only creates an empty `FIREBASE_SERVICE_ACCOUNT_JSON` placeholder unless you pass `-- --firebase-json /path/to/service-account.json`.

## Scaffold Tooling

Create a new app:

```bash
npm run scaffold:init -- --name my-new-app
```

Create a new feature inside an app:

```bash
npm run scaffold:feature -- --app example-app --feature notifications
```

## Desktop Packaging

Build an unsigned macOS DMG from the selected app:

```bash
npm run desktop:clean
npm run desktop:build:web
npm run desktop:dmg
```

## Quality Checks

```bash
npm run typecheck
npm run lint:arch
```

## Package Publishing

The published `@appforge/platform` package is intentionally limited to its documented public barrels and the transitive source they require. Internal app code, unrelated features, test files, smoke fixtures, and repo-only docs are excluded from the npm tarball.

## License

MIT. See `LICENSE`.
