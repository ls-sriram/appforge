# Config Manager (SQLite)

A small CLI tool for managing deploy configuration in SQLite.

## Schema

`tools/config-manager/schema.sql`

Core table:
- `project_id`
- `environment`
- `scope` (`frontend | backend`)
- `group_category` (examples: `postgres`, `dodo`, `firebase`, `email`, `openai`, `security`)
- `category` (`secret | setting | metadata`)
- `key`
- `value`
- `updated_at`

Primary key:
- `(project_id, environment, scope, category, key)`

## Requirements

- Optional `CONFIG_DB` environment variable for a custom SQLite file path.
- Default local DB path is app-scoped under `~/.config/my-app/<project_id>/infra.db`.

## Usage

Initialize table:

```bash
npm run config:init
```

Force reset database schema:

```bash
npm run config:reset
```

Backfill `group_category` for existing rows:

```bash
npm run config:migrate:group
```

Set a value:

```bash
npm run config:set -- <project_id> <environment> <scope> <group_category> <category> <key> <value>
```

Get a value:

```bash
npm run config:get -- <project_id> <environment> <scope> <category> <key>
```

List all values for an environment:

```bash
npm run config:list -- <project_id> <environment>
```

List by scope:

```bash
npm run config:list -- <project_id> <environment> <scope>
```

List by scope and category:

```bash
npm run config:list -- <project_id> <environment> <scope> <category>
```

List by scope, category, and group:

```bash
npm run config:list -- <project_id> <environment> <scope> <category> <group_category>
```

Delete a value:

```bash
npm run config:delete -- <project_id> <environment> <scope> <category> <key>
```

Seed baseline config keys once (empty values, no overwrite):

```bash
npm run config:seed -- <project_id> <environment>
```
