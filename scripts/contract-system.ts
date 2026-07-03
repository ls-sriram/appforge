import path from "node:path";
import {
  buildTaskContract,
  generateAnalysisArtifacts,
  generateDriftRecord,
  loadContractSystem,
  writeAnalysisArtifacts,
  writeDriftRecord,
  writeTaskRun,
} from "../src/agent/contracts";

function main(): void {
  const [command, ...args] = process.argv.slice(2);
  const rootDir = process.cwd();
  const system = loadContractSystem(rootDir);

  switch (command) {
    case "validate": {
      console.log(
        `Validated ${system.modules.length} module contracts, ${system.features.length} feature contracts, and ${system.roles.length} role contracts.`,
      );
      return;
    }
    case "analyze": {
      const analysis = generateAnalysisArtifacts(system);
      writeAnalysisArtifacts(rootDir, analysis);
      console.log("Wrote .agent-cache analysis manifests.");
      return;
    }
    case "task": {
      const parsed = parseTaskArgs(args);
      const taskPath = path.posix.join(".agent", "runs", parsed.runId, "task.yaml");
      const taskContract = buildTaskContract(system, {
        objective: parsed.objective,
        changedFiles: parsed.changedFiles,
        taskPath,
      });
      const output = writeTaskRun(rootDir, parsed.runId, taskContract);
      console.log(`Wrote ${output.taskPath}, ${output.bundlePath}, and ${output.tracePath}.`);
      return;
    }
    case "drift": {
      const analysis = generateAnalysisArtifacts(system);
      const drift = generateDriftRecord(system, analysis);
      const dateStamp = new Date().toISOString().slice(0, 10);
      const output = writeDriftRecord(rootDir, `${dateStamp}.json`, drift);
      console.log(`Wrote ${output}.`);
      return;
    }
    default:
      throw new Error(
        'Usage: node --import tsx scripts/contract-system.ts <validate|analyze|task|drift> [options]',
      );
  }
}

function parseTaskArgs(args: string[]): {
  runId: string;
  objective: string;
  changedFiles: string[];
} {
  let runId = `run-${Date.now()}`;
  let objective = "";
  const changedFiles: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--run-id") {
      runId = args[index + 1] ?? runId;
      index += 1;
      continue;
    }
    if (arg === "--objective") {
      objective = args[index + 1] ?? objective;
      index += 1;
      continue;
    }
    changedFiles.push(arg);
  }

  if (!objective) {
    throw new Error('Missing required "--objective" argument.');
  }
  if (changedFiles.length === 0) {
    throw new Error("Provide at least one changed file path.");
  }

  return { runId, objective, changedFiles };
}

main();
