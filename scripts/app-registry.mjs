#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, "..");
const MANIFEST_PATH = path.join(PROJECT_ROOT, "config", "app-manifest.json");

const APP_MANIFEST = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
const SUPPORTED_APP_IDS = Object.keys(APP_MANIFEST.apps);
const DEFAULT_APP_ID = APP_MANIFEST.defaultAppId;

if (!SUPPORTED_APP_IDS.includes(DEFAULT_APP_ID)) {
  throw new Error(`Default app id '${DEFAULT_APP_ID}' is not present in ${MANIFEST_PATH}.`);
}

export { APP_MANIFEST, DEFAULT_APP_ID, MANIFEST_PATH, PROJECT_ROOT, SUPPORTED_APP_IDS };

export function getAppConfig(appId) {
  const config = APP_MANIFEST.apps[appId];
  if (!config) {
    throw new Error(
      `Unsupported APP_ID '${appId}'. Supported: ${SUPPORTED_APP_IDS.join(", ")}.`,
    );
  }
  return config;
}

if (process.argv[1] === __filename) {
  const flag = process.argv[2];
  switch (flag) {
    case "--default-app-id":
      process.stdout.write(DEFAULT_APP_ID);
      break;
    case "--supported-app-ids":
      process.stdout.write(SUPPORTED_APP_IDS.join(","));
      break;
    case "--seed-config": {
      const appId = process.argv[3];
      if (!appId) {
        throw new Error("--seed-config requires an app id.");
      }
      const config = getAppConfig(appId);
      process.stdout.write(JSON.stringify(config.localDev?.seed ?? null));
      break;
    }
    case "--server-root": {
      const appId = process.argv[3];
      if (!appId) {
        throw new Error("--server-root requires an app id.");
      }
      const config = getAppConfig(appId);
      const serverRoot = config.localDev?.serverRoot;
      if (!serverRoot) {
        throw new Error(`No localDev.serverRoot configured for '${appId}' in app-manifest.json.`);
      }
      process.stdout.write(path.resolve(PROJECT_ROOT, serverRoot));
      break;
    }
    default:
      if (flag) {
        throw new Error(`Unknown flag '${flag}'.`);
      }
      process.stdout.write(JSON.stringify(APP_MANIFEST, null, 2));
      break;
  }
}
