# Scaffold Tooling

Use one entrypoint for app initialization and feature scaffolding.

## Init A New App

```bash
node tools/scaffold/cli.mjs init --name example-member-app
```

Optional flags:

- `--display-name "Example Member App"`
- `--route-base /workspace`
- `--dry-run`

## Add A Feature

```bash
node tools/scaffold/cli.mjs feature --app example-app --feature notifications
node tools/scaffold/cli.mjs feature --app example-app --feature sessions --route sessions --param sessionId
```
