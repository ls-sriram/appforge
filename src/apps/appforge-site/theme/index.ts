/**
 * ─────────────────────────────────────────────────────────────────
 * APPFORGE-SITE THEME — app-specific dark, branded theme.
 *
 * Layer 5 (app-shared theme): overrides the shared default palette
 * with a true dark canvas + purple/orange accents for the marketing
 * surface. Built via createAppTheme() so every component shape
 * (buttons, panels, tags, badges) re-derives from these tokens —
 * editing a value here restyles the whole site.
 * ─────────────────────────────────────────────────────────────────
 */

import { createAppTheme, type Theme } from "@theme/index";

export const appforgeSiteTheme: Theme = createAppTheme(
  {
    brand: {
      primary: "#7C5CFF",
      primaryHover: "#6D45F0",
      success: "#34D399",
      warning: "#FBBF24",
      error: "#FB7185",
      info: "#38BDF8",
    },
    dark: true,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    radiusScale: 1.6,
  },
  {
    // True dark canvas
    bg: "#08080F",
    surface: "#13131F",
    surfaceAlt: "#1A1A2A",
    surfaceStrong: "#151522",
    surfaceMuted: "#101019",
    surfaceInset: "#0C0C15",
    surfaceWash: "#1C1C2C",

    // Hairline borders on dark
    border: "rgba(255,255,255,0.08)",
    borderSubtle: "rgba(255,255,255,0.05)",
    borderHover: "rgba(255,255,255,0.16)",
    borderLight: "rgba(255,255,255,0.12)",

    // Light text ramp
    textPrimary: "#F5F5FA",
    textSecondary: "#BFBFD0",
    textMuted: "#8A8AA3",
    textTertiary: "#70708A",
    textQuaternary: "#4A4A60",
    textInverse: "#FFFFFF",

    // Single restrained accent — soft lavender, used sparingly (Vanna-clean)
    accent: "#A78BFA",
    accentHover: "#8B5CF6",
    accentMuted: "rgba(167,139,250,0.12)",
  },
);
