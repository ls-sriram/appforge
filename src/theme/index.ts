/**
 * ─────────────────────────────────────────────────────────────────
 * THEME — Generated from factory.
 *
 * To change the look of this app, edit the brand colors below.
 * For a completely different app, call createTheme() with a new palette.
 * ─────────────────────────────────────────────────────────────────
 */

import { createTheme } from "./factory";

// ─── This App's Brand ──────────────────────────────────────────────
// Change these to rebrand. Every other color is derived from them.

const BRAND = {
  primary: "#2558D4",
  primaryHover: "#1D4ED8",
  success: "#237A49",
  warning: "#A8681A",
  error: "#C03228",
  info: "#0E7490",
};

// ─── Generated Theme ───────────────────────────────────────────────

export const tokens = createTheme({
  brand: BRAND,
  dark: false,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  radiusScale: 1.45,
});

// ─── Re-exports for backwards compatibility ────────────────────────

export const { colors } = tokens;

export const shapes = {
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
    "2xl": { width: 120, height: 120, borderRadius: tokens.colors.radii.full, fontSize: 42 },
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

export const surfaces = {
  authPage: {
    backgroundColor: tokens.colors.bg,
    minHeight: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: tokens.colors.space.lg,
  },
  card: shapes.card,
  contentMaxWidth: tokens.colors.layout.maxContentWidth,
  page: {
    backgroundColor: tokens.colors.bg,
    minHeight: "100%",
  },
  onboardingPage: {
    backgroundColor: tokens.colors.bg,
    minHeight: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: tokens.colors.space.xl,
  },
} as const;

export type Theme = typeof tokens & {
  shapes: typeof shapes;
  surfaces: typeof surfaces;
};

export const theme: Theme = {
  ...tokens,
  shapes,
  surfaces,
};

export { createTheme } from "./factory";
