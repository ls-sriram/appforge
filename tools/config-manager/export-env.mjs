#!/usr/bin/env node

import path from 'node:path';
import Database from 'better-sqlite3';
import { resolveConfigDbPath } from './db-path.mjs';

function usage() {
  console.error(`Usage:
  node tools/config-manager/export-env.mjs <project_id> <environment> [scope]

Optional env:
  CONFIG_DB (sqlite database path)
`);
}

function shellSingleQuote(value) {
  return `'${String(value).replace(/'/g, `'\"'\"'`)}'`;
}

function main() {
  const [projectId, environment, scope = 'backend'] = process.argv.slice(2);
  if (!projectId || !environment) {
    usage();
    process.exit(1);
  }

  const dbPath = resolveConfigDbPath(projectId);

  const db = new Database(dbPath, { readonly: true });
  try {
    const rows = db
      .prepare(
        `SELECT key, value
         FROM config
         WHERE project_id = ?
           AND environment = ?
           AND scope = ?
           AND value IS NOT NULL
           AND value <> ''
         ORDER BY key`
      )
      .all(projectId, environment, scope);

    for (const row of rows) {
      console.log(`export ${row.key}=${shellSingleQuote(row.value)}`);
    }
  } finally {
    db.close();
  }
}

main();
