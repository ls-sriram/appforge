/**
 * ViewModel — owns the studio screen's UI state.
 *
 * Calls use-cases only; no direct service/data imports. Owns the active
 * category and the architecture layer-lens, and exposes the read-only
 * catalog plus a search filter the view drives via typed intents.
 */
import React from "react";
import { getRepoCatalog, type StudioCatalog, type StudioCategoryId } from "../usecases/get-repo-catalog";

export type LayerLens = "ui" | "mvvm";

export interface StudioState {
  catalog: StudioCatalog;
  category: StudioCategoryId;
  setCategory: (id: StudioCategoryId) => void;
  lens: LayerLens;
  setLens: (lens: LayerLens) => void;
  filter: string;
  setFilter: (q: string) => void;
}

export function useStudio(): StudioState {
  const catalog = React.useMemo(() => getRepoCatalog(), []);
  const [category, setCategory] = React.useState<StudioCategoryId>("architecture");
  const [lens, setLens] = React.useState<LayerLens>("ui");
  const [filter, setFilter] = React.useState("");
  return { catalog, category, setCategory, lens, setLens, filter, setFilter };
}
