#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { DEFAULT_APP_ID, PROJECT_ROOT, getAppConfig } from "../app-registry.mjs";
import { resolveConfigDbPath } from "../../tools/config-manager/db-path.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appId = process.env.APP_ID || process.argv[2] || DEFAULT_APP_ID;
const appConfig = getAppConfig(appId);
const configProjectId = process.env.CONFIG_PROJECT_ID || appId;
const configEnvironment = process.env.CONFIG_ENVIRONMENT || "dev";
const outputDir = path.join(PROJECT_ROOT, "dist-desktop", appId, "renderer");
const generatedBuildConfigPath = path.join(PROJECT_ROOT, "src", "generated", "build-app-config.ts");
const originalBuildConfig = fs.existsSync(generatedBuildConfigPath)
  ? fs.readFileSync(generatedBuildConfigPath, "utf8")
  : null;

fs.mkdirSync(outputDir, { recursive: true });

function parseExportedEnv(stdout) {
  const env = {};
  for (const line of stdout.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("export ")) continue;

    const assignment = trimmed.slice("export ".length);
    const separatorIndex = assignment.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = assignment.slice(0, separatorIndex);
    const rawValue = assignment.slice(separatorIndex + 1);
    env[key] = rawValue.startsWith("'") && rawValue.endsWith("'")
      ? rawValue
          .slice(1, -1)
          .replace(/'"'"'/g, "'")
      : rawValue;
  }
  return env;
}

function loadFrontendRuntimeEnv() {
  const configDb = resolveConfigDbPath(configProjectId);
  const exportEnvScript = path.join(PROJECT_ROOT, "tools", "config-manager", "export-env.mjs");

  if (!fs.existsSync(configDb) || !fs.existsSync(exportEnvScript)) {
    console.log("[desktop] config DB/export script not found; using process env defaults.");
    return {};
  }

  console.log(
    `[desktop] loading frontend env from config table ` +
      `(project=${configProjectId} env=${configEnvironment} scope=frontend)`,
  );

  const result = spawnSync(
    process.execPath,
    [exportEnvScript, configProjectId, configEnvironment, "frontend"],
    {
      cwd: PROJECT_ROOT,
      encoding: "utf8",
      env: {
        ...process.env,
        CONFIG_DB: configDb,
      },
    },
  );

  if (result.status !== 0) {
    process.stderr.write(result.stderr ?? "");
    process.exit(result.status ?? 1);
  }

  return {
    EXPO_PUBLIC_API_BASE_URL: "/api",
    APP_PUBLIC_URL: "http://localhost:3000",
    ...parseExportedEnv(result.stdout ?? ""),
  };
}

function run(command, args, extraEnv = {}) {
  const result = spawnSync(command, args, {
    cwd: PROJECT_ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      APP_ID: appId,
      EXPO_ROUTER_APP_ROOT: appConfig.routerRoot,
      ...extraEnv,
    },
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

try {
  const frontendRuntimeEnv = loadFrontendRuntimeEnv();
  run(process.execPath, [path.join(PROJECT_ROOT, "scripts", "select-app-root.mjs"), appId]);
  run("npx", ["expo", "export", "--platform", "web", "--output-dir", outputDir], frontendRuntimeEnv);
} finally {
  if (originalBuildConfig === null) {
    fs.rmSync(generatedBuildConfigPath, { force: true });
  } else {
    fs.writeFileSync(generatedBuildConfigPath, originalBuildConfig);
  }
}

const indexPath = path.join(outputDir, "index.html");
if (!fs.existsSync(indexPath)) {
  throw new Error(`Expected exported index at ${indexPath}.`);
}

console.log(`[desktop] exported ${appId} web bundle to ${path.relative(PROJECT_ROOT, outputDir)}`);
