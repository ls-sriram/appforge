#!/usr/bin/env node
process.argv.splice(2, 0, "feature");
await import("../tools/scaffold/cli.mjs");
