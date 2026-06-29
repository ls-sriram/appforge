import React, { createContext, useContext, ReactNode } from "react";
import { uiRuntime as defaultUiRuntime } from "../definitions/defaults";
import type { Theme } from "../definitions/tokens";
import type { UiRuntime } from "../definitions/runtime";

const UIContext = createContext<UiRuntime>(defaultUiRuntime);

export function ThemeProvider({
  children,
  value = defaultUiRuntime,
}: {
  children: ReactNode;
  value?: UiRuntime;
}) {
  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI(): UiRuntime {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error("useUI() must be called within a ThemeProvider");
  }
  return ctx;
}

export function useTheme(): Theme {
  return useUI().theme;
}

export const useThemeTokens = useTheme;
