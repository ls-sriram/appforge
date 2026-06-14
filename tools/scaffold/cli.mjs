#!/usr/bin/env node
import { initApp } from "./app-init.mjs";
import { scaffoldFeature } from "./feature.mjs";

function usage() {
  console.log(`Usage:
  node tools/scaffold/cli.mjs init --name <app-name> [--display-name "Display Name"] [--route-base /app-name] [--dry-run]
  node tools/scaffold/cli.mjs feature --app <app> --feature <feature> [--route <route>] [--param <paramName>] [--dry-run]`);
}

function parseOptions(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    if (key === "dry-run") {
      out.dryRun = true;
      continue;
    }
    out[key] = argv[i + 1] ?? "";
  }
  return out;
}

function printResult(result) {
  if ("appId" in result) {
    console.log(result.mode === "dry-run" ? "[dry-run] App scaffold preview" : "App scaffold created");
    console.log(`- appId: ${result.appId}`);
    console.log(`- displayName: ${result.displayName}`);
    console.log(`- routerRoot: ${result.routerRoot}`);
    console.log(`- routeBase: ${result.routeBase || "/"}`);
    console.log(`- manifest: ${result.manifest}`);
  } else {
    console.log(result.mode === "dry-run" ? "[dry-run] Feature scaffold preview" : "Feature scaffold created");
    console.log(`- app: ${result.app}`);
    console.log(`- feature: ${result.feature}`);
  }
  if (result.created.length > 0) {
    console.log("Created files:");
    for (const file of result.created) console.log(`- ${file}`);
  }
  if (result.skipped.length > 0) {
    console.log("Skipped existing files:");
    for (const file of result.skipped) console.log(`- ${file}`);
  }
}

function main() {
  const command = process.argv[2];
  if (!command || command === "--help" || command === "-h") {
    usage();
    process.exit(command ? 0 : 1);
  }

  const options = parseOptions(process.argv.slice(3));
  let result;
  switch (command) {
    case "init":
      result = initApp({
        name: options.name ?? "",
        displayName: options["display-name"] ?? "",
        routeBase: options["route-base"] ?? "",
        dryRun: options.dryRun === true,
      });
      break;
    case "feature":
      result = scaffoldFeature({
        app: options.app ?? "",
        feature: options.feature ?? "",
        route: options.route ?? "",
        param: options.param ?? "id",
        dryRun: options.dryRun === true,
      });
      break;
    default:
      throw new Error(`Unknown scaffold command '${command}'.`);
  }

  printResult(result);
}

main();
