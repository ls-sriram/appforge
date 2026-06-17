/**
 * ─────────────────────────────────────────────────────────────────
 * GENERATE REPO SCAN — codegen for the AppForge Studio visualizer.
 *
 * Runs the static repo scanner and writes a typed JSON snapshot that the
 * studio feature consumes through its MVVM chain (service → repository →
 * viewmodel → view). The frontend never touches the filesystem; this dev
 * script is the only thing that does.
 *
 * Usage: npm run studio:scan
 * ─────────────────────────────────────────────────────────────────
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanAll } from "../tools/code-visualizer/scan.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(
  ROOT,
  "src/apps/appforge-site/features/studio/services/repo-scan.generated.json",
);

const scan = scanAll();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(scan, null, 2) + "\n");

const rel = path.relative(ROOT, OUT);
console.log(`[studio:scan] wrote ${rel}`);
console.log(
  `[studio:scan] ${scan.architecture.uiCompositionLayers.length} UI layers, ` +
    `${scan.architecture.mvvmLayers.length} MVVM layers, ` +
    `${scan.architecture.featureLayerMatrix.length} features, ` +
    `${scan.architecture.violations.length} violations`,
);
