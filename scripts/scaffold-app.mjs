#!/usr/bin/env node
process.argv.splice(2, 0, "init");
await import("../tools/scaffold/cli.mjs");
