#!/usr/bin/env node
import { listKnownContracts, listLayerDirectoryContracts, resolveEffectiveContractChain } from "./contracts.mjs";
import { ROOT, loadContractSystem } from "./system.mjs";

function usage() {
  console.log(`Usage:
  node tools/cli.mjs resolve --file src/features/home/home.screen.tsx
  node tools/cli.mjs list layers
  node tools/cli.mjs list contracts
  node tools/cli.mjs validate

Options:
  resolve
    --file <path>     Repository-relative or absolute file path to inspect.
`);
}

function parseOptions(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    out[arg.slice(2)] = argv[i + 1] ?? "";
  }
  return out;
}

function printResolveResult(result) {
  console.log(`File: ${result.file.relativePath}`);
  console.log(`Detected type: ${result.file.fileType ?? "(none)"}`);
  if (result.file.expectedLayer && result.file.expectedLayer !== result.file.fileType) {
    console.log(`Expected layer: ${result.file.expectedLayer}`);
  }
  if (result.file.namingViolation) {
    console.log(`Naming violation: ${result.file.namingViolation}`);
  }
  console.log("Contracts:");
  if (result.chain.length === 0) {
    console.log("  (none)");
    return;
  }
  for (const entry of result.chain) console.log(`  - [${entry.kind}] ${entry.relativePath}`);
}

function printLayerList() {
  console.log("Layers:");
  for (const layer of listLayerDirectoryContracts()) {
    console.log(`  - ${layer.layerId}: ${layer.relativePath}`);
  }
}

function printContractList() {
  console.log("Contracts:");
  for (const entry of listKnownContracts()) {
    console.log(`  - [${entry.kind}] ${entry.relativePath}`);
  }
}

function printValidateResult() {
  const system = loadContractSystem(ROOT);
  console.log(
    `Validated ${system.modules.length} module contracts, ${system.features.length} feature contracts, and ${Object.keys(system.layers.layers ?? {}).length} repository layers.`,
  );
}

function main() {
  const verb = process.argv[2];
  if (!verb || verb === "--help" || verb === "-h") {
    usage();
    process.exit(verb ? 0 : 1);
  }

  switch (verb) {
    case "resolve": {
      const options = parseOptions(process.argv.slice(3));
      const file = options.file ?? process.argv[3] ?? "";
      if (!file) {
        throw new Error('resolve requires "--file <path>" or a positional file path.');
      }
      printResolveResult(resolveEffectiveContractChain(file));
      return;
    }
    case "list": {
      const target = process.argv[3];
      if (target === "layers") {
        printLayerList();
        return;
      }
      if (target === "contracts") {
        printContractList();
        return;
      }
      throw new Error(`Unknown list target '${target}'.`);
    }
    case "validate":
      printValidateResult();
      return;
    default:
      throw new Error(`Unknown contract verb '${verb}'.`);
  }
}

main();
