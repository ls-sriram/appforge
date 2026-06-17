/**
 * ViewModel — owns the studio architecture screen's UI state.
 *
 * Calls the use-case only; no direct service/data imports. Exposes
 * read-only derived state plus the selected layer-stack toggle the view
 * drives via typed intents.
 */
import React from "react";
import {
  getArchitectureOverview,
  type ArchitectureOverview,
} from "../usecases/get-architecture-overview";

export type LayerLens = "ui" | "mvvm";

export interface ArchitectureViewState {
  overview: ArchitectureOverview;
  lens: LayerLens;
  setLens: (lens: LayerLens) => void;
}

export function useArchitectureView(): ArchitectureViewState {
  const overview = React.useMemo(() => getArchitectureOverview(), []);
  const [lens, setLens] = React.useState<LayerLens>("ui");
  return { overview, lens, setLens };
}
