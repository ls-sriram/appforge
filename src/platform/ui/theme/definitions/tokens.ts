import type { TextStyle } from "react-native";

export interface ElevationPreset {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation?: number;
}

export interface Theme {
  palette: {
    primary: string;
    /** Soft tint of primary for selected/hover fills. */
    primaryMuted: string;
    /** Secondary brand color for highlights that shouldn't read as actionable. */
    accent: string;
    success: string;
    successMuted: string;
    warning: string;
    warningMuted: string;
    error: string;
    errorMuted: string;
    info: string;
    infoMuted: string;
    background: string;
    surface: string;
    /** Raised surface between surface and surfaceAlt in contrast. */
    surfaceStrong: string;
    surfaceAlt: string;
    border: string;
    /** Hairline for low-emphasis separators. */
    borderSubtle: string;
    borderFocus: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textInverse: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    family: string;
    /** Display face for large headings; falls back to `family` when the app doesn't set one. */
    display: string;
    mono: string;
    size: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    weight: {
      regular: NonNullable<TextStyle["fontWeight"]>;
      medium: NonNullable<TextStyle["fontWeight"]>;
      semibold: NonNullable<TextStyle["fontWeight"]>;
      bold: NonNullable<TextStyle["fontWeight"]>;
    };
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
  };
  elevation: {
    none: ElevationPreset;
    sm: ElevationPreset;
    md: ElevationPreset;
    lg: ElevationPreset;
    xl: ElevationPreset;
  };
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export type ThemeDefinition = Theme;
export type ThemePaletteDefinition = Theme["palette"];
export type ThemeColorDefinition = ThemePaletteDefinition;
export type ThemeElevationOverride = Theme["elevation"];
