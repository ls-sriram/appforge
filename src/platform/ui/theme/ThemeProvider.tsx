/**
 * ─────────────────────────────────────────────────────────────────
 * UI RUNTIME PROVIDER — React Context for UI runtime access.
 *
 * Wraps the app root so components can consume the assembled UI runtime
 * via `useUI()` and the token layer via `useTheme()`.
 *
 * The runtime keeps ownership explicit:
 * - `theme` for tokens
 * - `variants` for component appearance
 * - `layouts` for density/rhythm
 * ─────────────────────────────────────────────────────────────────
 */

import React, { createContext, useContext, ReactNode } from "react";
import { applyUiOverride, uiRuntime as defaultUiRuntime, type Theme, type UiOverride, type UiRuntime } from "./index";

// ─── Context ────────────────────────────────────────────────────

const UIContext = createContext<UiRuntime>(defaultUiRuntime);

// ─── Provider ───────────────────────────────────────────────────

export function ThemeProvider({
  children,
  value = defaultUiRuntime,
  override,
}: {
  children: ReactNode;
  value?: UiRuntime;
  override?: UiOverride;
}) {
  return (
    <UIContext.Provider value={applyUiOverride(value, override)}>
      {children}
    </UIContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────

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
