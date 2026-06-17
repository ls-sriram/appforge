/**
 * Domain types for the AppForge Studio repo visualizer.
 *
 * These describe the shape of the generated scan snapshot
 * (services/repo-scan.generated.json). Only the slices the studio
 * renders are typed precisely; the rest stay loose until rendered.
 */

export interface LayerStat {
  id: string;
  label: string;
  path: string;
  rule: string;
  count?: number;
}

export interface ProhibitedEdge {
  from: string;
  to: string;
  reason: string;
}

export type MvvmLayerId =
  | "view"
  | "viewmodel"
  | "usecase"
  | "repository"
  | "datasource"
  | "runtime";

export interface FeatureLayerPresence {
  name: string;
  layers: Record<MvvmLayerId, boolean>;
}

export interface BoundaryViolation {
  file: string;
  edge: string;
  message: string;
}

export interface ArchitectureScan {
  uiCompositionLayers: LayerStat[];
  mvvmLayers: LayerStat[];
  prohibitedEdges: ProhibitedEdge[];
  featureLayerMatrix: FeatureLayerPresence[];
  violations: BoundaryViolation[];
}

// ─── Screens ─────────────────────────────────────────────────────
export interface ScreenRoute {
  name: string;
  path: string;
}
export interface ScreenApp {
  appId: string;
  displayName: string;
  routerRoot: string;
  routeBase: string;
  isDefault?: boolean;
  routes: ScreenRoute[];
}
export interface ScreensScan {
  apps: ScreenApp[];
}

// ─── Design tokens ───────────────────────────────────────────────
export interface TokenEntry {
  key: string;
  value: string;
}
export interface LayoutTokenBlock {
  name: string;
  entries: TokenEntry[];
}
export interface ColorPalette {
  label: string;
  colors: Record<string, string>;
}
export interface DesignTokensScan {
  layoutTokenBlocks: LayoutTokenBlock[];
  colorPalette: { palettes: ColorPalette[] };
  themeShape?: Record<string, unknown>;
}

// ─── UI components ───────────────────────────────────────────────
export interface UiProp {
  name: string;
  optional: boolean;
  type: string;
}
export interface UiComponent {
  name: string;
  file: string;
  exported: boolean;
  props: UiProp[];
}
export interface UiScan {
  primitives: UiComponent[];
  blocks: UiComponent[];
  panels: UiComponent[];
  layouts: UiComponent[];
}

// ─── Services ────────────────────────────────────────────────────
export interface ServiceMethod {
  name: string;
  returnType: string;
}
export interface ServiceInfo {
  name: string;
  file: string;
  methods: ServiceMethod[];
  protoCalls: string[];
  directCalls: string[];
}

// ─── Backend routes ──────────────────────────────────────────────
export interface ProtoRoute {
  key: string;
  service: string;
  method: string;
  path: string;
  requestType: string;
  responseType: string;
}
export interface KotlinRoute {
  file: string;
  method: string;
  path: string;
  baseHint?: string;
}
export interface BackendRoutesScan {
  protoContract: ProtoRoute[];
  kotlinImplementation: KotlinRoute[];
}

// ─── Hooks / providers / core ────────────────────────────────────
export interface HookInfo {
  name: string;
  file: string;
  params: string;
  returnFields: string[];
}
export interface ProviderInfo {
  name: string;
  file: string;
  contextHook?: string;
  props: string[];
}
export interface CoreFn {
  name: string;
  params: string;
  returnType: string;
  file: string;
}

export interface RepoScan {
  generatedAt: string;
  architecture: ArchitectureScan;
  screens: ScreensScan;
  designTokens: DesignTokensScan;
  ui: UiScan;
  services: ServiceInfo[];
  backendRoutes: BackendRoutesScan;
  hooks: HookInfo[];
  providers: ProviderInfo[];
  core: CoreFn[];
}
