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
import { theme as defaultTheme, Theme } from "./index";

// ─── Context ────────────────────────────────────────────────────

const ThemeContext = createContext<Theme>(defaultTheme);

// ─── Provider ───────────────────────────────────────────────────

export function ThemeProvider({
  children,
  value = defaultTheme,
}: {
  children: ReactNode;
  value?: Theme;
}) {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ─── Hook ───────────────────────────────────────────────────────

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme() must be called within a ThemeProvider");
  }
  return ctx;
}
