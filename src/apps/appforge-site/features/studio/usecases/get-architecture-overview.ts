/**
 * UseCase — assemble the architecture overview the studio renders.
 *
 * One business action: read the architecture scan and derive the summary
 * counts the view needs. Orchestrates the repository; no UI imports.
 */
import { repoStructureRepository } from "../data/repo-structure.repository";
import type { ArchitectureScan } from "../domain/repo-structure.types";

export interface ArchitectureOverview {
  generatedAt: string;
  architecture: ArchitectureScan;
  totals: {
    uiLayers: number;
    mvvmLayers: number;
    features: number;
    violations: number;
  };
}

export function getArchitectureOverview(): ArchitectureOverview {
  const architecture = repoStructureRepository.getArchitecture();
  return {
    generatedAt: repoStructureRepository.getGeneratedAt(),
    architecture,
    totals: {
      uiLayers: architecture.uiCompositionLayers.length,
      mvvmLayers: architecture.mvvmLayers.length,
      features: architecture.featureLayerMatrix.length,
      violations: architecture.violations.length,
    },
  };
}
