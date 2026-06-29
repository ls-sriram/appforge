import { createTheme, createContracts, createLayouts } from "./factory";
import type { UiRuntime } from "./runtime";

const BRAND = {
  primary: "#4F8EF7",
  success: "#34D399",
  warning: "#F59E0B",
  error: "#F87171",
  info: "#22D3EE",
};

export const defaultBrand = BRAND;

const baseTheme = createTheme({
  brand: BRAND,
  dark: true,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  radiusScale: 1.45,
});

export const tokens = {
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    background: "#0A0A0A",
    surface: "#111111",
    surfaceAlt: "#191919",
    border: "rgba(255,255,255,0.08)",
    textPrimary: "#F2F2F2",
    textSecondary: "#A3A3A3",
    textMuted: "#525252",
    textInverse: "#0A0A0A",
  },
} as ReturnType<typeof createTheme>;

export const { palette } = tokens;

export const defaultLayouts = createLayouts(tokens);

export const platformLayoutDefaults = defaultLayouts;

export const defaultContracts = createContracts(tokens);

export const uiRuntime: UiRuntime = {
  theme: tokens,
  contracts: defaultContracts,
  layouts: defaultLayouts,
};

export const theme = uiRuntime;
