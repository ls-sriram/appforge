import React, { createContext, useContext } from "react";
import type { ViewportInfo } from "./Viewport";

const ViewportOverrideContext = createContext<ViewportInfo | null>(null);

export function ViewportProvider({
  value,
  children,
}: {
  value: ViewportInfo;
  children: React.ReactNode;
}) {
  return (
    <ViewportOverrideContext.Provider value={value}>
      {children}
    </ViewportOverrideContext.Provider>
  );
}

export function useViewportOverride(): ViewportInfo | null {
  return useContext(ViewportOverrideContext);
}
