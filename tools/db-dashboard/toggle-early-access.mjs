#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execFileSync } from "node:child_process";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const CONFIG_EXPORT_SCRIPT = path.join(PROJECT_ROOT, "tools", "config-manager", "export-env.mjs");

const CONFIG_DB = (process.env.CONFIG_DB ?? "").trim();
const INFERRED_APP_ID = CONFIG_DB ? path.basename(path.dirname(CONFIG_DB)) : "";
const APP_ID = (process.env.APP_ID ?? process.env.CONFIG_PROJECT_ID ?? INFERRED_APP_ID ?? "").trim();
const CONFIG_PROJECT_ID = (process.env.CONFIG_PROJECT_ID ?? APP_ID).trim();
const CONFIG_ENVIRONMENT = (process.env.CONFIG_ENVIRONMENT ?? "dev").trim();
const CONFIG_SCOPE = (process.env.CONFIG_SCOPE ?? "backend").trim();

const COMMAND_TIMEOUT_MS = Number(process.env.DB_DASHBOARD_TIMEOUT_MS ?? "15000");
const SQL_STATEMENT_TIMEOUT_MS = Number(process.env.DB_SQL_TIMEOUT_MS ?? "5000");

function runCommand(command, args) {
  try {
    return execFileSync(command, args, {
      encoding: "utf8",
      timeout: COMMAND_TIMEOUT_MS,
      maxBuffer: 1024 * 1024 * 8,
    });
  } catch (error) {
    if (error?.code === "ETIMEDOUT") {
      throw new Error(
        `Command timed out after ${COMMAND_TIMEOUT_MS}ms: ${command} ${args.join(" ")}. ` +
          `Docker or Postgres may be blocked/unresponsive.`,
      );
    }
    throw error;
  }
}

function loadConfigEnv() {
  if (!CONFIG_PROJECT_ID) {
    return {};
  }

  const output = runCommand("node", [
    CONFIG_EXPORT_SCRIPT,
    CONFIG_PROJECT_ID,
    CONFIG_ENVIRONMENT,
    CONFIG_SCOPE,
  ]);

  const env = {};
  for (const line of output.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("export ")) continue;
    const match = trimmed.match(/^export ([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const key = match[1];
    const value = match[2]
      .replace(/^'/, "")
      .replace(/'$/, "")
      .replace(/'"'"'/g, "'");
    env[key] = value;
  }
  return env;
}

const configEnv = loadConfigEnv();
const DB_CONTAINER =
  process.env.POSTGRES_CONTAINER_NAME ??
  process.env.DB_CONTAINER ??
  configEnv.POSTGRES_CONTAINER_NAME ??
  "appforge-postgres";
const DB_USER =
  process.env.POSTGRES_USER ??
  process.env.DB_USER ??
  configEnv.POSTGRES_USER ??
  "appforge";
const DB_NAME =
  process.env.POSTGRES_DB ??
  process.env.DB_NAME ??
  configEnv.POSTGRES_DB ??
  "appforge";
const DB_PASSWORD =
  process.env.POSTGRES_PASSWORD ??
  process.env.DB_PASSWORD ??
  configEnv.POSTGRES_PASSWORD ??
  "";

function assertContainerExists() {
  const out = runCommand("docker", ["ps", "--format", "{{.Names}}"]);
  const names = out
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean);
  if (!names.includes(DB_CONTAINER)) {
    throw new Error(
      `Early-access toggle container '${DB_CONTAINER}' is not running. ` +
        `Set POSTGRES_CONTAINER_NAME/DB_CONTAINER correctly or start the container.`,
    );
  }
}

function usageAndExit() {
  console.log(
    "Usage: APP_ID=<app> node tools/db-dashboard/toggle-early-access.mjs --email <email> --status <approved|waitlist>",
  );
  process.exit(1);
}

const args = process.argv.slice(2);
assertContainerExists();
const emailIndex = args.indexOf("--email");
const statusIndex = args.indexOf("--status");
if (emailIndex === -1 || statusIndex === -1) usageAndExit();

const email = (args[emailIndex + 1] ?? "").trim().toLowerCase();
const status = (args[statusIndex + 1] ?? "").trim().toLowerCase();
if (!email || !["approved", "waitlist"].includes(status)) usageAndExit();

const escapedEmail = email.replaceAll("'", "''");
const sql = `
SET statement_timeout = '${SQL_STATEMENT_TIMEOUT_MS}ms';
INSERT INTO early_access_entries (email, status, created_at, updated_at, approved_at)
VALUES (
  '${escapedEmail}',
  '${status}',
  NOW(),
  NOW(),
  CASE WHEN '${status}' = 'approved' THEN NOW() ELSE NULL END
)
ON CONFLICT (email) DO UPDATE
SET status = EXCLUDED.status,
  approved_at = CASE WHEN EXCLUDED.status = 'approved' THEN COALESCE(early_access_entries.approved_at, NOW()) ELSE NULL END,
  updated_at = NOW();
`;

const out = runCommand("docker", [
  "exec",
  "-i",
  "-e",
  `PGPASSWORD=${DB_PASSWORD}`,
  DB_CONTAINER,
  "psql",
  "-q",
  "-U",
  DB_USER,
  "-d",
  DB_NAME,
  "-h",
  "127.0.0.1",
  "-v",
  "ON_ERROR_STOP=1",
  "-c",
  sql,
]);

console.log(out.trim());
console.log(`early_access_entries: ${email} -> ${status}`);
