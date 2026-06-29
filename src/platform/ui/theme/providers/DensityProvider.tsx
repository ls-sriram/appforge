import React, { createContext, useContext, ReactNode } from "react";
import { useUI } from "./ThemeProvider";
import type { LayoutContract } from "../../contracts/layouts";

const LayoutContext = createContext<LayoutContract | null>(null);

export function LayoutProvider({
  layout = "comfortable",
  children,
}: {
  layout?: string;
  children: ReactNode;
}) {
  const ui = useUI();
  const activeLayout = ui.layouts[layout];
  if (!activeLayout) throw new Error(`Unknown layout "${layout}"`);
  return (
    <LayoutContext.Provider value={activeLayout}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout(name?: string): LayoutContract {
  const ui = useUI();
  const ctx = useContext(LayoutContext);
  if (name) {
    const layout = ui.layouts[name];
    if (!layout) throw new Error(`Unknown layout "${name}"`);
    return layout;
  }
  if (ctx) return ctx;
  const fallback = ui.layouts.comfortable;
  if (!fallback) throw new Error("useLayout() requires a LayoutProvider or a ui.layouts.comfortable fallback");
  return fallback;
}

export const DensityProvider = LayoutProvider;
