#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

import { PROJECT_ROOT } from "./app-registry.mjs";

const TARGETS = [
  ".expo",
  "dist-desktop",
  "android/build",
  "server/build",
  "server/.gradle",
];

let hadError = false;

for (const relativeTarget of TARGETS) {
  const absoluteTarget = path.join(PROJECT_ROOT, relativeTarget);
  if (!fs.existsSync(absoluteTarget)) {
    console.log(`[clean] skip ${relativeTarget}`);
    continue;
  }

  try {
    fs.rmSync(absoluteTarget, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 200,
    });
    console.log(`[clean] removed ${relativeTarget}`);
  } catch (error) {
    hadError = true;
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[clean] failed ${relativeTarget}: ${message}`);
  }
}

if (hadError) {
  process.exitCode = 1;
} else {
  console.log("[clean] done");
}
