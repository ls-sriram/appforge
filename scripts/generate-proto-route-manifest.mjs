#!/usr/bin/env node
/**
 * Placeholder route-manifest generator.
 *
 * Future step: parse protobuf descriptors and extract google.api.http
 * annotations automatically. For now, this validates the manifest file exists
 * so app code can consume a single annotation-driven route map.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const manifestPath = path.join(root, "src", "generated", "proto", "route-manifest.json");

if (!fs.existsSync(manifestPath)) {
  console.error(`Missing route manifest: ${manifestPath}`);
  process.exit(1);
}

JSON.parse(fs.readFileSync(manifestPath, "utf8"));
console.log(`✓ route manifest ready: ${path.relative(root, manifestPath)}`);
