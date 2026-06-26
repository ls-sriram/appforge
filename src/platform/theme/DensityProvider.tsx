import React, { createContext, useContext, ReactNode } from "react";
import { useTheme } from "./ThemeProvider";
import type { LayoutContract } from "../ui/contracts";

const DensityContext = createContext<LayoutContract | null>(null);

export function DensityProvider({
  density = "comfortable",
  children,
}: {
  density?: string;
  children: ReactNode;
}) {
  const theme = useTheme();
  const layout = theme.layouts[density];
  if (!layout) throw new Error(`Unknown density "${density}"`);
  return (
    <DensityContext.Provider value={layout}>
      {children}
    </DensityContext.Provider>
  );
}

export function useLayout(name?: string): LayoutContract {
  const theme = useTheme();
  const ctx = useContext(DensityContext);
  if (name) {
    const layout = theme.layouts[name];
    if (!layout) throw new Error(`Unknown layout "${name}"`);
    return layout;
  }
  if (ctx) return ctx;
  const fallback = theme.layouts.comfortable;
  if (!fallback) throw new Error("useLayout() requires a DensityProvider or a theme.layouts.comfortable fallback");
  return fallback;
}
