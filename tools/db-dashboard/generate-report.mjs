#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const DB_CONTAINER = process.env.POSTGRES_CONTAINER_NAME ?? process.env.DB_CONTAINER ?? "appforge-postgres";
const DB_USER = process.env.DB_USER ?? "appforge";
const DB_NAME = process.env.DB_NAME ?? "appforge";
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

function assertContainerExists() {
  const out = runCommand("docker", ["ps", "--format", "{{.Names}}"]);
  const names = out
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean);
  if (!names.includes(DB_CONTAINER)) {
    throw new Error(
      `DB dashboard container '${DB_CONTAINER}' is not running. ` +
        `Set POSTGRES_CONTAINER_NAME/DB_CONTAINER correctly or start the container.`,
    );
  }
}

function runSqlRows(sql) {
  const trimmedSql = sql.trim();
  const wrappedSql = `SET statement_timeout = '${SQL_STATEMENT_TIMEOUT_MS}ms'; ${trimmedSql}`;
  const args = [
    "exec",
    "-i",
    DB_CONTAINER,
    "psql",
    "-q",
    "-U",
    DB_USER,
    "-d",
    DB_NAME,
    "-At",
    "-F",
    "\t",
    "-v",
    "ON_ERROR_STOP=1",
    "-c",
    wrappedSql,
  ];
  const out = runCommand("docker", args).trim();
  if (!out) return [];
  return out
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line !== "SET")
    .map((line) => line.split("\t"));
}

function runScalar(sql) {
  const rows = runSqlRows(sql);
  return rows[0]?.[0] ?? "0";
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const generatedAt = new Date().toISOString();
assertContainerExists();

const metrics = [
  ["App Users", runScalar("SELECT COUNT(*) FROM app_users;")],
  ["Profiles", runScalar("SELECT COUNT(*) FROM profiles;")],
  ["Entities", runScalar("SELECT COUNT(*) FROM entities;")],
  ["Billing Entitlements", runScalar("SELECT COUNT(*) FROM billing_entitlements;")],
  ["Upload Records", runScalar("SELECT COUNT(*) FROM upload_records;")],
  ["Onboarding State Rows", runScalar("SELECT COUNT(*) FROM onboarding_state;")],
  ["Onboarding Responses", runScalar("SELECT COUNT(*) FROM onboarding_responses;")],
  [
    "Early Access Total",
    runScalar(`
      SELECT COUNT(*)
      FROM early_access_entries;
    `),
  ],
  [
    "Early Access Approved",
    runScalar(`
      SELECT COUNT(*)
      FROM early_access_entries
      WHERE status = 'approved';
    `),
  ],
  [
    "Early Access Waitlist",
    runScalar(`
      SELECT COUNT(*)
      FROM early_access_entries
      WHERE status = 'waitlist';
    `),
  ],
];

const earlyAccessRows = runSqlRows(`
  SELECT
    email,
    status,
    COALESCE(to_char(approved_at, 'YYYY-MM-DD HH24:MI:SS'), '') AS approved_at,
    COALESCE(to_char(updated_at, 'YYYY-MM-DD HH24:MI:SS'), '')
  FROM early_access_entries
  ORDER BY updated_at DESC NULLS LAST
  LIMIT 200;
`);

const onboardingRows = runSqlRows(`
  SELECT user_id, current_step::text, completed::text, COALESCE(to_char(updated_at, 'YYYY-MM-DD HH24:MI:SS'), '')
  FROM onboarding_state
  ORDER BY updated_at DESC
  LIMIT 200;
`);

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DB Dashboard</title>
  <style>
    :root { --bg:#0b1020; --panel:#121a2b; --text:#e5ebf7; --muted:#9fb0cc; --line:#2a3958; --ok:#2fb171; --warn:#e2a93b; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background: var(--bg); color: var(--text); }
    .wrap { max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { margin: 0 0 6px; font-size: 28px; }
    .muted { color: var(--muted); font-size: 13px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 12px; margin-top: 16px; }
    .card { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 14px; }
    .label { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .06em; }
    .value { margin-top: 6px; font-size: 28px; font-weight: 700; }
    .section { margin-top: 24px; }
    table { width: 100%; border-collapse: collapse; background: var(--panel); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--line); font-size: 13px; }
    th { color: var(--muted); font-weight: 600; background: #10182a; position: sticky; top: 0; }
    tr:last-child td { border-bottom: 0; }
    .status-approved { color: var(--ok); font-weight: 600; }
    .status-waitlist { color: var(--warn); font-weight: 600; }
    .hint { margin-top: 18px; font-size: 13px; color: var(--muted); }
    code { color: #cde0ff; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Local DB Dashboard</h1>
    <div class="muted">Generated at ${esc(generatedAt)} from container <code>${esc(DB_CONTAINER)}</code>.</div>

    <div class="grid">
      ${metrics.map(([k, v]) => `<div class="card"><div class="label">${esc(k)}</div><div class="value">${esc(v)}</div></div>`).join("")}
    </div>

    <div class="section">
      <h2>Early Access Entries</h2>
      <table>
        <thead><tr><th>Email</th><th>Status</th><th>Approved At</th><th>Updated At</th></tr></thead>
        <tbody>
          ${earlyAccessRows.map(([email, status, approvedAt, updatedAt]) => {
            const cls = status === "approved" ? "status-approved" : "status-waitlist";
            return `<tr><td>${esc(email)}</td><td class="${cls}">${esc(status)}</td><td>${esc(approvedAt)}</td><td>${esc(updatedAt)}</td></tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Onboarding Progress (Latest)</h2>
      <table>
        <thead><tr><th>User ID</th><th>Step</th><th>Completed</th><th>Updated At</th></tr></thead>
        <tbody>
          ${onboardingRows.map(([userId, step, completed, updatedAt]) => `<tr><td>${esc(userId)}</td><td>${esc(step)}</td><td>${esc(completed)}</td><td>${esc(updatedAt)}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>

    <div class="hint">
      Flip early access from CLI:
      <code>node tools/db-dashboard/toggle-early-access.mjs --email ls_ram@hotmail.com --status approved</code>
    </div>
  </div>
</body>
</html>`;

const outDir = path.resolve("tools/db-dashboard/out");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "dashboard.html");
fs.writeFileSync(outFile, html, "utf8");
console.log(outFile);
