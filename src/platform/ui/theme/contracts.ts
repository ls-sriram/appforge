import type { Theme as GeneratedTheme } from "./factory";

export type ThemeDefinition = GeneratedTheme;
export type ThemePaletteDefinition = ThemeDefinition["palette"];

// Legacy aliases
export type ThemeColorDefinition = ThemePaletteDefinition;
export type ThemeElevationOverride = ThemeDefinition["elevation"];
