import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  buildTaskContract,
  classifyFileByConvention,
  getMvvmArchitecturePattern,
  getRepositoryGenerationContract,
  loadContractSystem,
  resolveContractsForPaths,
} from "../index";

describe("agent contract system", () => {
  it("discovers the nearest module contract for changed files", () => {
    const rootDir = createFixtureRepo();
    const system = loadContractSystem(rootDir);

    const resolved = resolveContractsForPaths(system, ["src/features/auth/ui/view.tsx"]);

    expect(resolved.modules.map((moduleContract) => moduleContract.module)).toEqual(["auth"]);
    expect(resolved.layers).toEqual(["feature"]);
  });

  it("resolves contracts in task > module > feature > layer > repository order", () => {
    const rootDir = createFixtureRepo();
    const system = loadContractSystem(rootDir);

    const task = buildTaskContract(system, {
      objective: "Align auth and settings identity",
      changedFiles: ["src/features/auth/usecases/sign-in.ts", "src/features/settings/usecases/load.ts"],
      taskPath: ".agent/runs/run-1/task.yaml",
    });

    expect(task.applicable_contracts.map((contractRef) => contractRef.kind)).toEqual([
      "task",
      "module",
      "module",
      "feature",
      "layer",
      "repository",
    ]);
  });

  it("rejects task scopes that widen beyond resolved module boundaries", () => {
    const rootDir = createFixtureRepo();
    const system = loadContractSystem(rootDir);

    expect(() =>
      buildTaskContract(system, {
        objective: "Sign in change",
        changedFiles: ["src/features/auth/usecases/sign-in.ts"],
        allowedFiles: ["src/features/settings/**"],
      }),
    ).toThrow('Task scope "src/features/settings/**" widens beyond matched module boundaries.');
  });

  it("rejects invalid layer import rules", () => {
    const rootDir = createFixtureRepo({
      layers: `schema: v1
layers:
  feature:
    can_import:
      - shared
  shared:
    can_import:
      - ghost
`,
    });

    expect(() => loadContractSystem(rootDir)).toThrow('Layer "shared" imports unknown layer "ghost".');
  });

  it("rejects malformed module contracts and unknown feature references", () => {
    const rootDir = createFixtureRepo({
      moduleContract: `schema: v1
layer: feature
owner: auth-team
public_api:
  - signIn
invariants:
  - auth_boundary
`,
      featureContract: `schema: v1
feature: account_identity
touches:
  - auth
  - ghost
success_criteria:
  - identity_loaded
`,
    });

    expect(() => loadContractSystem(rootDir)).toThrow(
      'src/features/auth/.contract.yaml is missing "module".',
    );
  });

  it("pulls feature success criteria for cross-module changes", () => {
    const rootDir = createFixtureRepo();
    const system = loadContractSystem(rootDir);

    const task = buildTaskContract(system, {
      objective: "Unify account identity",
      changedFiles: ["src/features/auth/usecases/sign-in.ts", "src/features/settings/usecases/load.ts"],
    });

    expect(task.context.matched_features).toEqual(["account_identity"]);
    expect(task.success_criteria).toEqual(
      expect.arrayContaining(["identity_loaded", "profile_loaded"]),
    );
  });

  it("loads MVVM generation rules from the repository contract", () => {
    const rootDir = createFixtureRepo();
    const system = loadContractSystem(rootDir);

    expect(getRepositoryGenerationContract(system)).toEqual({
      feature_structure: {
        required_dirs: ["domain", "usecases", "data", "viewmodel", "ui"],
        optional_dirs: ["tests", "assets", "mocks"],
      },
      file_patterns: {
        domain_model: "domain/model.ts",
        domain_repository: "domain/repository.ts",
        usecase: "usecases/*.ts",
        viewmodel_store: "viewmodel/store.ts",
        viewmodel_hook: "viewmodel/use-*.ts",
        ui_view: "ui/views/*View.tsx",
        ui_block: "ui/blocks/*Block.tsx",
        data_repository_impl: "data/*.repository.ts",
      },
      classification: {
        "domain/model.ts": { layer: "domain" },
        "domain/repository.ts": { layer: "repository" },
        "usecases/*.ts": { layer: "usecase" },
        "viewmodel/store.ts": { layer: "viewmodel" },
        "viewmodel/use-*.ts": { layer: "viewmodel" },
        "ui/views/*View.tsx": { layer: "ui" },
        "ui/blocks/*Block.tsx": { layer: "ui" },
        "data/*.repository.ts": { layer: "data" },
      },
      scaffolding: {
        create_tests: true,
        create_readme: false,
        create_contract: true,
      },
    });
  });

  it("loads MVVM architecture rules from layers.yaml", () => {
    const rootDir = createFixtureRepo();
    const system = loadContractSystem(rootDir);

    expect(getMvvmArchitecturePattern(system)).toEqual({
      layers: ["ui", "viewmodel", "usecase", "repository", "data", "domain"],
      allowed_dependencies: {
        ui: ["viewmodel"],
        viewmodel: ["usecase", "domain"],
        usecase: ["repository", "domain"],
        repository: ["data", "domain"],
        data: ["domain"],
        domain: [],
      },
    });
  });

  it("classifies files by repository conventions", () => {
    const rootDir = createFixtureRepo();
    const system = loadContractSystem(rootDir);

    expect(classifyFileByConvention(system, "src/features/profile/viewmodel/use-profile-edit-viewmodel.ts")).toEqual({
      file: "src/features/profile/viewmodel/use-profile-edit-viewmodel.ts",
      layer: "viewmodel",
      allowed_imports: ["usecase", "domain"],
    });
    expect(classifyFileByConvention(system, "src/features/profile/ui/views/ProfileView.tsx")).toEqual({
      file: "src/features/profile/ui/views/ProfileView.tsx",
      layer: "ui",
      allowed_imports: ["viewmodel"],
    });
    expect(classifyFileByConvention(system, "src/features/profile/domain/model.ts")).toEqual({
      file: "src/features/profile/domain/model.ts",
      layer: "domain",
      allowed_imports: [],
    });
  });

  it("rejects malformed generation rules", () => {
    const rootDir = createFixtureRepo({
      repositoryContract: `schema: v1
repository: fixture
invariants:
  - narrow_only
validation:
  task_contracts_may_only_narrow_scope: true
generation:
  feature_structure:
    required_dirs: []
    optional_dirs: tests
  file_patterns:
    usecase: ""
  classification:
    "usecases/*.ts": {}
  scaffolding:
    create_tests: yes
    create_readme: false
    create_contract: true
contract_resolution:
  order:
    - task
    - module
    - feature
    - layer
    - repository
  override_policy: narrower_only
`,
    });

    expect(() => loadContractSystem(rootDir)).toThrow(
      'Repository generation contract must define "feature_structure.required_dirs".',
    );
  });

  it("rejects malformed MVVM architecture rules", () => {
    const rootDir = createFixtureRepo({
      layers: `schema: v1
layers:
  feature:
    can_import:
      - feature
architecture:
  patterns:
    mvvm:
      layers:
        - ui
        - viewmodel
      allowed_dependencies:
        ui:
          - viewmodel
        ghost:
          - ui
`,
    });

    expect(() => loadContractSystem(rootDir)).toThrow(
      'MVVM architecture layer "viewmodel" is missing allowed dependency rules.',
    );
  });
});

function createFixtureRepo(
  overrides: {
    repositoryContract?: string;
    layers?: string;
    moduleContract?: string;
    featureContract?: string;
  } = {},
): string {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "contract-system-"));
  writeFile(
    rootDir,
    ".architecture/repository.yaml",
    overrides.repositoryContract ??
      `schema: v1
repository: fixture
invariants:
  - narrow_only
validation:
  task_contracts_may_only_narrow_scope: true
generation:
  feature_structure:
    required_dirs:
      - domain
      - usecases
      - data
      - viewmodel
      - ui
    optional_dirs:
      - tests
      - assets
      - mocks
  file_patterns:
    domain_model: "domain/model.ts"
    domain_repository: "domain/repository.ts"
    usecase: "usecases/*.ts"
    viewmodel_store: "viewmodel/store.ts"
    viewmodel_hook: "viewmodel/use-*.ts"
    ui_view: "ui/views/*View.tsx"
    ui_block: "ui/blocks/*Block.tsx"
    data_repository_impl: "data/*.repository.ts"
  classification:
    "domain/model.ts":
      layer: domain
    "domain/repository.ts":
      layer: repository
    "usecases/*.ts":
      layer: usecase
    "viewmodel/store.ts":
      layer: viewmodel
    "viewmodel/use-*.ts":
      layer: viewmodel
    "ui/views/*View.tsx":
      layer: ui
    "ui/blocks/*Block.tsx":
      layer: ui
    "data/*.repository.ts":
      layer: data
  scaffolding:
    create_tests: true
    create_readme: false
    create_contract: true
contract_resolution:
  order:
    - task
    - module
    - feature
    - layer
    - repository
  override_policy: narrower_only
`,
  );
  writeFile(
    rootDir,
    ".architecture/layers.yaml",
    overrides.layers ??
      `schema: v1
layers:
  feature:
    can_import:
      - feature
      - shared
  shared:
    can_import:
      - shared
architecture:
  patterns:
    mvvm:
      layers:
        - ui
        - viewmodel
        - usecase
        - repository
        - data
        - domain
      allowed_dependencies:
        ui:
          - viewmodel
        viewmodel:
          - usecase
          - domain
        usecase:
          - repository
          - domain
        repository:
          - data
          - domain
        data:
          - domain
        domain: []
`,
  );
  writeFile(
    rootDir,
    ".architecture/features/account_identity.contract.yaml",
    overrides.featureContract ??
      `schema: v1
feature: account_identity
touches:
  - auth
  - settings
success_criteria:
  - identity_loaded
  - profile_loaded
`,
  );
  writeFile(
    rootDir,
    ".agent/roles/implementer.yaml",
    `schema: v1
role: implementer
capabilities:
  - edit_code
cannot:
  - widen_scope
receives:
  - task_contract
success_conditions:
  - changes_are_valid
`,
  );
  writeFile(
    rootDir,
    "src/features/auth/.contract.yaml",
    overrides.moduleContract ??
      `schema: v1
module: auth
layer: feature
owner: auth-team
public_api:
  - signIn
invariants:
  - auth_boundary
`,
  );
  writeFile(
    rootDir,
    "src/features/settings/.contract.yaml",
    `schema: v1
module: settings
layer: feature
owner: settings-team
public_api:
  - loadSettings
invariants:
  - settings_boundary
`,
  );
  writeFile(rootDir, "src/features/auth/usecases/sign-in.ts", 'export const signIn = "signIn";\n');
  writeFile(rootDir, "src/features/auth/ui/view.tsx", 'export const View = "View";\n');
  writeFile(rootDir, "src/features/settings/usecases/load.ts", 'export const load = "load";\n');
  writeFile(
    rootDir,
    "tsconfig.json",
    JSON.stringify({ compilerOptions: { paths: { "@features/*": ["src/features/*"] } } }),
  );

  return rootDir;
}

function writeFile(rootDir: string, relativePath: string, content: string): void {
  const filePath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}
