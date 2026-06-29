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
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    surfaceAlt: string;
    border: string;
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
