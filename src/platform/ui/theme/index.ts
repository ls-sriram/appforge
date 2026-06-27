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
  TableVariant,
  SelectableChipVariant,
  TextAreaVariant,
  SelectVariant,
  MultiSelectVariant,
  LayoutContract,
} from "../contracts";

// ─── This App's Brand ──────────────────────────────────────────────

const BRAND = {
  primary: "#4F8EF7",
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
  palette: {
    ..._base.palette,
    background:    "#0A0A0A",
    surface:       "#111111",
    surfaceAlt:    "#191919",
    border:        "rgba(255,255,255,0.08)",
    textPrimary:   "#F2F2F2",
    textSecondary: "#A3A3A3",
    textMuted:     "#525252",
    textInverse:   "#0A0A0A",
  },
} as ReturnType<typeof createTheme>;

type Tokens = ThemeDefinition;

export const { palette } = tokens;

// ─── Color derivation ──────────────────────────────────────────────

function alpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// ─── Local size constants ───────────────────────────────────────────
// Control heights and track sizes that live outside the spacing scale.

const CONTROL_H = { sm: 36, md: 54, lg: 64 } as const;
const TRACK_H   = 4;   // progress bar / thin divider track
const GAP       = { tight: 4, xs: 8 } as const;

// ─── Default variant factory ───────────────────────────────────────

export function createVariants(t: Tokens): Variants {
  const { spacing, typography, radii } = t;
  const { pill } = radii;
  const p = t.palette;

  const primaryMuted = alpha(p.primary, 0.12);
  const errorMuted   = alpha(p.error,   0.12);
  const successMuted = alpha(p.success, 0.12);
  const warningMuted = alpha(p.warning, 0.12);
  const infoMuted    = alpha(p.info,    0.12);

  const badgeBase = {
    borderRadius: pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    borderWidth: 1,
  } satisfies Partial<BadgeVariant>;

  const tagBase = {
    borderRadius: pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
  } satisfies Partial<TagVariant>;

  const progressBarBase = {
    trackColor: p.surfaceAlt,
    height: TRACK_H,
    borderRadius: pill,
  } satisfies Partial<ProgressBarVariant>;

  const avatarBase = {
    borderRadius: pill,
    backgroundColor: primaryMuted,
    color: p.primary,
    fontWeight: typography.weight.semibold,
  } satisfies Partial<AvatarVariant>;

  return {
    button: {
      primary: {
        backgroundColor: p.primary,
        color: p.textInverse,
        borderRadius: pill,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        fontSize: typography.size.md,
        fontWeight: typography.weight.semibold,
        minHeight: CONTROL_H.md,
        interaction: {
          disabledOpacity: 0.4,
          loading: { opacity: 0.7 },
          pressed: { opacity: 0.8, scale: 0.97 },
          hover: { opacity: 0.92 },
        },
      },
      secondary: {
        backgroundColor: p.surfaceAlt,
        color: p.textPrimary,
        borderWidth: 1,
        borderColor: p.border,
        borderRadius: pill,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.medium,
        minHeight: CONTROL_H.sm,
        interaction: {
          disabledOpacity: 0.4,
          loading: { opacity: 0.7 },
          pressed: { opacity: 0.7 },
          hover: { borderColor: p.border },
        },
      },
      ghost: {
        backgroundColor: "transparent",
        color: p.textMuted,
        borderRadius: pill,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.medium,
        minHeight: CONTROL_H.sm,
        interaction: {
          disabledOpacity: 0.35,
          loading: { opacity: 0.6 },
          pressed: { opacity: 0.6 },
          hover: { color: p.textSecondary },
        },
      },
      danger: {
        backgroundColor: errorMuted,
        color: p.error,
        borderWidth: 1,
        borderColor: p.error,
        borderRadius: radii.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        fontSize: typography.size.md,
        fontWeight: typography.weight.semibold,
        minHeight: CONTROL_H.md,
        interaction: {
          disabledOpacity: 0.4,
          loading: { opacity: 0.7 },
          pressed: { opacity: 0.75, scale: 0.98 },
          hover: { opacity: 0.9 },
        },
      },
    } satisfies Record<string, ButtonVariant>,

    badge: {
      muted:   { ...badgeBase, backgroundColor: p.surfaceAlt,  color: p.textMuted,  borderColor: p.border,   interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
      success: { ...badgeBase, backgroundColor: successMuted,  color: p.success,    borderColor: p.success,  interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
      warning: { ...badgeBase, backgroundColor: warningMuted,  color: p.warning,    borderColor: p.warning,  interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
      danger:  { ...badgeBase, backgroundColor: errorMuted,    color: p.error,      borderColor: p.error,    interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
      info:    { ...badgeBase, backgroundColor: infoMuted,     color: p.info,       borderColor: p.info,     interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
    } satisfies Record<string, BadgeVariant>,

    tag: {
      muted:     { ...tagBase, backgroundColor: p.surfaceAlt,  color: p.textMuted,      interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.surfaceAlt, color: p.textPrimary  } } },
      secondary: { ...tagBase, backgroundColor: p.surfaceAlt,  color: p.textSecondary,  interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.surfaceAlt, color: p.textPrimary  } } },
      accent:    { ...tagBase, backgroundColor: primaryMuted,  color: p.primary,        interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.primary,    color: p.textInverse  } } },
      success:   { ...tagBase, backgroundColor: successMuted,  color: p.success,        interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.success,    color: p.textInverse  } } },
      warning:   { ...tagBase, backgroundColor: warningMuted,  color: p.warning,        interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.warning,    color: p.textInverse  } } },
      danger:    { ...tagBase, backgroundColor: errorMuted,    color: p.error,          interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.error,      color: p.textInverse  } } },
      info:      { ...tagBase, backgroundColor: infoMuted,     color: p.info,           interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.info,       color: p.textInverse  } } },
    } satisfies Record<string, TagVariant>,

    input: {
      default: {
        backgroundColor: p.surfaceAlt,
        color: p.textPrimary,
        borderWidth: 1,
        borderColor: p.border,
        borderRadius: pill,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        fontSize: typography.size.md,
        placeholderColor: p.textMuted,
        minHeight: CONTROL_H.md,
        interaction: {
          disabledOpacity: 0.5,
          focused: { borderColor: p.borderFocus, borderWidth: 2 },
          hover: { borderColor: p.border },
        },
      },
    } satisfies Record<string, InputVariant>,

    // Size-based: sm=32, md=40, lg=56, xl=80
    avatar: {
      sm: { ...avatarBase, width: 32,  height: 32,  fontSize: typography.size.xs,  interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.93 } } },
      md: { ...avatarBase, width: 40,  height: 40,  fontSize: typography.size.sm,  interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.93 } } },
      lg: { ...avatarBase, width: 56,  height: 56,  fontSize: typography.size.lg,  interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.95 } } },
      xl: { ...avatarBase, width: 80,  height: 80,  fontSize: typography.size.xl,  interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.96 } } },
    } satisfies Record<string, AvatarVariant>,

    image: {
      thumbnail: { width: 32, height: 32, borderRadius: radii.sm },
      card:      { width: 40, height: 40, borderRadius: radii.md },
      hero:      { width: 56, height: 56, borderRadius: radii.md },
    } satisfies Record<string, ImageVariant>,

    table: {
      default: {
        backgroundColor: p.surface,
        headerBackgroundColor: p.surface,
        borderColor: p.border,
        borderWidth: 1,
        borderRadius: radii.md,
        emptyPadding: spacing.md,
        contentPaddingHorizontal: spacing.md,
        headerPaddingVertical: spacing.sm,
        headerGap: spacing.sm,
        dividerWidth: 1,
        stripedRowBackgroundColor: p.surfaceAlt,
      },
    } satisfies Record<string, TableVariant>,

    progressBar: {
      primary: { ...progressBarBase, fillColor: p.primary },
      success: { ...progressBarBase, fillColor: p.success },
      warning: { ...progressBarBase, fillColor: p.warning },
      danger:  { ...progressBarBase, fillColor: p.error   },
    } satisfies Record<string, ProgressBarVariant>,

    selectableChip: {
      sm: {
        backgroundColor: p.surfaceAlt,
        borderColor: p.border,
        borderWidth: 1,
        color: p.textSecondary,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm + 2,
        fontSize: typography.size.xs,
        fontWeight: typography.weight.regular,
        interaction: {
          disabledOpacity: 0.5,
          pressed: { opacity: 0.75 },
          selected: { backgroundColor: p.textPrimary, borderColor: p.textPrimary, color: p.textInverse, fontWeight: typography.weight.semibold },
        },
      },
      md: {
        backgroundColor: p.surfaceAlt,
        borderColor: p.border,
        borderWidth: 1,
        color: p.textSecondary,
        paddingVertical: spacing.xs + 1,
        paddingHorizontal: spacing.md - 2,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.regular,
        interaction: {
          disabledOpacity: 0.5,
          pressed: { opacity: 0.75 },
          selected: { backgroundColor: p.textPrimary, borderColor: p.textPrimary, color: p.textInverse, fontWeight: typography.weight.semibold },
        },
      },
    } satisfies Record<string, SelectableChipVariant>,

    textArea: {
      default: {
        backgroundColor: p.surfaceAlt,
        color: p.textPrimary,
        borderWidth: 1,
        borderColor: p.border,
        borderRadius: radii.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        fontSize: typography.size.md,
        minHeight: 120,
        placeholderColor: p.textMuted,
        interaction: {
          disabledOpacity: 0.5,
          focused: { borderColor: p.borderFocus, borderWidth: 2 },
        },
      },
    } satisfies Record<string, TextAreaVariant>,

    select: {
      default: {
        backgroundColor: p.surfaceAlt,
        borderColor: p.border,
        borderWidth: 1,
        borderRadius: pill,
        minHeight: CONTROL_H.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        color: p.textPrimary,
        placeholderColor: p.textMuted,
        menuBackgroundColor: p.surface,
        menuBorderColor: p.border,
        menuBorderRadius: radii.md,
        optionSelectedBackgroundColor: primaryMuted,
        optionSelectedColor: p.primary,
        optionColor: p.textPrimary,
        optionFontSize: typography.size.md,
        fieldGap: GAP.xs,
        triggerGap: spacing.sm + 2,
        optionRowGap: GAP.tight,
        optionFontWeight: typography.weight.regular,
        optionSelectedFontWeight: typography.weight.medium,
        optionDescriptionFontSize: typography.size.sm,
        interaction: {
          disabledOpacity: 0.5,
          hover: { borderColor: p.border },
          focused: { borderColor: p.borderFocus, borderWidth: 2 },
        },
      },
    } satisfies Record<string, SelectVariant>,

    multiSelect: {
      default: {
        backgroundColor: p.surfaceAlt,
        borderColor: p.border,
        borderWidth: 1,
        borderRadius: radii.md,
        minHeight: CONTROL_H.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        color: p.textPrimary,
        placeholderColor: p.textMuted,
        menuBackgroundColor: p.surface,
        menuBorderColor: p.border,
        menuBorderRadius: radii.md,
        optionSelectedBackgroundColor: primaryMuted,
        optionSelectedColor: p.primary,
        optionColor: p.textPrimary,
        optionFontSize: typography.size.md,
        fieldGap: GAP.xs,
        triggerGap: spacing.sm + 2,
        optionRowGap: GAP.tight,
        optionFontWeight: typography.weight.regular,
        optionSelectedFontWeight: typography.weight.medium,
        optionDescriptionFontSize: typography.size.sm,
        tokenBackgroundColor: primaryMuted,
        tokenColor: p.primary,
        tokenBorderRadius: pill,
        tokenPaddingVertical: spacing.xs,
        tokenPaddingHorizontal: spacing.sm,
        tokenFontWeight: typography.weight.medium,
        tokenFontSize: typography.size.sm,
        interaction: {
          disabledOpacity: 0.5,
          hover: { borderColor: p.border },
        },
      },
    } satisfies Record<string, MultiSelectVariant>,
  };
}

export function createLayouts(t: Tokens): Record<string, LayoutContract> {
  const { spacing } = t;
  return {
    compact: {
      controlHeight: CONTROL_H.sm - 8,
      rowHeight: CONTROL_H.sm - 4,
      rowPadding: spacing.xs,
      cellGap: spacing.sm,
      panelPadding: spacing.xs,
      sectionGap: spacing.sm + 2,
      itemGap: spacing.xs,
      iconSize: 14,
    },
    comfortable: {
      controlHeight: CONTROL_H.sm,
      rowHeight: CONTROL_H.sm + 4,
      rowPadding: spacing.sm,
      cellGap: spacing.sm,
      panelPadding: spacing.md,
      sectionGap: spacing.lg - 2,
      itemGap: spacing.sm,
      iconSize: 16,
    },
    spacious: {
      controlHeight: CONTROL_H.sm + 12,
      rowHeight: CONTROL_H.md + 2,
      rowPadding: spacing.md,
      cellGap: spacing.md,
      panelPadding: spacing.lg + 2,
      sectionGap: spacing.xl,
      itemGap: spacing.md,
      iconSize: 20,
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
  if (!isPlainObject(base) || !isPlainObject(override)) return override as T;
  const merged: Record<string, unknown> = { ...base as Record<string, unknown> };
  for (const key of Object.keys(override as Record<string, unknown>)) {
    const ov = (override as Record<string, unknown>)[key];
    if (ov === undefined) continue;
    const bv = merged[key];
    merged[key] = isPlainObject(bv) && isPlainObject(ov)
      ? mergeDefined(bv, ov as DeepPartial<typeof bv>)
      : ov;
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
  if (!override?.palette) return baseTheme;
  const nextTokens: Tokens = {
    ...baseTheme,
    palette: mergeDefined(baseTheme.palette, override.palette),
  };
  return buildThemeFromTokens(nextTokens);
}

export function createAppTheme(
  options: Parameters<typeof createTheme>[0],
  override?: ThemeOverride,
  variantOverrides?: Partial<Variants>,
): Theme {
  const base = createTheme(options);
  const withPalette = applyThemeOverride(buildThemeFromTokens(base), override);
  if (!variantOverrides) return withPalette;
  return { ...withPalette, variants: { ...withPalette.variants, ...variantOverrides } };
}

export { createTheme } from "./factory";
export type {
  ThemeColorDefinition,
  ThemeColorOverride,
  ThemePaletteDefinition,
  ThemePaletteOverride,
  ThemeDefinition,
  ThemeOverride,
} from "./contracts";
