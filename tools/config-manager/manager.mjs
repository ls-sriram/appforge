#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { resolveConfigDbPath } from './db-path.mjs';

const SCHEMA_PATH = path.join(path.dirname(new URL(import.meta.url).pathname), 'schema.sql');
const VALID_CATEGORIES = new Set(['secret', 'setting', 'metadata']);
const VALID_SCOPES = new Set(['frontend', 'backend']);
const DEFAULT_SEED_KEYS = [
  { key: 'EXPO_PUBLIC_ENV', category: 'setting', scope: 'frontend' },
  { key: 'EXPO_PUBLIC_API_BASE_URL', category: 'setting', scope: 'frontend' },
  { key: 'EXPO_PUBLIC_FIREBASE_API_KEY', category: 'setting', scope: 'frontend' },
  { key: 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', category: 'setting', scope: 'frontend' },
  { key: 'EXPO_PUBLIC_FIREBASE_PROJECT_ID', category: 'setting', scope: 'frontend' },
  { key: 'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET', category: 'setting', scope: 'frontend' },
  { key: 'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', category: 'setting', scope: 'frontend' },
  { key: 'EXPO_PUBLIC_FIREBASE_APP_ID', category: 'setting', scope: 'frontend' },
  { key: 'POSTGRES_CONTAINER_NAME', category: 'metadata', scope: 'backend' },
  { key: 'POSTGRES_DB', category: 'setting', scope: 'backend' },
  { key: 'POSTGRES_USER', category: 'setting', scope: 'backend' },
  { key: 'POSTGRES_PASSWORD', category: 'secret', scope: 'backend' },
  { key: 'BACKEND_CONTAINER_NAME', category: 'metadata', scope: 'backend' },
  { key: 'INTERNAL_SECRET', category: 'secret', scope: 'backend' },
  { key: 'UPLOAD_EVENT_SHARED_SECRET', category: 'secret', scope: 'backend' },
  { key: 'EARLY_ACCESS_ENABLED', category: 'setting', scope: 'backend' },
  { key: 'CORS_ALLOWED_ORIGINS', category: 'setting', scope: 'backend' },
  { key: 'TRIAL_DURATION_DAYS', category: 'setting', scope: 'backend' },
  { key: 'FIREBASE_PROJECT_ID', category: 'setting', scope: 'backend' },
  { key: 'FIREBASE_SERVICE_ACCOUNT_JSON', category: 'secret', scope: 'backend' },
  { key: 'FIREBASE_ENABLED', category: 'setting', scope: 'backend' },
  { key: 'UPLOADS_BUCKET', category: 'setting', scope: 'backend' },
  { key: 'UPLOAD_MAX_BYTES', category: 'setting', scope: 'backend' },
  { key: 'DODO_PAYMENTS_BASE_URL', category: 'setting', scope: 'backend' },
  { key: 'DODO_PAYMENTS_ENABLED', category: 'setting', scope: 'backend' },
  { key: 'DODO_PAYMENTS_API_KEY', category: 'secret', scope: 'backend' },
  { key: 'DODO_PAYMENTS_WEBHOOK_KEY', category: 'secret', scope: 'backend' },
  { key: 'DODO_PRODUCT_ID_PRO_MONTHLY', category: 'setting', scope: 'backend' },
  { key: 'DODO_PRODUCT_ID_PRO_ANNUAL', category: 'setting', scope: 'backend' },
  { key: 'OPENAI_ENABLED', category: 'setting', scope: 'backend' },
  { key: 'OPENAI_API_KEY', category: 'secret', scope: 'backend' },
  { key: 'EMAIL_ENABLED', category: 'setting', scope: 'backend' },
  { key: 'ZEPTOMAIL_SEND_MAIL_TOKEN', category: 'secret', scope: 'backend' },
  { key: 'ZEPTOMAIL_API_URL', category: 'setting', scope: 'backend' },
  { key: 'EMAIL_FROM_ADDRESS', category: 'setting', scope: 'backend' },
  { key: 'EMAIL_FROM_NAME', category: 'setting', scope: 'backend' },
  { key: 'EMAIL_API_KEY', category: 'secret', scope: 'backend' }
];

function usage() {
  console.error(`Usage:
  node tools/config-manager/manager.mjs init
  node tools/config-manager/manager.mjs reset
  node tools/config-manager/manager.mjs migrate-group
  node tools/config-manager/manager.mjs set <project_id> <environment> <scope> <group_category> <category> <key> <value>
  node tools/config-manager/manager.mjs get <project_id> <environment> <scope> <category> <key>
  node tools/config-manager/manager.mjs list <project_id> <environment> [scope] [category] [group_category]
  node tools/config-manager/manager.mjs delete <project_id> <environment> <scope> <category> <key>
  node tools/config-manager/manager.mjs seed <project_id> <environment>

Optional env:
  CONFIG_DB (sqlite database path)
`);
}

function requireCategory(category) {
  if (!VALID_CATEGORIES.has(category)) {
    throw new Error(`Invalid category: ${category}. Must be one of secret|setting|metadata`);
  }
}

function requireScope(scope) {
  if (!VALID_SCOPES.has(scope)) {
    throw new Error(`Invalid scope: ${scope}. Must be one of frontend|backend`);
  }
}

function withDb(projectId, fn) {
  const dbPath = resolveConfigDbPath(projectId);
  console.error(`[config-manager] sqlite db: ${dbPath}`);

  const db = new Database(dbPath);

  try {
    return fn(db);
  } finally {
    db.close();
  }
}

function relativeTimeFromNow(value) {
  const ms = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(ms)) return String(value ?? '');
  if (ms < 5000) return 'just now';

  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mon = Math.floor(day / 30);
  if (mon < 12) return `${mon}mo ago`;
  const yr = Math.floor(mon / 12);
  return `${yr}y ago`;
}

function inferGroupCategory(key) {
  if (key.startsWith('DODO_')) return 'dodo';
  if (key.startsWith('FIREBASE_')) return 'firebase';
  if (key.startsWith('EMAIL_') || key.startsWith('ZEPTOMAIL_')) return 'email';
  if (key.startsWith('OPENAI_')) return 'openai';
  if (key.startsWith('POSTGRES_')) return 'postgres';
  if (key.startsWith('UPLOAD')) return 'uploads';
  if (key.includes('CORS')) return 'cors';
  if (key.includes('SECRET')) return 'security';
  return 'general';
}

async function cmdInit() {
  const sql = fs.readFileSync(SCHEMA_PATH, 'utf8');
  withDb(process.env.CONFIG_PROJECT_ID || process.env.APP_ID, (db) => {
    db.exec(sql);
  });
  console.log('Config table initialized.');
}

async function cmdReset() {
  withDb(process.env.CONFIG_PROJECT_ID || process.env.APP_ID, (db) => {
    db.exec('DROP TABLE IF EXISTS config;');
    const sql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.exec(sql);
  });
  console.log('Config database reset complete.');
}

async function cmdMigrateGroup() {
  const updated = withDb(process.env.CONFIG_PROJECT_ID || process.env.APP_ID, (db) => {
    const columns = db.prepare(`PRAGMA table_info(config)`).all();
    const hasGroup = columns.some((col) => col.name === 'group_category');
    if (!hasGroup) {
      db.exec(`ALTER TABLE config ADD COLUMN group_category TEXT NOT NULL DEFAULT 'general'`);
    }
    const rows = db.prepare(`SELECT project_id, environment, scope, category, key FROM config`).all();
    const update = db.prepare(
      `UPDATE config
       SET group_category = ?
       WHERE project_id = ? AND environment = ? AND scope = ? AND category = ? AND key = ?`
    );
    let count = 0;
    for (const row of rows) {
      const nextGroup = inferGroupCategory(row.key);
      const result = update.run(
        nextGroup,
        row.project_id,
        row.environment,
        row.scope,
        row.category,
        row.key
      );
      count += result.changes || 0;
    }
    return count;
  });
  console.log(`Group migration complete. Updated ${updated} rows.`);
}

async function cmdSet([projectId, environment, scope, groupCategory, category, key, value]) {
  if (
    !projectId ||
    !environment ||
    !scope ||
    !groupCategory ||
    !category ||
    !key ||
    value === undefined
  ) {
    usage();
    process.exit(1);
  }
  requireScope(scope);
  requireCategory(category);

  withDb(projectId, (db) => {
    db.prepare(
      `INSERT INTO config (project_id, environment, scope, group_category, category, key, value)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (project_id, environment, scope, category, key)
       DO UPDATE SET group_category = excluded.group_category, value = excluded.value, updated_at = CURRENT_TIMESTAMP`
    ).run(projectId, environment, scope, groupCategory, category, key, value);
  });

  console.log('Saved config value.');
}

async function cmdGet([projectId, environment, scope, category, key]) {
  if (!projectId || !environment || !scope || !category || !key) {
    usage();
    process.exit(1);
  }
  requireScope(scope);
  requireCategory(category);

  const row = withDb(projectId, (db) => {
    return db.prepare(
      `SELECT value
       FROM config
       WHERE project_id = ? AND environment = ? AND scope = ? AND category = ? AND key = ?`
    ).get(projectId, environment, scope, category, key);
  });

  if (!row) {
    console.error('Not found');
    process.exit(2);
  }

  console.log(row.value);
}

async function cmdList([projectId, environment, scope, category, groupCategory]) {
  if (!projectId || !environment) {
    usage();
    process.exit(1);
  }
  if (scope) {
    requireScope(scope);
  }
  if (category) {
    requireCategory(category);
  }

  const rows = withDb(projectId, (db) => {
    if (scope && category && groupCategory) {
      return db.prepare(
        `SELECT scope, group_category, category, key, value, updated_at
         FROM config
         WHERE project_id = ? AND environment = ? AND scope = ? AND category = ? AND group_category = ?
         ORDER BY scope, group_category, category, key`
      ).all(projectId, environment, scope, category, groupCategory);
    }

    if (scope && category) {
      return db.prepare(
        `SELECT scope, group_category, category, key, value, updated_at
         FROM config
         WHERE project_id = ? AND environment = ? AND scope = ? AND category = ?
         ORDER BY scope, group_category, category, key`
      ).all(projectId, environment, scope, category);
    }

    if (scope) {
      return db.prepare(
        `SELECT scope, group_category, category, key, value, updated_at
         FROM config
         WHERE project_id = ? AND environment = ? AND scope = ?
         ORDER BY scope, group_category, category, key`
      ).all(projectId, environment, scope);
    }

    if (category) {
      return db.prepare(
        `SELECT scope, group_category, category, key, value, updated_at
         FROM config
         WHERE project_id = ? AND environment = ? AND category = ?
         ORDER BY scope, group_category, category, key`
      ).all(projectId, environment, category);
    }

    return db.prepare(
      `SELECT scope, group_category, category, key, value, updated_at
       FROM config
       WHERE project_id = ? AND environment = ?
       ORDER BY scope, group_category, category, key`
    ).all(projectId, environment);
  });

  const headers = ['scope', 'group', 'category', 'key', 'value', 'updated_at'];
  const data = rows.map((row) => [
    String(row.scope ?? ''),
    String(row.group_category ?? ''),
    String(row.category ?? ''),
    String(row.key ?? ''),
    String(row.value ?? ''),
    relativeTimeFromNow(row.updated_at)
  ]);
  const widths = headers.map((header, idx) =>
    Math.max(header.length, ...data.map((row) => row[idx].length))
  );
  const formatRow = (cols) => cols.map((c, i) => c.padEnd(widths[i])).join('  ');

  console.log(formatRow(headers));
  console.log(widths.map((w) => '-'.repeat(w)).join('  '));
  for (const row of data) {
    console.log(formatRow(row));
  }
}

async function cmdDelete([projectId, environment, scope, category, key]) {
  if (!projectId || !environment || !scope || !category || !key) {
    usage();
    process.exit(1);
  }
  requireScope(scope);
  requireCategory(category);

  const deleted = withDb(projectId, (db) => {
    const result = db.prepare(
      `DELETE FROM config
       WHERE project_id = ? AND environment = ? AND scope = ? AND category = ? AND key = ?`
    ).run(projectId, environment, scope, category, key);
    return result.changes;
  });

  if (!deleted) {
    console.error('Not found');
    process.exit(2);
  }

  console.log('Deleted config value.');
}

async function cmdSeed([projectId, environment]) {
  if (!projectId || !environment) {
    usage();
    process.exit(1);
  }

  const inserted = withDb(projectId, (db) => {
    let count = 0;
    for (const item of DEFAULT_SEED_KEYS) {
      const result = db.prepare(
        `INSERT INTO config (project_id, environment, scope, group_category, category, key, value)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (project_id, environment, scope, category, key) DO NOTHING`
      ).run(
        projectId,
        environment,
        item.scope,
        inferGroupCategory(item.key),
        item.category,
        item.key,
        ''
      );
      count += result.changes || 0;
    }
    return count;
  });

  console.log(`Project: ${projectId}`);
  console.log(`Environment: ${environment}`);
  console.log(`Project configuration initialized. Inserted ${inserted} keys.`);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command) {
    usage();
    process.exit(1);
  }

  switch (command) {
    case 'init':
      await cmdInit();
      break;
    case 'reset':
      await cmdReset();
      break;
    case 'migrate-group':
      await cmdMigrateGroup();
      break;
    case 'set':
      await cmdSet(args);
      break;
    case 'get':
      await cmdGet(args);
      break;
    case 'list':
      await cmdList(args);
      break;
    case 'delete':
      await cmdDelete(args);
      break;
    case 'seed':
      await cmdSeed(args);
      break;
    default:
      usage();
      process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
