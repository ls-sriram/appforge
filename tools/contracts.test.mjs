import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.chdir(path.resolve(__dirname, ".."));

const {
  getFileContractMeta,
  listKnownContracts,
  listLayerDirectoryContracts,
  resolveEffectiveContractChain,
} = await import("./contracts.mjs");
const { classifyFileByConvention, loadContractSystem } = await import("./system.mjs");

function writeFile(file, content = "") {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

const fixtureRoot = path.join(process.cwd(), "src", "features", "contracts-fixture");
const fixtureContractPath = path.join(fixtureRoot, ".contract.yaml");
const fixtureFeatureContractPath = path.join(process.cwd(), ".architecture", "features", "contracts_fixture.contract.yaml");
const routeFixtureDir = path.join(process.cwd(), "app", "contracts-fixture");
const routePath = path.join(routeFixtureDir, "index.tsx");
const rootGuidanceChain = fs.existsSync(path.join(process.cwd(), "AGENTS.md")) ? ["AGENTS.md"] : [];

fs.rmSync(fixtureRoot, { recursive: true, force: true });
fs.rmSync(routeFixtureDir, { recursive: true, force: true });
fs.rmSync(fixtureFeatureContractPath, { force: true });

try {
  const domainModelPath = path.join(fixtureRoot, "domain", "model.ts");
  const domainRepositoryPath = path.join(fixtureRoot, "domain", "repository.ts");
  const usecasePath = path.join(fixtureRoot, "usecases", "load-fixture.ts");
  const viewmodelStorePath = path.join(fixtureRoot, "viewmodel", "store.ts");
  const viewmodelHookPath = path.join(fixtureRoot, "viewmodel", "use-fixture.ts");
  const featureViewPath = path.join(fixtureRoot, "ui", "views", "ContractsFixtureView.tsx");
  const featureBlockPath = path.join(fixtureRoot, "ui", "blocks", "ContractsFixtureBlock.tsx");
  const invalidViewmodelPath = path.join(fixtureRoot, "viewmodel", "session.ts");
  const unknownPath = path.join(fixtureRoot, "misc", "notes.ts");
  const featureGuidePath = path.join(fixtureRoot, "CLAUDE.md");

  writeFile(fixtureContractPath, `schema: v1
module: contracts_fixture
layer: feature
owner: fixtures
public_api:
  - loadFixture
invariants:
  - fixture_contracts_are_resolved_structurally
`);
  writeFile(fixtureFeatureContractPath, `schema: v1
feature: contracts_resolution
touches:
  - contracts_fixture
success_criteria:
  - fixture_files_resolve_module_and_feature_contracts
`);
  writeFile(domainModelPath);
  writeFile(domainRepositoryPath);
  writeFile(usecasePath);
  writeFile(viewmodelStorePath);
  writeFile(viewmodelHookPath);
  writeFile(featureViewPath);
  writeFile(featureBlockPath);
  writeFile(invalidViewmodelPath);
  writeFile(unknownPath);
  writeFile(featureGuidePath, "# fixture feature guide\n");
  writeFile(routePath);

  assert.equal(getFileContractMeta(domainModelPath).fileType, "domain");
  assert.equal(getFileContractMeta(domainModelPath).contractFile, "layers.yaml");
  assert.equal(getFileContractMeta(domainRepositoryPath).fileType, "repository");
  assert.equal(getFileContractMeta(usecasePath).fileType, "usecase");
  assert.equal(getFileContractMeta(viewmodelStorePath).fileType, "viewmodel");
  assert.equal(getFileContractMeta(viewmodelHookPath).fileType, "viewmodel");
  assert.equal(getFileContractMeta(featureViewPath).fileType, "ui");
  assert.equal(getFileContractMeta(featureBlockPath).fileType, "ui");
  assert.equal(
    getFileContractMeta(invalidViewmodelPath).namingViolation,
    "Expected store.ts or use-*.ts for src/features/contracts-fixture/viewmodel/session.ts",
  );
  assert.equal(getFileContractMeta(unknownPath).contractFile, undefined);

  const system = loadContractSystem(process.cwd());
  assert.equal(listLayerDirectoryContracts().length, system.layers.architecture.patterns.mvvm.layers.length);
  assert(listKnownContracts().some((entry) => entry.relativePath === ".architecture/repository.yaml"));
  assert.equal(classifyFileByConvention(system, domainModelPath).layer, "domain");

  const viewChain = resolveEffectiveContractChain(featureViewPath);
  assert.deepEqual(
    viewChain.chain.map((entry) => entry.relativePath),
    [
      "CLAUDE.md",
      ...rootGuidanceChain,
      "src/features/contracts-fixture/CLAUDE.md",
      "src/features/contracts-fixture/.contract.yaml",
      ".architecture/features/contracts_fixture.contract.yaml",
      ".architecture/layers.yaml",
      ".architecture/repository.yaml",
    ],
  );

  const routeChain = resolveEffectiveContractChain(routePath);
  assert.deepEqual(
    routeChain.chain.map((entry) => entry.relativePath),
    [
      "CLAUDE.md",
      ...rootGuidanceChain,
      ".architecture/repository.yaml",
    ],
  );

  const invalidViewmodelChain = resolveEffectiveContractChain(invalidViewmodelPath);
  assert.deepEqual(
    invalidViewmodelChain.chain.map((entry) => entry.relativePath),
    [
      "CLAUDE.md",
      ...rootGuidanceChain,
      "src/features/contracts-fixture/CLAUDE.md",
      "src/features/contracts-fixture/.contract.yaml",
      ".architecture/features/contracts_fixture.contract.yaml",
      ".architecture/repository.yaml",
    ],
  );

  console.log("contracts resolver tests passed");
} finally {
  fs.rmSync(fixtureRoot, { recursive: true, force: true });
  fs.rmSync(routeFixtureDir, { recursive: true, force: true });
  fs.rmSync(fixtureFeatureContractPath, { force: true });
}
