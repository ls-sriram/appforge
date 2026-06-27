/**
 * ─────────────────────────────────────────────────────────────────
 * THEME PROVIDER — React Context for theme access.
 *
 * Wraps the app root so every component can consume the theme
 * via `useTheme()`. Enables future runtime theme switching
 * (dark mode, A/B themes, brand reskins).
 *
 * Views are dumb — they call `useTheme()` for style values.
 * ─────────────────────────────────────────────────────────────────
 */

import React, { createContext, useContext, ReactNode } from "react";
import { applyThemeOverride, theme as defaultTheme, Theme, ThemeOverride } from "./index";

// ─── Context ────────────────────────────────────────────────────

const ThemeContext = createContext<Theme>(defaultTheme);

// ─── Provider ───────────────────────────────────────────────────

export function ThemeProvider({
  children,
  value = defaultTheme,
  override,
}: {
  children: ReactNode;
  value?: Theme;
  override?: ThemeOverride;
}) {
  return (
    <ThemeContext.Provider value={applyThemeOverride(value, override)}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme() must be called within a ThemeProvider");
  }
  return ctx;
}
