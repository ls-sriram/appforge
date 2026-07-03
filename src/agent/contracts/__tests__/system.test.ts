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

    const resolved = resolveContractsForPaths(system, ["src/features/auth/auth.view.tsx"]);

    expect(resolved.modules.map((moduleContract) => moduleContract.module)).toEqual(["auth"]);
    expect(resolved.layers).toEqual(["feature"]);
  });

  it("resolves contracts in task > module > feature > layer > repository order", () => {
    const rootDir = createFixtureRepo();
    const system = loadContractSystem(rootDir);

    const task = buildTaskContract(system, {
      objective: "Align auth and settings identity",
      changedFiles: [
        "src/features/auth/auth.usecase.ts",
        "src/features/settings/settings.usecase.ts",
      ],
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
        changedFiles: ["src/features/auth/auth.usecase.ts"],
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
      changedFiles: [
        "src/features/auth/auth.usecase.ts",
        "src/features/settings/settings.usecase.ts",
      ],
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
        layout: "flat",
        optional_dirs: ["tests", "assets", "mocks"],
      },
      conventions: {
        layer_contracts_dir: ".architecture/layers",
        standard_feature_roles: {
          description: "common feature shape used by most product features",
          suffixes: [
            "screen",
            "view",
            "scaffold",
            "block",
            "stage",
            "viewmodel",
            "store",
            "usecase",
            "repository",
            "datasource",
            "model",
            "mapper",
            "styles",
            "contracts",
          ],
        },
        optional_specialized_roles: {
          description:
            "integration and runtime roles used only when a feature needs platform, SDK, transport, or composition-specific files",
          suffixes: ["service", "runtime", "dto"],
        },
      },
      file_suffixes: {
        screen: ".screen.tsx",
        view: ".view.tsx",
        scaffold: ".scaffold.tsx",
        viewmodel: ".viewmodel.ts",
        store: ".store.ts",
        usecase: ".usecase.ts",
        repository: ".repository.ts",
        datasource: ".datasource.ts",
        service: ".service.ts",
        runtime: ".runtime.ts",
        runtime_variant: ".runtime.<variant>.ts",
        model: ".model.ts",
        dto: ".dto.ts",
        mapper: ".mapper.ts",
        block: ".block.tsx",
        stage: ".stage.tsx",
      },
      classification: {
        "*.screen.tsx": { layer: "ui", role: "screen" },
        "*.view.tsx": { layer: "ui", role: "view" },
        "*.scaffold.tsx": { layer: "ui", role: "scaffold" },
        "*.viewmodel.ts": { layer: "viewmodel", role: "viewmodel" },
        "*.store.ts": { layer: "viewmodel", role: "store" },
        "*.usecase.ts": { layer: "usecase", role: "usecase" },
        "*.repository.ts": { layer: "repository", role: "repository" },
        "*.datasource.ts": { layer: "data", role: "datasource" },
        "*.service.ts": { layer: "data", role: "service" },
        "*.runtime.ts": { layer: "data", role: "runtime" },
        "*.runtime.*.ts": { layer: "data", role: "runtime" },
        "*.model.ts": { layer: "domain", role: "model" },
        "*.dto.ts": { layer: "data", role: "dto" },
        "*.mapper.ts": { layer: "data", role: "mapper" },
        "*.block.tsx": { layer: "ui", role: "block" },
        "*.stage.tsx": { layer: "ui", role: "stage" },
      },
      standard_feature_contract: {
        flow: [
          "screen -> view",
          "screen -> viewmodel",
          "view -> block|scaffold|styles|contracts",
          "viewmodel -> store|usecase|repository|runtime",
          "usecase -> domain",
          "repository -> datasource|domain",
          "datasource -> external_io",
          "model -> domain_only",
        ],
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
        ui: ["viewmodel", "domain"],
        viewmodel: ["usecase", "domain", "repository", "data"],
        usecase: ["repository", "domain", "data"],
        repository: ["data", "domain"],
        data: ["repository", "data", "domain"],
        domain: [],
      },
    });
  });

  it("classifies files by repository conventions", () => {
    const rootDir = createFixtureRepo();
    const system = loadContractSystem(rootDir);

    expect(classifyFileByConvention(system, "src/features/profile/profile.viewmodel.ts")).toEqual({
      file: "src/features/profile/profile.viewmodel.ts",
      layer: "viewmodel",
      role: "viewmodel",
      responsibilities: [
        "own_ui_state_and_derived_display_state",
        "expose_typed_ui_actions",
        "coordinate_store_usecase_repository_and_runtime_calls",
        "translate_view_intents_into_feature_operations",
      ],
      prohibited_behaviors: [
        "render_jsx",
        "contain_transport_specific_io_details",
        "import_screen_view_or_block_files",
      ],
      allowed_imports: ["usecase", "domain", "repository", "data"],
    });
    expect(classifyFileByConvention(system, "src/features/profile/profile.view.tsx")).toEqual({
      file: "src/features/profile/profile.view.tsx",
      layer: "ui",
      role: "view",
      responsibilities: [
        "render_feature_surface_only",
        "receive_display_data_via_props",
        "emit_intents_via_typed_callback_props",
        "compose_blocks_without_owning_feature_state",
      ],
      prohibited_behaviors: [
        "call_datasources_repositories_or_usecases",
        "own_long_lived_business_state",
        "perform_transport_or_persistence_logic",
      ],
      allowed_imports: ["viewmodel", "domain"],
    });
    expect(classifyFileByConvention(system, "src/features/profile/profile.stage.tsx")).toEqual({
      file: "src/features/profile/profile.stage.tsx",
      layer: "ui",
      role: "stage",
      responsibilities: [
        "render_visualizer_or_demo_surface",
        "preview_real_view_or_block_states_with_mock_data",
        "keep_callbacks_inert_and_display_focused",
      ],
      prohibited_behaviors: [
        "call_router_session_or_network",
        "perform_real_side_effects",
        "become_runtime_feature_entrypoint",
      ],
      allowed_imports: ["viewmodel", "domain"],
    });
    expect(classifyFileByConvention(system, "src/features/profile/profile.scaffold.tsx")).toEqual({
      file: "src/features/profile/profile.scaffold.tsx",
      layer: "ui",
      role: "scaffold",
      responsibilities: [
        "own_surface_chrome_and_slot_layout",
        "provide_hierarchy_responsive_behavior_and_safe_areas",
        "host_view_or_block_content_without_owning_business_state",
      ],
      prohibited_behaviors: [
        "contain_business_state_transitions",
        "define_primitive_appearance_policy",
        "call_usecases_or_datasources",
      ],
      allowed_imports: ["viewmodel", "domain"],
    });
    expect(classifyFileByConvention(system, "src/features/profile/profile.runtime.web.ts")).toEqual({
      file: "src/features/profile/profile.runtime.web.ts",
      layer: "data",
      role: "runtime",
      responsibilities: [
        "wrap_live_runtime_capabilities",
        "isolate_environment_specific_side_effects",
        "accept_explicit_inputs_from_callers",
      ],
      prohibited_behaviors: [
        "own_feature_data_persistence_contracts",
        "encode_business_rules",
        "import_ui_layers",
      ],
      allowed_imports: ["repository", "data", "domain"],
    });
    expect(classifyFileByConvention(system, "src/features/profile/profile.runtime.ts")).toEqual({
      file: "src/features/profile/profile.runtime.ts",
      layer: "data",
      role: "runtime",
      responsibilities: [
        "wrap_live_runtime_capabilities",
        "isolate_environment_specific_side_effects",
        "accept_explicit_inputs_from_callers",
      ],
      prohibited_behaviors: [
        "own_feature_data_persistence_contracts",
        "encode_business_rules",
        "import_ui_layers",
      ],
      allowed_imports: ["repository", "data", "domain"],
    });
    expect(classifyFileByConvention(system, "src/features/profile/profile.model.ts")).toEqual({
      file: "src/features/profile/profile.model.ts",
      layer: "domain",
      role: "model",
      responsibilities: [
        "define_domain_entities_and_value_shapes",
        "remain_framework_agnostic",
        "keep_domain_types_stable_for_feature_logic",
      ],
      prohibited_behaviors: [
        "perform_io_or_side_effects",
        "import_ui_or_data_layers",
        "encode_transport_specific_shapes",
      ],
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
    layout: ""
    optional_dirs: tests
  file_suffixes:
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
      'Repository generation contract must define "feature_structure.layout".',
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
    layout: flat
    optional_dirs:
      - tests
      - assets
      - mocks
  conventions:
    layer_contracts_dir: .architecture/layers
    standard_feature_roles:
      description: common feature shape used by most product features
      suffixes:
        - screen
        - view
        - scaffold
        - block
        - stage
        - viewmodel
        - store
        - usecase
        - repository
        - datasource
        - model
        - mapper
        - styles
        - contracts
    optional_specialized_roles:
      description: integration and runtime roles used only when a feature needs platform, SDK, transport, or composition-specific files
      suffixes:
        - service
        - runtime
        - dto
  file_suffixes:
    screen: ".screen.tsx"
    view: ".view.tsx"
    scaffold: ".scaffold.tsx"
    viewmodel: ".viewmodel.ts"
    store: ".store.ts"
    usecase: ".usecase.ts"
    repository: ".repository.ts"
    datasource: ".datasource.ts"
    service: ".service.ts"
    runtime: ".runtime.ts"
    runtime_variant: ".runtime.<variant>.ts"
    model: ".model.ts"
    dto: ".dto.ts"
    mapper: ".mapper.ts"
    block: ".block.tsx"
    stage: ".stage.tsx"
  classification:
    "*.screen.tsx":
      layer: ui
      role: screen
    "*.view.tsx":
      layer: ui
      role: view
    "*.scaffold.tsx":
      layer: ui
      role: scaffold
    "*.viewmodel.ts":
      layer: viewmodel
      role: viewmodel
    "*.store.ts":
      layer: viewmodel
      role: store
    "*.usecase.ts":
      layer: usecase
      role: usecase
    "*.repository.ts":
      layer: repository
      role: repository
    "*.datasource.ts":
      layer: data
      role: datasource
    "*.service.ts":
      layer: data
      role: service
    "*.runtime.ts":
      layer: data
      role: runtime
    "*.runtime.*.ts":
      layer: data
      role: runtime
    "*.model.ts":
      layer: domain
      role: model
    "*.dto.ts":
      layer: data
      role: dto
    "*.mapper.ts":
      layer: data
      role: mapper
    "*.block.tsx":
      layer: ui
      role: block
    "*.stage.tsx":
      layer: ui
      role: stage
  standard_feature_contract:
    flow:
      - screen -> view
      - screen -> viewmodel
      - view -> block|scaffold|styles|contracts
      - viewmodel -> store|usecase|repository|runtime
      - usecase -> domain
      - repository -> datasource|domain
      - datasource -> external_io
      - model -> domain_only
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
          - domain
        viewmodel:
          - usecase
          - domain
          - repository
          - data
        usecase:
          - repository
          - domain
          - data
        repository:
          - data
          - domain
        data:
          - repository
          - data
          - domain
        domain: []
`,
  );
  writeFile(
    rootDir,
    ".architecture/layers/viewmodel.yaml",
    `schema: v1
layer: viewmodel
role: viewmodel
responsibilities:
  - own_ui_state_and_derived_display_state
  - expose_typed_ui_actions
  - coordinate_store_usecase_repository_and_runtime_calls
  - translate_view_intents_into_feature_operations
must_not:
  - render_jsx
  - contain_transport_specific_io_details
  - import_screen_view_or_block_files
`,
  );
  writeFile(
    rootDir,
    ".architecture/layers/view.yaml",
    `schema: v1
layer: ui
role: view
responsibilities:
  - render_feature_surface_only
  - receive_display_data_via_props
  - emit_intents_via_typed_callback_props
  - compose_blocks_without_owning_feature_state
must_not:
  - call_datasources_repositories_or_usecases
  - own_long_lived_business_state
  - perform_transport_or_persistence_logic
`,
  );
  writeFile(
    rootDir,
    ".architecture/layers/stage.yaml",
    `schema: v1
layer: ui
role: stage
responsibilities:
  - render_visualizer_or_demo_surface
  - preview_real_view_or_block_states_with_mock_data
  - keep_callbacks_inert_and_display_focused
must_not:
  - call_router_session_or_network
  - perform_real_side_effects
  - become_runtime_feature_entrypoint
`,
  );
  writeFile(
    rootDir,
    ".architecture/layers/scaffold.yaml",
    `schema: v1
layer: ui
role: scaffold
responsibilities:
  - own_surface_chrome_and_slot_layout
  - provide_hierarchy_responsive_behavior_and_safe_areas
  - host_view_or_block_content_without_owning_business_state
must_not:
  - contain_business_state_transitions
  - define_primitive_appearance_policy
  - call_usecases_or_datasources
`,
  );
  writeFile(
    rootDir,
    ".architecture/layers/runtime.yaml",
    `schema: v1
layer: data
role: runtime
responsibilities:
  - wrap_live_runtime_capabilities
  - isolate_environment_specific_side_effects
  - accept_explicit_inputs_from_callers
must_not:
  - own_feature_data_persistence_contracts
  - encode_business_rules
  - import_ui_layers
`,
  );
  writeFile(
    rootDir,
    ".architecture/layers/model.yaml",
    `schema: v1
layer: domain
role: model
responsibilities:
  - define_domain_entities_and_value_shapes
  - remain_framework_agnostic
  - keep_domain_types_stable_for_feature_logic
must_not:
  - perform_io_or_side_effects
  - import_ui_or_data_layers
  - encode_transport_specific_shapes
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
  writeFile(rootDir, "src/features/auth/auth.usecase.ts", 'export const signIn = "signIn";\n');
  writeFile(rootDir, "src/features/auth/auth.view.tsx", 'export const View = "View";\n');
  writeFile(rootDir, "src/features/settings/settings.usecase.ts", 'export const load = "load";\n');
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
