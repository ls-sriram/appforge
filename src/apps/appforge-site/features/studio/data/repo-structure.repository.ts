/**
 * Repository layer — stable contract over the repo-scan datasource.
 *
 * Chooses the datasource (here: the generated snapshot) and exposes
 * domain-shaped getters. No view/viewmodel imports.
 */
import { fetchRepoScan } from "../services/repo-structure.service";
import type {
  ArchitectureScan,
  RepoScan,
  ScreensScan,
  DesignTokensScan,
  UiScan,
  ServiceInfo,
  BackendRoutesScan,
  HookInfo,
  ProviderInfo,
  CoreFn,
} from "../domain/repo-structure.types";

export const repoStructureRepository = {
  getScan(): RepoScan {
    return fetchRepoScan();
  },
  getGeneratedAt(): string {
    return fetchRepoScan().generatedAt;
  },
  getArchitecture(): ArchitectureScan {
    return fetchRepoScan().architecture;
  },
  getScreens(): ScreensScan {
    return fetchRepoScan().screens;
  },
  getDesignTokens(): DesignTokensScan {
    return fetchRepoScan().designTokens;
  },
  getUi(): UiScan {
    return fetchRepoScan().ui;
  },
  getServices(): ServiceInfo[] {
    return fetchRepoScan().services;
  },
  getBackendRoutes(): BackendRoutesScan {
    return fetchRepoScan().backendRoutes;
  },
  getHooks(): HookInfo[] {
    return fetchRepoScan().hooks;
  },
  getProviders(): ProviderInfo[] {
    return fetchRepoScan().providers;
  },
  getCore(): CoreFn[] {
    return fetchRepoScan().core;
  },
};
