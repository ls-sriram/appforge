/**
 * ─────────────────────────────────────────────────────────────────
 * THEME FACTORY — createTheme() for per-app theming.
 *
 * Instead of a single hardcoded theme, apps define their brand
 * colors and the factory generates the full design system.
 * ─────────────────────────────────────────────────────────────────
 */
import type { TextStyle } from "react-native";

/** Brand palette — the minimum an app needs to define. */
export interface BrandColors {
  /** Primary action / brand color */
  primary: string;
  /** Primary hover state */
  primaryHover?: string;
  /** Success color (defaults to green if not provided) */
  success?: string;
  /** Warning color (defaults to amber if not provided) */
  warning?: string;
  /** Error color (defaults to rose if not provided) */
  error?: string;
  /** Info color (defaults to sky if not provided) */
  info?: string;
}

/** App-level theme options. */
export interface ThemeOptions {
  brand: BrandColors;
  /** Dark mode toggle (default: true) */
  dark?: boolean;
  /** Custom font family (default: Inter) */
  fontFamily?: string;
  /** Border radius multiplier (default: 1) */
  radiusScale?: number;
}

/** Complete generated theme object. */
export interface Theme {
  colors: {
    primary: string;
    primaryHover: string;
    primaryMuted: string;
    primaryGlow: string;
    success: string;
    successMuted: string;
    warning: string;
    warningMuted: string;
    error: string;
    errorMuted: string;
    info: string;
    infoMuted: string;
    accent: string;
    accentMuted: string;
    accentHover: string;
    alertAccent: string;
    alertAccentMuted: string;
    successAccent: string;
    successAccentMuted: string;
    actionAccent: string;
    actionAccentMuted: string;
    bg: string;
    surface: string;
    surfaceAlt: string;
    surfaceStrong: string;
    surfaceMuted: string;
    surfaceInset: string;
    surfaceWash: string;
    border: string;
    borderSubtle: string;
    borderHover: string;
    borderLight: string;
    borderFocus: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textTertiary: string;
    textQuaternary: string;
    textInverse: string;
    textLink: string;
    shadowSm: string;
    shadowMd: string;
    shadowLg: string;
    shadowXl: string;
    glowSm: string;
    glowMd: string;
    state: {
      hover: string;
      pressed: string;
      selected: string;
      rowHover: string;
      rowSelected: string;
      disabled: string;
    };
    elevation: {
      tier1: string;
      tier2: string;
      tier3: string;
    };
    space: {
      xxs: number;
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      "2xl": number;
      "3xl": number;
    };
    radii: {
      none: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      pill: number;
      full: number;
    };
    typography: {
      fontFamily: string;
      fontFamilyMono: string;
      sizes: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        "2xl": number;
        "3xl": number;
      };
      roles: {
        pageTitle: number;
        displayLg: number;
        displaySm: number;
        tableHeader: number;
        statLabel: number;
        statValue: number;
        numericLg: number;
        action: number;
      };
      weights: {
        regular: NonNullable<TextStyle["fontWeight"]>;
        medium: NonNullable<TextStyle["fontWeight"]>;
        semibold: NonNullable<TextStyle["fontWeight"]>;
        bold: NonNullable<TextStyle["fontWeight"]>;
        extrabold: NonNullable<TextStyle["fontWeight"]>;
      };
      lineHeights: {
        tight: number;
        normal: number;
        relaxed: number;
      };
      letterSpacing: {
        tight: number;
        normal: number;
        wide: number;
      };
    };
    breakpoints: {
      mobile: number;
      tablet: number;
      desktop: number;
      wide: number;
    };
    layout: {
      maxContentWidth: number;
      maxPageWidth: number;
      pagePadding: number;
      headerHeight: number;
    };
  };
}

// ─── Color Utilities ─────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function darken(hex: string, amount: number): string {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, r - Math.round(r * amount));
  g = Math.max(0, g - Math.round(g * amount));
  b = Math.max(0, b - Math.round(b * amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// ─── Factory ─────────────────────────────────────────────────────────────

export function createTheme(options: ThemeOptions): Theme {
  const { brand, dark = false, fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", radiusScale = 1 } = options;

  const primary = brand.primary;
  const primaryHover = brand.primaryHover ?? darken(primary, 0.1);
  const primaryMuted = hexToRgba(primary, 0.15);
  const primaryGlow = hexToRgba(primary, 0.25);
  const success = brand.success ?? "#10B981";
  const warning = brand.warning ?? "#F59E0B";
  const error = brand.error ?? "#F43F5E";
  const info = brand.info ?? "#0EA5E9";
  const alertAccent = error;
  const successAccent = success;
  const actionAccent = primary;
  const accent = primaryHover;

  const base = dark
    ? {
        bg: "#F5F8FF" as const,
        surface: "#FFFFFF" as const,
        surfaceAlt: "#F3F7FF" as const,
        surfaceStrong: "#FFFFFF" as const,
        surfaceMuted: "#EEF4FF" as const,
        surfaceInset: "#E8F0FF" as const,
        surfaceWash: "#DCE9FF" as const,
        border: "rgba(37,99,235,0.12)" as const,
        borderSubtle: "rgba(37,99,235,0.08)" as const,
        borderHover: "rgba(37,99,235,0.18)" as const,
        borderLight: "rgba(37,99,235,0.24)" as const,
        textPrimary: "#0F172A" as const,
        textSecondary: "#334155" as const,
        textMuted: "#64748B" as const,
        textTertiary: "#94A3B8" as const,
        textQuaternary: "#CBD5E1" as const,
        textInverse: "#FFFFFF" as const,
        shadowSm: "0 1px 2px rgba(15,23,42,0.06)",
        shadowMd: "0 6px 16px rgba(15,23,42,0.08)",
        shadowLg: "0 14px 30px rgba(15,23,42,0.12)",
        shadowXl: "0 24px 52px rgba(15,23,42,0.16)",
        glowSm: `0 0 8px ${primaryGlow}`,
        glowMd: `0 0 16px ${primaryGlow}`,
        state: {
          hover: "rgba(37,99,235,0.05)",
          pressed: "rgba(37,99,235,0.12)",
          selected: hexToRgba(accent, 0.12),
          rowHover: "rgba(37,99,235,0.03)",
          rowSelected: "rgba(124,58,237,0.08)",
          disabled: "rgba(15,23,42,0.24)",
        },
        elevation: {
          tier1: "0 2px 10px rgba(15,23,42,0.06)",
          tier2: "0 10px 24px rgba(15,23,42,0.09)",
          tier3: "0 18px 40px rgba(15,23,42,0.14)",
        },
      }
    : {
        bg: "#FAFAFA" as const,
        surface: "#FFFFFF" as const,
        surfaceAlt: "#F5F5F5" as const,
        surfaceStrong: "#FFFFFF" as const,
        surfaceMuted: "#F5F5F5" as const,
        surfaceInset: "#FFFFFF" as const,
        surfaceWash: "#F4F4F0" as const,
        border: "#E5E5E5" as const,
        borderSubtle: "#E5E5E5" as const,
        borderHover: "rgba(0,0,0,0.12)" as const,
        borderLight: "#D4D4D4" as const,
        textPrimary: "#171717" as const,
        textSecondary: "#525252" as const,
        textMuted: "#A3A3A3" as const,
        textTertiary: "#737373" as const,
        textQuaternary: "#D4D4D4" as const,
        textInverse: "#FFFFFF" as const,
        shadowSm: "0 1px 2px rgba(0,0,0,0.03)",
        shadowMd: "0 2px 8px rgba(0,0,0,0.05)",
        shadowLg: "0 8px 24px rgba(0,0,0,0.06)",
        shadowXl: "0 16px 48px rgba(0,0,0,0.08)",
        glowSm: `0 0 4px ${primaryMuted}`,
        glowMd: `0 0 8px ${primaryMuted}`,
        state: {
          hover: "rgba(0,0,0,0.03)",
          pressed: "rgba(0,0,0,0.08)",
          selected: hexToRgba(accent, 0.1),
          rowHover: "rgba(0,0,0,0.025)",
          rowSelected: hexToRgba(accent, 0.08),
          disabled: "rgba(0,0,0,0.15)",
        },
        elevation: {
          tier1: "0 2px 8px rgba(0,0,0,0.06)",
          tier2: "0 10px 26px rgba(0,0,0,0.1)",
          tier3: "0 18px 42px rgba(0,0,0,0.14)",
        },
      };

  return {
    colors: {
      primary,
      primaryHover,
      primaryMuted,
      primaryGlow,
      success,
      successMuted: hexToRgba(success, 0.12),
      warning,
      warningMuted: hexToRgba(warning, 0.12),
      error,
      errorMuted: hexToRgba(error, 0.12),
      info,
      infoMuted: hexToRgba(info, 0.12),
      accent,
      accentMuted: hexToRgba(accent, 0.12),
      accentHover: hexToRgba(accent, 0.18),
      alertAccent,
      alertAccentMuted: hexToRgba(alertAccent, 0.12),
      successAccent,
      successAccentMuted: hexToRgba(successAccent, 0.12),
      actionAccent,
      actionAccentMuted: hexToRgba(actionAccent, 0.12),
      ...base,
      borderFocus: primary,
      textLink: actionAccent,
      space: {
        xxs: 4,
        xs: 6,
        sm: 10,
        md: 16,
        lg: 22,
        xl: 30,
        "2xl": 44,
        "3xl": 64,
      },
      radii: {
        none: 0,
        sm: Math.round(6 * radiusScale),
        md: Math.round(10 * radiusScale),
        lg: Math.round(14 * radiusScale),
        xl: Math.round(20 * radiusScale),
        pill: 9999,
        full: 9999,
      },
      typography: {
        fontFamily,
        fontFamilyMono: "'SF Mono', 'JetBrains Mono', monospace",
        sizes: {
          xs: 11,
          sm: 13,
          md: 15,
          lg: 18,
          xl: 24,
          "2xl": 32,
          "3xl": 42,
        },
        roles: {
          pageTitle: 26,
          displayLg: 17,
          displaySm: 13,
          tableHeader: 11,
          statLabel: 11,
          statValue: 16,
          numericLg: 22,
          action: 13,
        },
        weights: {
          regular: "500",
          medium: "600",
          semibold: "700",
          bold: "800",
          extrabold: "900",
        },
        lineHeights: {
          tight: 1.15,
          normal: 1.5,
          relaxed: 1.65,
        },
        letterSpacing: {
          tight: -0.3,
          normal: 0,
          wide: 0.3,
        },
      },
      breakpoints: {
        mobile: 0,
        tablet: 768,
        desktop: 1024,
        wide: 1440,
      },
      layout: {
        maxContentWidth: 440,
        maxPageWidth: 960,
        pagePadding: 24,
        headerHeight: 56,
      },
    },
  };
}
