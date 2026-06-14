/**
 * generate-api.ts
 *
 * Pulls the OpenAPI spec from the in-repo backend and generates
 * type-safe TypeScript definitions for the frontend.
 *
 * Usage:
 *   npx tsx scripts/generate-api.ts            # one-shot generate
 *   npx tsx scripts/generate-api.ts --watch     # watch for changes
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");
const BACKEND_DIR = path.resolve(ROOT, "server");
const SPEC_SRC = path.join(BACKEND_DIR, "openapi.yaml");
const SPEC_DST = path.join(ROOT, ".openapi", "openapi.yaml");
const OUTPUT = path.join(ROOT, "src", "types", "api.d.ts");

function ensureDirs() {
  fs.mkdirSync(path.dirname(SPEC_DST), { recursive: true });
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
}

function copySpec() {
  if (!fs.existsSync(SPEC_SRC)) {
    console.error(`✗ openapi.yaml not found at ${SPEC_SRC}`);
    console.error("  Make sure the in-repo backend has server/openapi.yaml.");
    process.exit(1);
  }
  fs.copyFileSync(SPEC_SRC, SPEC_DST);
  console.log(`✓ Copied openapi.yaml from backend`);
}

function generateTypes() {
  try {
    execSync(
      `npx openapi-typescript "${SPEC_DST}" --output "${OUTPUT}"`,
      { stdio: "inherit", cwd: ROOT },
    );
    console.log(`✓ Generated types → ${path.relative(ROOT, OUTPUT)}`);
  } catch {
    console.error("✗ Type generation failed. Check that openapi.yaml is valid.");
    process.exit(1);
  }
}

function watch() {
  console.log(`👀 Watching ${path.relative(ROOT, SPEC_SRC)} for changes…`);
  const { watch } = require("chokidar");
  const watcher = watch(SPEC_SRC, { ignoreInitial: true });
  watcher.on("change", () => {
    console.log(`\n📄 openapi.yaml changed — regenerating…`);
    copySpec();
    generateTypes();
    console.log(`✓ Done. Types updated at ${new Date().toLocaleTimeString()}\n`);
  });
}

// ─── Main ──────────────────────────────────────────────────────

ensureDirs();
copySpec();
generateTypes();

if (process.argv.includes("--watch")) {
  watch();
} else {
  console.log("✓ API types generated. Run with --watch to auto-regenerate on changes.");
}
