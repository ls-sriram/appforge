import type { Theme, ElevationPreset } from "./tokens";
import type { ThemeOptions } from "./options";
import type { UiRuntime, LayoutLibrary } from "./ui-runtime";
import type { PrimitiveContracts } from "../../contracts/runtime/index";
import type {
  LayoutContract,
  LayoutProfileName,
  ProgressBarContract,
  SelectableChipContract,
  TextAreaContract,
  SelectContract,
  MultiSelectContract,
  TabsContract,
  SizingToolbarContract,
  TabbedPanelContract,
  DockPanelContract,
  DockSplitterContract,
  ColorPalettePickerContract,
} from "../../contracts/index";
import { CONTROL_H, TRACK_H, GAP, alpha } from "./style-tokens";
import { type ButtonContract, defaultButtonStyles } from "../../components/button/button.styles";
import { defaultBadgeStyles } from "../../components/badge/badge.styles";
import { defaultTagStyles } from "../../components/tag/tag.styles";
import { defaultInputStyles } from "../../components/input/input.styles";
import { defaultAvatarStyles } from "../../components/avatar/avatar.styles";
import { defaultTableStyles, defaultImageStyles } from "../../components/table/table.styles";

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

export function createContracts(t: Theme): PrimitiveContracts {
  const { spacing, typography, radii } = t;
  const { pill } = radii;
  const p = t.palette;

  const primaryMuted = p.primaryMuted;

  const progressBarBase = {
    track: {
      color: p.surfaceAlt,
      height: TRACK_H,
      borderRadius: pill,
    },
  } satisfies Partial<ProgressBarContract>;

  return {
    button: defaultButtonStyles(t) satisfies Record<string, ButtonContract>,

    badge: defaultBadgeStyles(t),

    tag: defaultTagStyles(t),

    input: defaultInputStyles(t),

    avatar: defaultAvatarStyles(t),

    image: defaultImageStyles(t),

    table: defaultTableStyles(t),

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

    dockPanel: {
      default: {
        container: {
          backgroundColor: p.surface,
          borderColor: p.border,
          borderWidth: 1,
        },
        header: {
          minHeight: CONTROL_H.sm,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          backgroundColor: p.surfaceAlt,
          borderColor: p.border,
          borderWidth: 1,
        },
        title: {
          color: p.textPrimary,
        },
        content: {
          backgroundColor: p.surface,
        },
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
        itemButton: {
          minWidth: CONTROL_H.sm,
          minHeight: CONTROL_H.sm,
          borderRadius: radii.md,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          gap: GAP.tight,
          activeBackgroundColor: primaryMuted,
          inactiveBackgroundColor: p.surface,
          disabledOpacity: 0.4,
        },
        itemIcon: {
          size: 16,
          selectedColor: p.primary,
          unselectedColor: p.textSecondary,
          disabledColor: p.textMuted,
        },
        rail: {
          backgroundColor: p.surfaceAlt,
          borderColor: p.border,
          borderWidth: 1,
          gap: GAP.tight,
          padding: spacing.xs,
          collapsedWidth: 64,
        },
        menuButton: {
          width: CONTROL_H.md,
          height: CONTROL_H.md,
        },
        splitterGrip: {
          size: CONTROL_H.sm,
          thickness: 4,
          color: p.border,
        },
        layout: {
          inlineActionsMarginRight: GAP.tight,
          contentGap: GAP.tight,
        },
      },
    } satisfies Record<string, DockPanelContract>,

    dockSplitter: {
      default: {
        container: {
          thickness: 4,
          minHitSize: CONTROL_H.sm,
          backgroundColor: p.surfaceAlt,
          activeBackgroundColor: p.surfaceStrong,
          disabledOpacity: 0.4,
        },
        grip: {
          length: 24,
          thickness: 4,
          borderRadius: pill,
          color: p.border,
        },
      },
    } satisfies Record<string, DockSplitterContract>,

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
