#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";

import { DEFAULT_APP_ID, PROJECT_ROOT, getAppConfig } from "../app-registry.mjs";

const appId = process.env.APP_ID || process.argv[2] || DEFAULT_APP_ID;
const appConfig = getAppConfig(appId);
const rendererDir = path.join(PROJECT_ROOT, "dist-desktop", appId, "renderer");
const artifactsDir = path.join(PROJECT_ROOT, "dist-desktop", appId, "artifacts");

function run(command, args, extraEnv = {}) {
  const result = spawnSync(command, args, {
    cwd: PROJECT_ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      APP_ID: appId,
      DESKTOP_RENDERER_DIR: rendererDir,
      CSC_IDENTITY_AUTO_DISCOVERY: "false",
      ...extraEnv,
    },
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(process.execPath, [path.join(PROJECT_ROOT, "scripts", "desktop", "prepare-web-build.mjs"), appId]);

spawnSync("rm", ["-rf", artifactsDir], { stdio: "inherit" });

console.log(`[desktop] packaging unsigned dmg for ${appConfig.displayName} (${appId})`);

run("npx", [
  "electron-builder",
  "--mac",
  "dmg",
  "--config",
  path.join("desktop", "electron-builder.cjs"),
  "--publish",
  "never",
]);
