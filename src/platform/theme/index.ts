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
import type {
  Variants,
  ButtonVariant,
  BadgeVariant,
  TagVariant,
  InputVariant,
  AvatarVariant,
  ProgressBarVariant,
} from "../ui/contracts";

// ─── This App's Brand ──────────────────────────────────────────────

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

export const { colors } = tokens;

// ─── Default variant factory ───────────────────────────────────────
// Provides a fallback variant library derived from any token set.
// Apps merge their own variants on top:
//
//   const appVariants = {
//     ...createVariants(tokens),
//     button: { ...createVariants(tokens).button, meditate: { ... } },
//   };

export function createVariants(t: Tokens): Variants {
  const pill = t.colors.radii.pill;
  const full = t.colors.radii.full;
  const { space, typography, radii } = t.colors;

  const badgeBase = {
    borderRadius: full,
    paddingVertical: space.xs,
    paddingHorizontal: space.sm,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    borderWidth: 1,
  } satisfies Partial<BadgeVariant>;

  const tagBase = {
    borderRadius: pill,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: typography.weights.semibold,
  } satisfies Partial<TagVariant>;

  const progressBarBase = {
    trackColor: t.colors.surfaceAlt,
    height: 4,
    borderRadius: pill,
  } satisfies Partial<ProgressBarVariant>;

  const avatarBase = {
    borderRadius: full,
    backgroundColor: t.colors.primaryMuted,
    color: t.colors.primary,
  } satisfies Partial<AvatarVariant>;

  return {
    button: {
      primary: {
        backgroundColor: t.colors.primary,
        color: t.colors.textInverse,
        borderRadius: pill,
        paddingVertical: space.sm,
        paddingHorizontal: space.lg,
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        minHeight: 54,
      },
      primaryLg: {
        backgroundColor: t.colors.primary,
        color: t.colors.textInverse,
        borderRadius: pill,
        paddingVertical: space.md,
        paddingHorizontal: space.xl,
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        minHeight: 64,
      },
      secondary: {
        backgroundColor: t.colors.surfaceAlt,
        color: t.colors.textPrimary,
        borderWidth: 1,
        borderColor: t.colors.border,
        borderRadius: pill,
        paddingVertical: space.sm,
        paddingHorizontal: space.md,
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        minHeight: 36,
      },
      ghost: {
        backgroundColor: "transparent",
        color: t.colors.textMuted,
        borderRadius: pill,
        paddingVertical: space.sm,
        paddingHorizontal: space.sm,
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        minHeight: 36,
      },
      danger: {
        backgroundColor: t.colors.errorMuted,
        color: t.colors.error,
        borderWidth: 1,
        borderColor: t.colors.error,
        borderRadius: radii.md,
        paddingVertical: space.md,
        paddingHorizontal: space.xl,
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        minHeight: 54,
      },
    } satisfies Record<string, ButtonVariant>,

    badge: {
      muted:   { ...badgeBase, backgroundColor: t.colors.surfaceAlt,   color: t.colors.textMuted, borderColor: t.colors.border   },
      success: { ...badgeBase, backgroundColor: t.colors.successMuted,  color: t.colors.success,   borderColor: t.colors.success  },
      warning: { ...badgeBase, backgroundColor: t.colors.warningMuted,  color: t.colors.warning,   borderColor: t.colors.warning  },
      danger:  { ...badgeBase, backgroundColor: t.colors.errorMuted,    color: t.colors.error,     borderColor: t.colors.error    },
      info:    { ...badgeBase, backgroundColor: t.colors.infoMuted,     color: t.colors.info,      borderColor: t.colors.info     },
    } satisfies Record<string, BadgeVariant>,

    tag: {
      muted:     { ...tagBase, backgroundColor: t.colors.surfaceWash,         color: t.colors.textMuted     },
      secondary: { ...tagBase, backgroundColor: t.colors.surfaceWash,         color: t.colors.textSecondary },
      accent:    { ...tagBase, backgroundColor: t.colors.accentMuted,         color: t.colors.primary       },
      action:    { ...tagBase, backgroundColor: t.colors.actionAccentMuted,   color: t.colors.actionAccent  },
      success:   { ...tagBase, backgroundColor: t.colors.successAccentMuted,  color: t.colors.success       },
      warning:   { ...tagBase, backgroundColor: t.colors.warningMuted,        color: t.colors.warning       },
      danger:    { ...tagBase, backgroundColor: t.colors.errorMuted,          color: t.colors.error         },
      info:      { ...tagBase, backgroundColor: t.colors.infoMuted,           color: t.colors.info          },
    } satisfies Record<string, TagVariant>,

    input: {
      default: {
        backgroundColor: t.colors.surfaceAlt,
        color: t.colors.textPrimary,
        borderWidth: 1,
        borderColor: t.colors.border,
        borderRadius: pill,
        paddingVertical: space.md,
        paddingHorizontal: space.md,
        fontSize: typography.sizes.md,
        fontFamily: typography.fontFamily,
        placeholderColor: t.colors.textMuted,
      },
    } satisfies Record<string, InputVariant>,

    avatar: {
      xs:    { ...avatarBase, width: 24,  height: 24,  fontSize: 10 },
      sm:    { ...avatarBase, width: 32,  height: 32,  fontSize: 12 },
      md:    { ...avatarBase, width: 40,  height: 40,  fontSize: 14 },
      lg:    { ...avatarBase, width: 56,  height: 56,  fontSize: 20 },
      xl:    { ...avatarBase, width: 80,  height: 80,  fontSize: 28 },
      "2xl": { ...avatarBase, width: 120, height: 120, fontSize: 42 },
    } satisfies Record<string, AvatarVariant>,

    progressBar: {
      primary: { ...progressBarBase, fillColor: t.colors.primary },
      success: { ...progressBarBase, fillColor: t.colors.success },
      warning: { ...progressBarBase, fillColor: t.colors.warning },
      danger:  { ...progressBarBase, fillColor: t.colors.error   },
    } satisfies Record<string, ProgressBarVariant>,
  };
}

export type Theme = typeof tokens & { variants: Variants };

export const theme: Theme = {
  ...tokens,
  variants: createVariants(tokens),
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
  return {
    ...nextTokens,
    variants: createVariants(nextTokens),
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

export function createAppTheme(
  options: Parameters<typeof createTheme>[0],
  override?: ThemeOverride,
  variantOverrides?: Partial<Variants>,
): Theme {
  const base = createTheme(options);
  const withColors = applyThemeOverride(buildThemeFromTokens(base), override);
  if (!variantOverrides) return withColors;
  return {
    ...withColors,
    variants: { ...withColors.variants, ...variantOverrides },
  };
}

export { createTheme } from "./factory";
export type {
  ThemeColorDefinition,
  ThemeColorOverride,
  ThemeDefinition,
  ThemeOverride,
} from "./contracts";
