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

export function useLayout(): LayoutContract {
  const ctx = useContext(DensityContext);
  if (!ctx) throw new Error("useLayout() must be called within a DensityProvider");
  return ctx;
}
