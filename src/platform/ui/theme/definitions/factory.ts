import type { Theme, ElevationPreset } from "./tokens";
import type { ThemeOptions } from "./options";
import type { UiRuntime, LayoutLibrary } from "./ui-runtime";
import type { PrimitiveContracts } from "../../contracts/runtime/index";
import type {
  LayoutContract,
  LayoutProfileName,
  ButtonContract,
  BadgeContract,
  TagContract,
  InputContract,
  AvatarContract,
  ProgressBarContract,
  ImageContract,
  TableContract,
  SelectableChipContract,
  TextAreaContract,
  SelectContract,
  MultiSelectContract,
  TabsContract,
  SizingToolbarContract,
  TabbedPanelContract,
  ColorPalettePickerContract,
} from "../../contracts/index";

// ─── createTheme ─────────────────────────────────────────────────────────────

export function createTheme(options: ThemeOptions): Theme {
  const {
    brand,
    dark = false,
    fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
    radiusScale = 1,
  } = options;

  const primary = brand.primary;
  const accent = brand.accent ?? brand.primary;
  const success = brand.success ?? "#10B981";
  const warning = brand.warning ?? "#F59E0B";
  const error = brand.error ?? "#F43F5E";
  const info = brand.info ?? "#0EA5E9";

  const base = dark
    ? {
        background: "#F5F8FF" as const,
        surface: "#FFFFFF" as const,
        surfaceStrong: "#E9F0FF" as const,
        surfaceAlt: "#F3F7FF" as const,
        border: "rgba(37,99,235,0.12)" as const,
        borderSubtle: "rgba(37,99,235,0.07)" as const,
        textPrimary: "#0F172A" as const,
        textSecondary: "#334155" as const,
        textMuted: "#64748B" as const,
        textInverse: "#FFFFFF" as const,
      }
    : {
        background: "#FAFAFA" as const,
        surface: "#FFFFFF" as const,
        surfaceStrong: "#EDEDED" as const,
        surfaceAlt: "#F5F5F5" as const,
        border: "#E5E5E5" as const,
        borderSubtle: "#F0F0F0" as const,
        textPrimary: "#171717" as const,
        textSecondary: "#525252" as const,
        textMuted: "#A3A3A3" as const,
        textInverse: "#FFFFFF" as const,
      };

  return {
    palette: {
      primary,
      primaryMuted: alpha(primary, 0.12),
      accent,
      success,
      successMuted: alpha(success, 0.12),
      warning,
      warningMuted: alpha(warning, 0.12),
      error,
      errorMuted: alpha(error, 0.12),
      info,
      infoMuted: alpha(info, 0.12),
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
    elevation: {
      none: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
      sm: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: dark ? 0.18 : 0.08,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: dark ? 0.22 : 0.12,
        shadowRadius: 6,
        elevation: 3,
      },
      lg: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: dark ? 0.28 : 0.16,
        shadowRadius: 16,
        elevation: 6,
      },
      xl: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: dark ? 0.34 : 0.2,
        shadowRadius: 28,
        elevation: 10,
      },
    },
    breakpoints: {
      mobile: 0,
      tablet: 768,
      desktop: 1024,
    },
  };
}

// ─── createLayouts ────────────────────────────────────────────────────────────

export function createLayouts(t: Theme): Record<LayoutProfileName, LayoutContract> {
  const { spacing } = t;
  return {
    compact: {
      controlHeight: 28,
      rowHeight: 32,
      rowPadding: spacing.xs,
      cellGap: spacing.sm,
      panelPadding: spacing.xs,
      sectionGap: spacing.sm + 2,
      itemGap: spacing.xs,
      iconSize: 14,
      fontSize: 13,
      labelSize: 11,
    },
    comfortable: {
      controlHeight: 36,
      rowHeight: 40,
      rowPadding: spacing.sm,
      cellGap: spacing.sm,
      panelPadding: spacing.md,
      sectionGap: spacing.lg - 2,
      itemGap: spacing.sm,
      iconSize: 16,
      fontSize: 15,
      labelSize: 13,
    },
    spacious: {
      controlHeight: 48,
      rowHeight: 56,
      rowPadding: spacing.md,
      cellGap: spacing.md,
      panelPadding: spacing.lg + 2,
      sectionGap: spacing.xl,
      itemGap: spacing.md,
      iconSize: 20,
      fontSize: 18,
      labelSize: 15,
    },
  };
}

// ─── createContracts ─────────────────────────────────────────────────────────

const CONTROL_H = { sm: 36, md: 54, lg: 64 } as const;
const TRACK_H = 4;
const GAP = { tight: 4, xs: 8 } as const;

function alpha(hex: string, a: number): string {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function createContracts(t: Theme): PrimitiveContracts {
  const { spacing, typography, radii } = t;
  const { pill } = radii;
  const p = t.palette;

  const primaryMuted = p.primaryMuted;
  const errorMuted = p.errorMuted;
  const successMuted = p.successMuted;
  const warningMuted = p.warningMuted;
  const infoMuted = p.infoMuted;

  const badgeBase = {
    container: {
      backgroundColor: p.surfaceAlt,
      borderRadius: pill,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderWidth: 1,
      borderColor: p.border,
    },
    text: {
      fontSize: typography.size.xs,
      fontWeight: typography.weight.semibold,
      color: p.textMuted,
    },
  } satisfies Partial<BadgeContract>;

  const tagBase = {
    container: {
      borderRadius: pill,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      backgroundColor: p.surfaceAlt,
    },
    text: {
      fontSize: typography.size.xs,
      fontWeight: typography.weight.semibold,
      color: p.textMuted,
    },
  } satisfies Partial<TagContract>;

  const progressBarBase = {
    track: {
      color: p.surfaceAlt,
      height: TRACK_H,
      borderRadius: pill,
    },
  } satisfies Partial<ProgressBarContract>;

  const avatarBase = {
    frame: {
      borderRadius: pill,
      backgroundColor: primaryMuted,
      width: 0,
      height: 0,
    },
    text: {
      color: p.primary,
      fontWeight: typography.weight.semibold,
      fontSize: typography.size.sm,
    },
  } satisfies Partial<AvatarContract>;

  return {
    button: {
      primary: {
        frame: {
          backgroundColor: p.primary,
          borderRadius: pill,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          minHeight: CONTROL_H.md,
        },
        text: {
          color: p.textInverse,
          fontSize: typography.size.md,
          fontWeight: typography.weight.semibold,
        },
        interaction: {
          disabledOpacity: 0.4,
          loading: { opacity: 0.7 },
          pressed: { opacity: 0.8, scale: 0.97 },
          hover: { opacity: 0.92 },
        },
      },
      secondary: {
        frame: {
          backgroundColor: p.surfaceAlt,
          borderWidth: 1,
          borderColor: p.border,
          borderRadius: pill,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          minHeight: CONTROL_H.sm,
        },
        text: {
          color: p.textPrimary,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.medium,
        },
        interaction: {
          disabledOpacity: 0.4,
          loading: { opacity: 0.7 },
          pressed: { opacity: 0.7 },
          hover: { borderColor: p.border },
        },
      },
      ghost: {
        frame: {
          backgroundColor: "transparent",
          borderRadius: pill,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.sm,
          minHeight: CONTROL_H.sm,
        },
        text: {
          color: p.textMuted,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.medium,
        },
        interaction: {
          disabledOpacity: 0.35,
          loading: { opacity: 0.6 },
          pressed: { opacity: 0.6 },
          hover: { color: p.textSecondary },
        },
      },
      danger: {
        frame: {
          backgroundColor: errorMuted,
          borderWidth: 1,
          borderColor: p.error,
          borderRadius: radii.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          minHeight: CONTROL_H.md,
        },
        text: {
          color: p.error,
          fontSize: typography.size.md,
          fontWeight: typography.weight.semibold,
        },
        interaction: {
          disabledOpacity: 0.4,
          loading: { opacity: 0.7 },
          pressed: { opacity: 0.75, scale: 0.98 },
          hover: { opacity: 0.9 },
        },
      },
    } satisfies Record<string, ButtonContract>,

    badge: {
      muted: { ...badgeBase, container: { ...badgeBase.container!, backgroundColor: p.surfaceAlt, borderColor: p.border }, text: { ...badgeBase.text!, color: p.textMuted }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
      success: { ...badgeBase, container: { ...badgeBase.container!, backgroundColor: successMuted, borderColor: p.success }, text: { ...badgeBase.text!, color: p.success }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
      warning: { ...badgeBase, container: { ...badgeBase.container!, backgroundColor: warningMuted, borderColor: p.warning }, text: { ...badgeBase.text!, color: p.warning }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
      danger: { ...badgeBase, container: { ...badgeBase.container!, backgroundColor: errorMuted, borderColor: p.error }, text: { ...badgeBase.text!, color: p.error }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
      info: { ...badgeBase, container: { ...badgeBase.container!, backgroundColor: infoMuted, borderColor: p.info }, text: { ...badgeBase.text!, color: p.info }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
    } satisfies Record<string, BadgeContract>,

    tag: {
      muted: { ...tagBase, container: { ...tagBase.container!, backgroundColor: p.surfaceAlt }, text: { ...tagBase.text!, color: p.textMuted }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.surfaceAlt, color: p.textPrimary } } },
      secondary: { ...tagBase, container: { ...tagBase.container!, backgroundColor: p.surfaceAlt }, text: { ...tagBase.text!, color: p.textSecondary }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.surfaceAlt, color: p.textPrimary } } },
      accent: { ...tagBase, container: { ...tagBase.container!, backgroundColor: primaryMuted }, text: { ...tagBase.text!, color: p.primary }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.primary, color: p.textInverse } } },
      success: { ...tagBase, container: { ...tagBase.container!, backgroundColor: successMuted }, text: { ...tagBase.text!, color: p.success }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.success, color: p.textInverse } } },
      warning: { ...tagBase, container: { ...tagBase.container!, backgroundColor: warningMuted }, text: { ...tagBase.text!, color: p.warning }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.warning, color: p.textInverse } } },
      danger: { ...tagBase, container: { ...tagBase.container!, backgroundColor: errorMuted }, text: { ...tagBase.text!, color: p.error }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.error, color: p.textInverse } } },
      info: { ...tagBase, container: { ...tagBase.container!, backgroundColor: infoMuted }, text: { ...tagBase.text!, color: p.info }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.info, color: p.textInverse } } },
    } satisfies Record<string, TagContract>,

    input: {
      default: {
        field: {
          backgroundColor: p.surfaceAlt,
          color: p.textPrimary,
          fontFamily: typography.family,
          borderWidth: 1,
          borderColor: p.border,
          borderRadius: pill,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
          fontSize: typography.size.md,
          placeholderColor: p.textMuted,
          minHeight: CONTROL_H.md,
        },
        interaction: {
          disabledOpacity: 0.5,
          focused: { borderColor: p.borderFocus, borderWidth: 2 },
          hover: { borderColor: p.border },
        },
      },
    } satisfies Record<string, InputContract>,

    avatar: {
      sm: { ...avatarBase, frame: { ...avatarBase.frame!, width: 32, height: 32 }, text: { ...avatarBase.text!, fontSize: typography.size.xs }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.93 } } },
      md: { ...avatarBase, frame: { ...avatarBase.frame!, width: 40, height: 40 }, text: { ...avatarBase.text!, fontSize: typography.size.sm }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.93 } } },
      lg: { ...avatarBase, frame: { ...avatarBase.frame!, width: 56, height: 56 }, text: { ...avatarBase.text!, fontSize: typography.size.lg }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.95 } } },
      xl: { ...avatarBase, frame: { ...avatarBase.frame!, width: 80, height: 80 }, text: { ...avatarBase.text!, fontSize: typography.size.xl }, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.96 } } },
    } satisfies Record<string, AvatarContract>,

    image: {
      thumbnail: { frame: { width: 32, height: 32, borderRadius: radii.sm } },
      card: { frame: { width: 40, height: 40, borderRadius: radii.md } },
      hero: { frame: { width: 56, height: 56, borderRadius: radii.md } },
    } satisfies Record<string, ImageContract>,

    table: {
      default: {
        container: {
          backgroundColor: p.surface,
          borderColor: p.border,
          borderWidth: 1,
          borderRadius: radii.md,
        },
        header: {
          backgroundColor: p.surface,
          paddingVertical: spacing.sm,
          gap: spacing.sm,
          textColor: p.textMuted,
          textFontFamily: typography.family,
          textFontSize: typography.size.sm,
          textLineHeight: typography.size.sm,
        },
        row: {
          contentPaddingHorizontal: spacing.md,
          dividerWidth: 1,
          stripedBackgroundColor: p.surfaceAlt,
        },
        cell: {
          color: p.textPrimary,
          fontFamily: typography.family,
          fontSize: typography.size.sm,
          lineHeight: typography.size.sm,
        },
        empty: {
          padding: spacing.md,
          textColor: p.textMuted,
          textFontFamily: typography.family,
          textFontSize: typography.size.md,
          textLineHeight: typography.size.md,
        },
        interaction: {
          rowHoverBackgroundColor: p.surfaceAlt,
          rowPressedOpacity: 0.85,
          disabledOpacity: 0.5,
        },
      },
    } satisfies Record<string, TableContract>,

    progressBar: {
      primary: { ...progressBarBase, fill: { color: p.primary } },
      success: { ...progressBarBase, fill: { color: p.success } },
      warning: { ...progressBarBase, fill: { color: p.warning } },
      danger: { ...progressBarBase, fill: { color: p.error } },
    } satisfies Record<string, ProgressBarContract>,

    selectableChip: {
      sm: {
        container: {
          backgroundColor: p.surfaceAlt,
          borderColor: p.border,
          borderWidth: 1,
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm + 2,
        },
        shape: {
          pillBorderRadius: pill,
          roundedBorderRadius: radii.sm,
        },
        text: {
          color: p.textSecondary,
          fontSize: typography.size.xs,
          fontWeight: typography.weight.regular,
        },
        interaction: {
          disabledOpacity: 0.5,
          pressed: { opacity: 0.75 },
          selected: { backgroundColor: p.textPrimary, borderColor: p.textPrimary, color: p.textInverse, fontWeight: typography.weight.semibold },
        },
      },
      md: {
        container: {
          backgroundColor: p.surfaceAlt,
          borderColor: p.border,
          borderWidth: 1,
          paddingVertical: spacing.xs + 1,
          paddingHorizontal: spacing.md - 2,
        },
        shape: {
          pillBorderRadius: pill,
          roundedBorderRadius: radii.sm,
        },
        text: {
          color: p.textSecondary,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.regular,
        },
        interaction: {
          disabledOpacity: 0.5,
          pressed: { opacity: 0.75 },
          selected: { backgroundColor: p.textPrimary, borderColor: p.textPrimary, color: p.textInverse, fontWeight: typography.weight.semibold },
        },
      },
    } satisfies Record<string, SelectableChipContract>,

    textArea: {
      default: {
        field: {
          backgroundColor: p.surfaceAlt,
          color: p.textPrimary,
          fontFamily: typography.family,
          borderWidth: 1,
          borderColor: p.border,
          borderRadius: radii.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
          fontSize: typography.size.md,
          minHeight: 120,
          placeholderColor: p.textMuted,
        },
        interaction: {
          disabledOpacity: 0.5,
          focused: { borderColor: p.borderFocus, borderWidth: 2 },
        },
      },
    } satisfies Record<string, TextAreaContract>,

    select: {
      default: {
        label: { color: p.textSecondary, fontSize: typography.size.md },
        trigger: {
          backgroundColor: p.surfaceAlt,
          borderColor: p.border,
          borderWidth: 1,
          borderRadius: pill,
          minHeight: CONTROL_H.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
          gap: spacing.sm + 2,
        },
        text: {
          color: p.textPrimary,
          fontFamily: typography.family,
          placeholderColor: p.textMuted,
        },
        icon: {
          color: p.textMuted,
          size: 16,
          selectedColor: p.primary,
        },
        menu: {
          backgroundColor: p.surface,
          borderColor: p.border,
          borderRadius: radii.md,
        },
        option: {
          selectedBackgroundColor: primaryMuted,
          selectedColor: p.primary,
          color: p.textPrimary,
          fontSize: typography.size.md,
          fontWeight: typography.weight.regular,
          selectedFontWeight: typography.weight.medium,
          descriptionFontSize: typography.size.sm,
          descriptionColor: p.textMuted,
          rowGap: GAP.tight,
        },
        helper: {
          color: p.textMuted,
          fontSize: typography.size.sm,
        },
        layout: {
          fieldGap: GAP.xs,
        },
        interaction: {
          disabledOpacity: 0.5,
          hover: { borderColor: p.border },
          focused: { borderColor: p.borderFocus, borderWidth: 2 },
        },
      },
    } satisfies Record<string, SelectContract>,

    multiSelect: {
      default: {
        label: { color: p.textSecondary, fontSize: typography.size.md },
        trigger: {
          backgroundColor: p.surfaceAlt,
          borderColor: p.border,
          borderWidth: 1,
          borderRadius: radii.md,
          minHeight: CONTROL_H.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
          gap: spacing.sm + 2,
        },
        text: {
          color: p.textPrimary,
          fontFamily: typography.family,
          placeholderColor: p.textMuted,
        },
        icon: {
          color: p.textMuted,
          size: 16,
          selectedColor: p.primary,
        },
        menu: {
          backgroundColor: p.surface,
          borderColor: p.border,
          borderRadius: radii.md,
        },
        option: {
          selectedBackgroundColor: primaryMuted,
          selectedColor: p.primary,
          color: p.textPrimary,
          fontSize: typography.size.md,
          fontWeight: typography.weight.regular,
          selectedFontWeight: typography.weight.medium,
          descriptionFontSize: typography.size.sm,
          descriptionColor: p.textMuted,
          rowGap: GAP.tight,
        },
        token: {
          backgroundColor: primaryMuted,
          color: p.primary,
          borderRadius: pill,
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
          fontWeight: typography.weight.medium,
          fontSize: typography.size.sm,
        },
        helper: {
          color: p.textMuted,
          fontSize: typography.size.sm,
        },
        layout: {
          fieldGap: GAP.xs,
        },
        interaction: {
          disabledOpacity: 0.5,
          hover: { borderColor: p.border },
        },
      },
    } satisfies Record<string, MultiSelectContract>,

    tabs: {
      default: {
        list: {
          borderWidth: 1,
          borderColor: p.border,
        },
        item: {
          minHeight: CONTROL_H.sm + 8,
          paddingHorizontal: spacing.md - 4,
          paddingVertical: spacing.sm,
          gap: GAP.xs - 2,
          borderWidth: 2,
          selectedBorderColor: p.primary,
          unselectedBorderColor: "transparent",
          disabledOpacity: 0.5,
        },
        icon: {
          size: 14,
          selectedColor: p.primary,
          unselectedColor: p.textMuted,
        },
        text: {
          fontSize: typography.size.sm,
          lineHeight: typography.size.sm,
          selectedColor: p.primary,
          unselectedColor: p.textSecondary,
          selectedFontFamily: typography.family,
          unselectedFontFamily: typography.family,
        },
      },
    } satisfies Record<string, TabsContract>,

    sizingToolbar: {
      default: {
        container: {
          borderWidth: 1,
          borderColor: p.border,
          borderRadius: pill,
          disabledOpacity: 0.5,
        },
        button: {
          minWidth: CONTROL_H.sm,
          minHeight: CONTROL_H.sm,
          paddingHorizontal: spacing.sm - 1,
          paddingVertical: spacing.xs + 2,
          selectedBackgroundColor: primaryMuted,
          unselectedBackgroundColor: p.surface,
          dividerWidth: 1,
          dividerColor: p.border,
        },
        icon: {
          selectedColor: p.primary,
          unselectedColor: p.textMuted,
          size: 16,
        },
      },
    } satisfies Record<string, SizingToolbarContract>,

    tabbedPanel: {
      default: {
        actionButton: {
          minWidth: 28,
          minHeight: 28,
          borderRadius: pill,
          disabledOpacity: 0.4,
        },
        actionIcon: {
          size: 14,
          color: p.textSecondary,
          disabledColor: p.textMuted,
        },
        layout: {
          inlineActionsMarginRight: GAP.tight,
        },
      },
    } satisfies Record<string, TabbedPanelContract>,

    colorPalettePicker: {
      default: {
        preview: {
          size: 56,
          borderWidth: 2,
          borderRadius: pill,
          borderColor: p.border,
          invalidBorderColor: p.error,
        },
        swatch: {
          size: 32,
          borderWidth: 2,
          borderRadius: pill,
          borderColor: p.border,
          selectedBorderColor: p.primary,
          disabledOpacity: 0.5,
          defaultColors: [
            p.textPrimary,
            p.textSecondary,
            p.textMuted,
            p.error,
            p.warning,
            p.success,
            p.info,
            p.primary,
            p.borderFocus,
            p.surfaceAlt,
          ],
        },
        input: {
          placeholder: p.primary,
        },
        label: {
          color: p.textSecondary,
          fontSize: typography.size.md,
          fontFamily: typography.family,
        },
        helper: {
          color: p.textMuted,
          fontSize: typography.size.sm,
          lineHeight: typography.size.sm,
          fontFamily: typography.family,
        },
        error: {
          color: p.error,
        },
        icon: {
          selectedColor: p.textInverse,
          selectedSize: 14,
        },
      },
    } satisfies Record<string, ColorPalettePickerContract>,
  };
}

// ─── createUiRuntime ─────────────────────────────────────────────────────────

export function createUiRuntime(t: Theme): UiRuntime {
  return {
    theme: t,
    contracts: createContracts(t),
    layouts: createLayouts(t),
  };
}
