import type { TextStyle } from "react-native";

export interface BrandColors {
  primary: string;
  success?: string;
  warning?: string;
  error?: string;
  info?: string;
}

export interface ThemeOptions {
  brand: BrandColors;
  dark?: boolean;
  fontFamily?: string;
  radiusScale?: number;
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
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

// ─── Factory ─────────────────────────────────────────────────────────────

export function createTheme(options: ThemeOptions): Theme {
  const {
    brand,
    dark = false,
    fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
    radiusScale = 1,
  } = options;

  const primary = brand.primary;
  const success = brand.success ?? "#10B981";
  const warning = brand.warning ?? "#F59E0B";
  const error = brand.error ?? "#F43F5E";
  const info = brand.info ?? "#0EA5E9";

  const base = dark
    ? {
        background: "#F5F8FF" as const,
        surface: "#FFFFFF" as const,
        surfaceAlt: "#F3F7FF" as const,
        border: "rgba(37,99,235,0.12)" as const,
        textPrimary: "#0F172A" as const,
        textSecondary: "#334155" as const,
        textMuted: "#64748B" as const,
        textInverse: "#FFFFFF" as const,
      }
    : {
        background: "#FAFAFA" as const,
        surface: "#FFFFFF" as const,
        surfaceAlt: "#F5F5F5" as const,
        border: "#E5E5E5" as const,
        textPrimary: "#171717" as const,
        textSecondary: "#525252" as const,
        textMuted: "#A3A3A3" as const,
        textInverse: "#FFFFFF" as const,
      };

  return {
    palette: {
      primary,
      success,
      warning,
      error,
      info,
      ...base,
      borderFocus: primary,
    },
    spacing: {
      xs: 6,
      sm: 10,
      md: 16,
      lg: 22,
      xl: 30,
    },
    typography: {
      family: fontFamily,
      mono: "'SF Mono', 'JetBrains Mono', monospace",
      size: {
        xs: 11,
        sm: 13,
        md: 15,
        lg: 18,
        xl: 24,
        xxl: 32,
      },
      weight: {
        regular: "500",
        medium: "600",
        semibold: "700",
        bold: "800",
      },
    },
    radii: {
      sm: Math.round(6 * radiusScale),
      md: Math.round(10 * radiusScale),
      lg: Math.round(14 * radiusScale),
      xl: Math.round(20 * radiusScale),
      pill: 9999,
    },
    breakpoints: {
      mobile: 0,
      tablet: 768,
      desktop: 1024,
    },
  };
}
