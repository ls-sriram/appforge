/**
 * ─────────────────────────────────────────────────────────────────
 * THEME — Generated from factory.
 *
 * To change the look of this app, edit the brand colors below.
 * For a completely different app, call createTheme() with a new palette.
 * ─────────────────────────────────────────────────────────────────
 */

import { createTheme } from "./factory";
import type { DeepPartial, ThemeDefinition, ThemeOverride } from "./contracts";

// ─── This App's Brand ──────────────────────────────────────────────
// Change these to rebrand. Every other color is derived from them.

const BRAND = {
  primary: "#4F8EF7",
  primaryHover: "#3B7CF6",
  success: "#34D399",
  warning: "#F59E0B",
  error: "#F87171",
  info: "#22D3EE",
};

export const defaultBrand = BRAND;

// ─── Generated Theme ───────────────────────────────────────────────
// Base from factory (dark: true generates structure), then override
// surface/text colors with a true near-black canvas.

const _base = createTheme({
  brand: BRAND,
  dark: true,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  radiusScale: 1.45,
});

export const tokens = {
  ..._base,
  colors: {
    ..._base.colors,
    bg:            "#0A0A0A",
    surface:       "#111111",
    surfaceAlt:    "#191919",
    surfaceStrong: "#161616",
    surfaceMuted:  "#111111",
    surfaceInset:  "#0C0C0C",
    surfaceWash:   "#161616",
    border:        "rgba(255,255,255,0.08)",
    borderSubtle:  "rgba(255,255,255,0.06)",
    borderHover:   "rgba(255,255,255,0.14)",
    borderLight:   "rgba(255,255,255,0.10)",
    textPrimary:   "#F2F2F2",
    textSecondary: "#A3A3A3",
    textMuted:     "#525252",
    textTertiary:  "#666666",
    textQuaternary:"#3A3A3A",
    textInverse:   "#0A0A0A",
  },
} as ReturnType<typeof createTheme>;

type Tokens = ThemeDefinition;

// ─── Re-exports for backwards compatibility ────────────────────────

export const { colors } = tokens;

// ─── Semantic builders (shapes from any token set) ──────────────────
// Extracted so per-app themes can re-derive component shapes from
// their own (e.g. dark/branded) color tokens instead of inheriting the
// default light palette. `createAppTheme()` below consumes these.

function buildShapes(tokens: Tokens) {
  return {
  button: {
    primary: {
      backgroundColor: tokens.colors.primary,
      color: tokens.colors.textInverse,
      borderRadius: tokens.colors.radii.pill,
      paddingVertical: tokens.colors.space.sm,
      paddingHorizontal: tokens.colors.space.lg,
      fontSize: tokens.colors.typography.sizes.md,
      fontWeight: tokens.colors.typography.weights.semibold,
      shadow: "none",
    },
    primaryLg: {
      backgroundColor: tokens.colors.primary,
      color: tokens.colors.textInverse,
      borderRadius: tokens.colors.radii.pill,
      paddingVertical: tokens.colors.space.md,
      paddingHorizontal: tokens.colors.space.xl,
      fontSize: tokens.colors.typography.sizes.md,
      fontWeight: tokens.colors.typography.weights.semibold,
      shadow: "none",
    },
    secondary: {
      backgroundColor: tokens.colors.surfaceAlt,
      color: tokens.colors.textPrimary,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      borderRadius: tokens.colors.radii.pill,
      paddingVertical: tokens.colors.space.sm,
      paddingHorizontal: tokens.colors.space.md,
      fontSize: tokens.colors.typography.sizes.sm,
      fontWeight: tokens.colors.typography.weights.medium,
    },
    ghost: {
      backgroundColor: "transparent",
      color: tokens.colors.textMuted,
      paddingVertical: tokens.colors.space.sm,
      paddingHorizontal: tokens.colors.space.sm,
      fontSize: tokens.colors.typography.sizes.sm,
      fontWeight: tokens.colors.typography.weights.medium,
      borderRadius: tokens.colors.radii.pill,
    },
    danger: {
      backgroundColor: tokens.colors.errorMuted,
      color: tokens.colors.error,
      borderRadius: tokens.colors.radii.md,
      paddingVertical: tokens.colors.space.md,
      paddingHorizontal: tokens.colors.space.xl,
      fontSize: tokens.colors.typography.sizes.md,
      fontWeight: tokens.colors.typography.weights.semibold,
      borderWidth: 1,
      borderColor: tokens.colors.error,
    },
  },

  input: {
    default: {
      backgroundColor: tokens.colors.surfaceAlt,
      color: tokens.colors.textPrimary,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      borderRadius: tokens.colors.radii.md,
      paddingVertical: tokens.colors.space.md,
      paddingHorizontal: tokens.colors.space.md,
      fontSize: tokens.colors.typography.sizes.md,
      fontFamily: tokens.colors.typography.fontFamily,
    },
    focus: {
      borderColor: tokens.colors.borderFocus,
      borderWidth: 1.5,
      shadow: `0 0 0 3px ${tokens.colors.primaryMuted}`,
    },
    error: {
      borderColor: tokens.colors.error,
      borderWidth: 1.5,
    },
    lg: {
      paddingVertical: tokens.colors.space.lg,
      paddingHorizontal: tokens.colors.space.lg,
      fontSize: tokens.colors.typography.sizes.lg,
      borderRadius: tokens.colors.radii.lg,
    },
  },

  card: {
    backgroundColor: tokens.colors.surfaceStrong,
    borderRadius: tokens.colors.radii.xl,
    padding: tokens.colors.space.md,
    shadow: tokens.colors.shadowLg,
    borderWidth: 1,
    borderColor: tokens.colors.borderSubtle,
  },
  cardInteractive: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.colors.radii.xl,
    padding: tokens.colors.space.md,
    shadow: tokens.colors.shadowLg,
    borderWidth: 1,
    borderColor: tokens.colors.borderHover,
  },

  avatar: {
    xs: { width: 24, height: 24, borderRadius: tokens.colors.radii.full, fontSize: 10 },
    sm: { width: 32, height: 32, borderRadius: tokens.colors.radii.full, fontSize: 12 },
    md: { width: 40, height: 40, borderRadius: tokens.colors.radii.full, fontSize: 14 },
    lg: { width: 56, height: 56, borderRadius: tokens.colors.radii.full, fontSize: 20 },
    xl: { width: 80, height: 80, borderRadius: tokens.colors.radii.full, fontSize: 28 },
    xl2: { width: 120, height: 120, borderRadius: tokens.colors.radii.full, fontSize: 42 },
  },

  badge: {
    default: {
      backgroundColor: tokens.colors.primaryMuted,
      color: tokens.colors.primary,
      borderRadius: tokens.colors.radii.full,
      paddingVertical: tokens.colors.space.xs,
      paddingHorizontal: tokens.colors.space.sm,
      fontSize: tokens.colors.typography.sizes.xs,
      fontWeight: tokens.colors.typography.weights.semibold,
    },
    success: {
      backgroundColor: tokens.colors.successMuted,
      color: tokens.colors.success,
      borderRadius: tokens.colors.radii.full,
      paddingVertical: tokens.colors.space.xs,
      paddingHorizontal: tokens.colors.space.sm,
      fontSize: tokens.colors.typography.sizes.xs,
      fontWeight: tokens.colors.typography.weights.semibold,
    },
    warning: {
      backgroundColor: tokens.colors.warningMuted,
      color: tokens.colors.warning,
      borderRadius: tokens.colors.radii.full,
      paddingVertical: tokens.colors.space.xs,
      paddingHorizontal: tokens.colors.space.sm,
      fontSize: tokens.colors.typography.sizes.xs,
      fontWeight: tokens.colors.typography.weights.semibold,
    },
    error: {
      backgroundColor: tokens.colors.errorMuted,
      color: tokens.colors.error,
      borderRadius: tokens.colors.radii.full,
      paddingVertical: tokens.colors.space.xs,
      paddingHorizontal: tokens.colors.space.sm,
      fontSize: tokens.colors.typography.sizes.xs,
      fontWeight: tokens.colors.typography.weights.semibold,
    },
    info: {
      backgroundColor: tokens.colors.infoMuted,
      color: tokens.colors.info,
      borderRadius: tokens.colors.radii.full,
      paddingVertical: tokens.colors.space.xs,
      paddingHorizontal: tokens.colors.space.sm,
      fontSize: tokens.colors.typography.sizes.xs,
      fontWeight: tokens.colors.typography.weights.semibold,
    },
  },

  tag: {
    backgroundColor: tokens.colors.surfaceAlt,
    color: tokens.colors.textSecondary,
    borderRadius: tokens.colors.radii.sm,
    paddingVertical: tokens.colors.space.xs,
    paddingHorizontal: tokens.colors.space.sm,
    fontSize: tokens.colors.typography.sizes.xs,
    fontWeight: tokens.colors.typography.weights.medium,
  },

  divider: {
    height: 1,
    backgroundColor: tokens.colors.border,
    marginVertical: tokens.colors.space.md,
  },

  skeleton: {
    backgroundColor: tokens.colors.surfaceAlt,
    borderRadius: tokens.colors.radii.sm,
  },
  } as const;
}

export const shapes = buildShapes(tokens);

export type Theme = typeof tokens & {
  shapes: ReturnType<typeof buildShapes>;
};

export const theme: Theme = {
  ...tokens,
  shapes,
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeDefined<T>(base: T, override?: DeepPartial<T>): T {
  if (override === undefined) return base;

  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override as T;
  }

  const merged: Record<string, unknown> = { ...base as Record<string, unknown> };
  const overrideRecord = override as Record<string, unknown>;

  for (const key of Object.keys(overrideRecord)) {
    const overrideValue = overrideRecord[key];
    if (overrideValue === undefined) continue;
    const baseValue = merged[key];
    merged[key] = isPlainObject(baseValue) && isPlainObject(overrideValue)
      ? mergeDefined(baseValue, overrideValue as DeepPartial<typeof baseValue>)
      : overrideValue;
  }

  return merged as T;
}

function buildThemeFromTokens(nextTokens: Tokens): Theme {
  const nextShapes = buildShapes(nextTokens);
  return {
    ...nextTokens,
    shapes: nextShapes,
  };
}

export function applyThemeOverride(baseTheme: Theme, override?: ThemeOverride): Theme {
  if (!override?.colors) return baseTheme;

  const nextTokens: Tokens = {
    ...baseTheme,
    colors: mergeDefined(baseTheme.colors, override.colors),
  };

  return buildThemeFromTokens(nextTokens);
}

// ─── Per-app theming ───────────────────────────────────────────────
// Build a complete Theme from brand options plus optional raw color
// overrides (e.g. a true dark palette). Component shapes are
// re-derived from the overridden tokens, so Buttons/Badges/Panels all
// recolor correctly — this is the "edit design globally" primitive.

export function createAppTheme(
  options: Parameters<typeof createTheme>[0],
  override?: ThemeOverride,
): Theme {
  const base = createTheme(options);
  return applyThemeOverride(buildThemeFromTokens(base), override);
}

export { createTheme } from "./factory";
export type {
  ThemeColorDefinition,
  ThemeColorOverride,
  ThemeDefinition,
  ThemeOverride,
} from "./contracts";
