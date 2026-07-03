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
      content_contracts: {
        screen: {
          responsibilities: [
            "route_orchestrator",
            "binds_navigation_and_feature_entry",
            "delegates_rendering_to_view_or_blocks",
          ],
          must_not: [
            "contain_domain_persistence_logic",
            "become_reusable_visual_primitive",
          ],
        },
        view: {
          responsibilities: [
            "pure_feature_render_composition",
            "maps_viewmodel_state_to_props",
            "coordinates_blocks_without_owning_state",
          ],
          must_not: [
            "call_datasources_or_repositories",
            "own_long_lived_business_state",
          ],
        },
        viewmodel: {
          responsibilities: [
            "expose_view_state",
            "expose_ui_actions",
            "coordinate_usecases_for_screen_flows",
          ],
        },
        scaffold: {
          responsibilities: [
            "own_page_or_surface_chrome",
            "provide_layout_slots_for_view_or_blocks",
          ],
          must_not: ["contain_business_state_transitions"],
        },
        store: {
          responsibilities: [
            "own_mutable_feature_state",
            "provide_state_transitions",
          ],
          must_not: ["render_ui"],
        },
        usecase: {
          responsibilities: [
            "execute_business_operation",
            "enforce_domain_rules",
          ],
        },
        repository: {
          responsibilities: ["define_domain_persistence_abstraction"],
          must_not: ["bind_transport_details"],
        },
        datasource: {
          responsibilities: [
            "perform_transport_or_storage_io",
            "adapt_external_systems",
          ],
        },
        service: {
          responsibilities: [
            "expose_boundary_facing_operations",
            "coordinate_external_system_calls",
          ],
          must_not: ["own_domain_invariants"],
        },
        runtime: {
          responsibilities: [
            "implement_feature_scoped_runtime_capabilities",
            "isolate_environment_adapters",
          ],
          must_not: ["act_as_feature_entry_view"],
        },
        model: {
          responsibilities: ["define_domain_entities_and_value_shapes"],
        },
        dto: {
          responsibilities: [
            "define_transport_shapes",
            "remain_boundary_facing",
          ],
        },
        mapper: {
          responsibilities: ["translate_dto_and_domain_shapes"],
        },
        block: {
          responsibilities: [
            "reusable_visual_composition",
            "remain_presentational_and_prop_driven",
          ],
          must_not: [
            "own_feature_orchestration",
            "call_usecases_directly",
          ],
        },
        stage: {
          responsibilities: [
            "visualizer_or_demo_surface",
            "showcase_view_or_block_states",
          ],
          must_not: ["serve_as_runtime_feature_entrypoint"],
        },
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

    expect(classifyFileByConvention(system, "src/features/profile/profile.viewmodel.ts")).toEqual({
      file: "src/features/profile/profile.viewmodel.ts",
      layer: "viewmodel",
      role: "viewmodel",
      responsibilities: [
        "expose_view_state",
        "expose_ui_actions",
        "coordinate_usecases_for_screen_flows",
      ],
      prohibited_behaviors: [],
      allowed_imports: ["usecase", "domain"],
    });
    expect(classifyFileByConvention(system, "src/features/profile/profile.view.tsx")).toEqual({
      file: "src/features/profile/profile.view.tsx",
      layer: "ui",
      role: "view",
      responsibilities: [
        "pure_feature_render_composition",
        "maps_viewmodel_state_to_props",
        "coordinates_blocks_without_owning_state",
      ],
      prohibited_behaviors: [
        "call_datasources_or_repositories",
        "own_long_lived_business_state",
      ],
      allowed_imports: ["viewmodel"],
    });
    expect(classifyFileByConvention(system, "src/features/profile/profile.stage.tsx")).toEqual({
      file: "src/features/profile/profile.stage.tsx",
      layer: "ui",
      role: "stage",
      responsibilities: [
        "visualizer_or_demo_surface",
        "showcase_view_or_block_states",
      ],
      prohibited_behaviors: ["serve_as_runtime_feature_entrypoint"],
      allowed_imports: ["viewmodel"],
    });
    expect(classifyFileByConvention(system, "src/features/profile/profile.scaffold.tsx")).toEqual({
      file: "src/features/profile/profile.scaffold.tsx",
      layer: "ui",
      role: "scaffold",
      responsibilities: [
        "own_page_or_surface_chrome",
        "provide_layout_slots_for_view_or_blocks",
      ],
      prohibited_behaviors: ["contain_business_state_transitions"],
      allowed_imports: ["viewmodel"],
    });
    expect(classifyFileByConvention(system, "src/features/profile/profile.service.ts")).toEqual({
      file: "src/features/profile/profile.service.ts",
      layer: "data",
      role: "service",
      responsibilities: [
        "expose_boundary_facing_operations",
        "coordinate_external_system_calls",
      ],
      prohibited_behaviors: ["own_domain_invariants"],
      allowed_imports: ["domain"],
    });
    expect(classifyFileByConvention(system, "src/features/profile/profile.runtime.web.ts")).toEqual({
      file: "src/features/profile/profile.runtime.web.ts",
      layer: "data",
      role: "runtime",
      responsibilities: [
        "implement_feature_scoped_runtime_capabilities",
        "isolate_environment_adapters",
      ],
      prohibited_behaviors: ["act_as_feature_entry_view"],
      allowed_imports: ["domain"],
    });
    expect(classifyFileByConvention(system, "src/features/profile/profile.runtime.ts")).toEqual({
      file: "src/features/profile/profile.runtime.ts",
      layer: "data",
      role: "runtime",
      responsibilities: [
        "implement_feature_scoped_runtime_capabilities",
        "isolate_environment_adapters",
      ],
      prohibited_behaviors: ["act_as_feature_entry_view"],
      allowed_imports: ["domain"],
    });
    expect(classifyFileByConvention(system, "src/features/profile/profile.model.ts")).toEqual({
      file: "src/features/profile/profile.model.ts",
      layer: "domain",
      role: "model",
      responsibilities: ["define_domain_entities_and_value_shapes"],
      prohibited_behaviors: [],
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
  content_contracts:
    view:
      responsibilities: invalid
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
  content_contracts:
    screen:
      responsibilities:
        - route_orchestrator
        - binds_navigation_and_feature_entry
        - delegates_rendering_to_view_or_blocks
      must_not:
        - contain_domain_persistence_logic
        - become_reusable_visual_primitive
    view:
      responsibilities:
        - pure_feature_render_composition
        - maps_viewmodel_state_to_props
        - coordinates_blocks_without_owning_state
      must_not:
        - call_datasources_or_repositories
        - own_long_lived_business_state
    viewmodel:
      responsibilities:
        - expose_view_state
        - expose_ui_actions
        - coordinate_usecases_for_screen_flows
    scaffold:
      responsibilities:
        - own_page_or_surface_chrome
        - provide_layout_slots_for_view_or_blocks
      must_not:
        - contain_business_state_transitions
    store:
      responsibilities:
        - own_mutable_feature_state
        - provide_state_transitions
      must_not:
        - render_ui
    usecase:
      responsibilities:
        - execute_business_operation
        - enforce_domain_rules
    repository:
      responsibilities:
        - define_domain_persistence_abstraction
      must_not:
        - bind_transport_details
    datasource:
      responsibilities:
        - perform_transport_or_storage_io
        - adapt_external_systems
    service:
      responsibilities:
        - expose_boundary_facing_operations
        - coordinate_external_system_calls
      must_not:
        - own_domain_invariants
    runtime:
      responsibilities:
        - implement_feature_scoped_runtime_capabilities
        - isolate_environment_adapters
      must_not:
        - act_as_feature_entry_view
    model:
      responsibilities:
        - define_domain_entities_and_value_shapes
    dto:
      responsibilities:
        - define_transport_shapes
        - remain_boundary_facing
    mapper:
      responsibilities:
        - translate_dto_and_domain_shapes
    block:
      responsibilities:
        - reusable_visual_composition
        - remain_presentational_and_prop_driven
      must_not:
        - own_feature_orchestration
        - call_usecases_directly
    stage:
      responsibilities:
        - visualizer_or_demo_surface
        - showcase_view_or_block_states
      must_not:
        - serve_as_runtime_feature_entrypoint
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
