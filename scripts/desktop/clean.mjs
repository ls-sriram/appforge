#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

import { PROJECT_ROOT } from "../app-registry.mjs";

const distDesktopDir = path.join(PROJECT_ROOT, "dist-desktop");

fs.rmSync(distDesktopDir, { recursive: true, force: true });

console.log("[desktop] cleared dist-desktop");
