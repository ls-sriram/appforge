#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function resolveConfigDbPath(projectId) {
  const override = process.env.CONFIG_DB?.trim();
  if (override) {
    fs.mkdirSync(path.dirname(override), { recursive: true });
    return override;
  }

  const scopeId = (projectId || process.env.CONFIG_PROJECT_ID || process.env.APP_ID || "").trim();
  if (!scopeId) {
    const defaultPath = path.join(os.homedir(), ".config", "my-app", "infra.db");
    fs.mkdirSync(path.dirname(defaultPath), { recursive: true });
    return defaultPath;
  }

  const dbPath = path.join(os.homedir(), ".config", "my-app", scopeId, "infra.db");
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  return dbPath;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const projectId = process.argv[2];
  process.stdout.write(resolveConfigDbPath(projectId));
}
