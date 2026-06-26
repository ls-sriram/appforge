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
  ImageVariant,
  SelectableChipVariant,
  TextAreaVariant,
  SelectVariant,
  MultiSelectVariant,
  LayoutContract,
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
  const pill = t.radii.pill;
  const full = t.radii.full;
  const { space, typography } = t.colors;
  const { radii } = t;

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
    paddingVertical: space.xs,
    paddingHorizontal: space.sm,
    fontSize: typography.sizes.xs,
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
    fontWeight: typography.weights.semibold,
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
        interaction: {
          disabledOpacity: 0.4,
          loading: { opacity: 0.7 },
          pressed: { opacity: 0.8, scale: 0.97 },
          hover: { opacity: 0.92 },
        },
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
        interaction: {
          disabledOpacity: 0.4,
          loading: { opacity: 0.7 },
          pressed: { opacity: 0.8, scale: 0.97 },
          hover: { opacity: 0.92 },
        },
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
        interaction: {
          disabledOpacity: 0.4,
          loading: { opacity: 0.7 },
          pressed: { opacity: 0.7 },
          hover: { borderColor: t.colors.borderHover },
        },
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
        interaction: {
          disabledOpacity: 0.35,
          loading: { opacity: 0.6 },
          pressed: { opacity: 0.6 },
          hover: { color: t.colors.textSecondary },
        },
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
        interaction: {
          disabledOpacity: 0.4,
          loading: { opacity: 0.7 },
          pressed: { opacity: 0.75, scale: 0.98 },
          hover: { opacity: 0.9 },
        },
      },
    } satisfies Record<string, ButtonVariant>,

    badge: {
      muted:   { ...badgeBase, backgroundColor: t.colors.surfaceAlt,   color: t.colors.textMuted, borderColor: t.colors.border,  interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
      success: { ...badgeBase, backgroundColor: t.colors.successMuted,  color: t.colors.success,   borderColor: t.colors.success, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
      warning: { ...badgeBase, backgroundColor: t.colors.warningMuted,  color: t.colors.warning,   borderColor: t.colors.warning, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
      danger:  { ...badgeBase, backgroundColor: t.colors.errorMuted,    color: t.colors.error,     borderColor: t.colors.error,   interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
      info:    { ...badgeBase, backgroundColor: t.colors.infoMuted,     color: t.colors.info,      borderColor: t.colors.info,    interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
    } satisfies Record<string, BadgeVariant>,

    tag: {
      muted:     { ...tagBase, backgroundColor: t.colors.surfaceWash,        color: t.colors.textMuted,     interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: t.colors.surfaceAlt,          color: t.colors.textPrimary  } } },
      secondary: { ...tagBase, backgroundColor: t.colors.surfaceWash,        color: t.colors.textSecondary, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: t.colors.surfaceAlt,          color: t.colors.textPrimary  } } },
      accent:    { ...tagBase, backgroundColor: t.colors.accentMuted,        color: t.colors.primary,       interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: t.colors.primary,             color: t.colors.textInverse  } } },
      action:    { ...tagBase, backgroundColor: t.colors.actionAccentMuted,  color: t.colors.actionAccent,  interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: t.colors.actionAccent,        color: t.colors.textInverse  } } },
      success:   { ...tagBase, backgroundColor: t.colors.successAccentMuted, color: t.colors.success,       interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: t.colors.success,             color: t.colors.textInverse  } } },
      warning:   { ...tagBase, backgroundColor: t.colors.warningMuted,       color: t.colors.warning,       interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: t.colors.warning,             color: t.colors.textInverse  } } },
      danger:    { ...tagBase, backgroundColor: t.colors.errorMuted,         color: t.colors.error,         interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: t.colors.error,               color: t.colors.textInverse  } } },
      info:      { ...tagBase, backgroundColor: t.colors.infoMuted,          color: t.colors.info,          interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: t.colors.info,                color: t.colors.textInverse  } } },
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
        placeholderColor: t.colors.textMuted,
        minHeight: 54,
        interaction: {
          disabledOpacity: 0.5,
          focused: { borderColor: t.colors.primary, borderWidth: 2 },
          hover: { borderColor: t.colors.borderHover },
        },
      },
    } satisfies Record<string, InputVariant>,

    avatar: {
      xs:    { ...avatarBase, width: 24,  height: 24,  fontSize: 10, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.93 } } },
      sm:    { ...avatarBase, width: 32,  height: 32,  fontSize: 12, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.93 } } },
      md:    { ...avatarBase, width: 40,  height: 40,  fontSize: 14, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.93 } } },
      lg:    { ...avatarBase, width: 56,  height: 56,  fontSize: 20, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.95 } } },
      xl:    { ...avatarBase, width: 80,  height: 80,  fontSize: 28, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.96 } } },
      "2xl": { ...avatarBase, width: 120, height: 120, fontSize: 42, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.97 } } },
    } satisfies Record<string, AvatarVariant>,

    image: {
      thumbnail: { width: 32, height: 32, borderRadius: radii.sm },
      card: { width: 40, height: 40, borderRadius: radii.md },
      hero: { width: 56, height: 56, borderRadius: radii.md },
    } satisfies Record<string, ImageVariant>,

    progressBar: {
      primary: { ...progressBarBase, fillColor: t.colors.primary },
      success: { ...progressBarBase, fillColor: t.colors.success },
      warning: { ...progressBarBase, fillColor: t.colors.warning },
      danger:  { ...progressBarBase, fillColor: t.colors.error   },
    } satisfies Record<string, ProgressBarVariant>,

    selectableChip: {
      sm: {
        backgroundColor: t.colors.surfaceAlt,
        borderColor: t.colors.border,
        borderWidth: 1,
        color: t.colors.textSecondary,
        paddingVertical: space.xs,
        paddingHorizontal: space.sm + 2,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.regular,
        interaction: {
          disabledOpacity: 0.5,
          pressed: { opacity: 0.75 },
          selected: { backgroundColor: t.colors.textPrimary, borderColor: t.colors.textPrimary, color: t.colors.textInverse, fontWeight: typography.weights.semibold },
        },
      },
      md: {
        backgroundColor: t.colors.surfaceAlt,
        borderColor: t.colors.border,
        borderWidth: 1,
        color: t.colors.textSecondary,
        paddingVertical: 7,
        paddingHorizontal: 14,
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.regular,
        interaction: {
          disabledOpacity: 0.5,
          pressed: { opacity: 0.75 },
          selected: { backgroundColor: t.colors.textPrimary, borderColor: t.colors.textPrimary, color: t.colors.textInverse, fontWeight: typography.weights.semibold },
        },
      },
    } satisfies Record<string, SelectableChipVariant>,

    textArea: {
      default: {
        backgroundColor: t.colors.surfaceAlt,
        color: t.colors.textPrimary,
        borderWidth: 1,
        borderColor: t.colors.border,
        borderRadius: radii.md,
        paddingVertical: space.md,
        paddingHorizontal: space.md,
        fontSize: typography.sizes.md,
        minHeight: 120,
        placeholderColor: t.colors.textMuted,
        interaction: {
          disabledOpacity: 0.5,
          focused: { borderColor: t.colors.primary, borderWidth: 2 },
        },
      },
    } satisfies Record<string, TextAreaVariant>,

    select: {
      default: {
        backgroundColor: t.colors.surfaceAlt,
        borderColor: t.colors.border,
        borderWidth: 1,
        borderRadius: pill,
        minHeight: 54,
        paddingVertical: space.md,
        paddingHorizontal: space.md,
        color: t.colors.textPrimary,
        placeholderColor: t.colors.textMuted,
        menuBackgroundColor: t.colors.surfaceStrong,
        menuBorderColor: t.colors.borderSubtle,
        menuBorderRadius: radii.md,
        optionSelectedBackgroundColor: t.colors.primaryMuted,
        optionSelectedColor: t.colors.primary,
        optionColor: t.colors.textPrimary,
        optionFontSize: typography.sizes.md,
        fieldGap: 8,
        triggerGap: space.sm + 2,
        optionRowGap: space.xxs,
        optionFontWeight: typography.weights.regular,
        optionSelectedFontWeight: typography.weights.medium,
        optionDescriptionFontSize: typography.sizes.sm,
        interaction: {
          disabledOpacity: 0.5,
          hover: { borderColor: t.colors.borderHover },
          focused: { borderColor: t.colors.primary, borderWidth: 2 },
        },
      },
    } satisfies Record<string, SelectVariant>,

    multiSelect: {
      default: {
        backgroundColor: t.colors.surfaceAlt,
        borderColor: t.colors.border,
        borderWidth: 1,
        borderRadius: radii.md,
        minHeight: 54,
        paddingVertical: space.md,
        paddingHorizontal: space.md,
        color: t.colors.textPrimary,
        placeholderColor: t.colors.textMuted,
        menuBackgroundColor: t.colors.surfaceStrong,
        menuBorderColor: t.colors.borderSubtle,
        menuBorderRadius: radii.md,
        optionSelectedBackgroundColor: t.colors.primaryMuted,
        optionSelectedColor: t.colors.primary,
        optionColor: t.colors.textPrimary,
        optionFontSize: typography.sizes.md,
        fieldGap: 8,
        triggerGap: space.sm + 2,
        optionRowGap: space.xxs,
        optionFontWeight: typography.weights.regular,
        optionSelectedFontWeight: typography.weights.medium,
        optionDescriptionFontSize: typography.sizes.sm,
        tokenBackgroundColor: t.colors.primaryMuted,
        tokenColor: t.colors.primary,
        tokenBorderRadius: pill,
        tokenPaddingVertical: space.xs,
        tokenPaddingHorizontal: space.sm,
        tokenFontWeight: typography.weights.medium,
        tokenFontSize: typography.sizes.sm,
        interaction: {
          disabledOpacity: 0.5,
          hover: { borderColor: t.colors.borderHover },
        },
      },
    } satisfies Record<string, MultiSelectVariant>,
  };
}

export function createLayouts(t: Tokens): Record<string, LayoutContract> {
  const { space, typography } = t.colors;
  return {
    compact: {
      controlHeight: 28,
      rowHeight: 32,
      rowPadding: space.xs,
      cellGap: space.sm,
      panelPadding: space.xs,
      sectionGap: space.sm + 2,
      itemGap: space.xs,
      iconSize: 14,
      fontSize: typography.sizes.sm,
      labelSize: typography.sizes.xs,
    },
    comfortable: {
      controlHeight: 36,
      rowHeight: 40,
      rowPadding: space.sm,
      cellGap: space.sm,
      panelPadding: space.md,
      sectionGap: space.lg - 2,
      itemGap: space.sm,
      iconSize: 16,
      fontSize: typography.sizes.md,
      labelSize: typography.sizes.sm,
    },
    spacious: {
      controlHeight: 48,
      rowHeight: 56,
      rowPadding: space.md,
      cellGap: space.md,
      panelPadding: space.lg + 2,
      sectionGap: space.xl,
      itemGap: space.md,
      iconSize: 20,
      fontSize: typography.sizes.md,
      labelSize: typography.sizes.sm,
    },
  };
}

export type Theme = typeof tokens & { variants: Variants; layouts: Record<string, LayoutContract> };

export const theme: Theme = {
  ...tokens,
  variants: createVariants(tokens),
  layouts: createLayouts(tokens),
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
    layouts: createLayouts(nextTokens),
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
