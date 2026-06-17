/**
 * UseCase — assemble the full studio catalog the visualizer renders.
 *
 * Reads every scanned slice through the repository and tallies the
 * per-category counts the navigation needs. Orchestrates the repository
 * only; no UI imports.
 */
import { repoStructureRepository as repo } from "../data/repo-structure.repository";
import type { RepoScan } from "../domain/repo-structure.types";

export type StudioCategoryId =
  | "architecture"
  | "screens"
  | "designTokens"
  | "ui"
  | "services"
  | "backendRoutes"
  | "hooks"
  | "providers"
  | "core";

export interface StudioCatalog {
  generatedAt: string;
  scan: RepoScan;
  counts: Record<StudioCategoryId, number>;
}

export function getRepoCatalog(): StudioCatalog {
  const scan = repo.getScan();
  const ui = scan.ui;
  const uiTotal = ui.primitives.length + ui.blocks.length + ui.panels.length + ui.layouts.length;
  const screensTotal = scan.screens.apps.reduce((n, a) => n + a.routes.length, 0);
  const tokensTotal =
    scan.designTokens.layoutTokenBlocks.length + scan.designTokens.colorPalette.palettes.length;
  const routesTotal =
    scan.backendRoutes.protoContract.length + scan.backendRoutes.kotlinImplementation.length;

  return {
    generatedAt: scan.generatedAt,
    scan,
    counts: {
      architecture: scan.architecture.uiCompositionLayers.length,
      screens: screensTotal,
      designTokens: tokensTotal,
      ui: uiTotal,
      services: scan.services.length,
      backendRoutes: routesTotal,
      hooks: scan.hooks.length,
      providers: scan.providers.length,
      core: scan.core.length,
    },
  };
}
