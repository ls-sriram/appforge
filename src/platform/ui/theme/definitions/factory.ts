import type { Theme, ElevationPreset } from "./tokens";
import type { ThemeOptions } from "./options";
import type { UiRuntime, LayoutLibrary } from "./ui-runtime";
import type { PrimitiveContracts } from "../../contracts/runtime/index";
import type {
  LayoutContract,
  LayoutProfileName,
} from "../../contracts/index";
import { alpha } from "./style-tokens";
import { type ButtonContract, defaultButtonStyles } from "../../components/button/button.styles";
import { defaultPressableStyles } from "../../components/pressable/pressable.styles";
import { defaultListItemStyles } from "../../components/list-item/list-item.styles";
import { defaultChipStyles } from "../../components/chip/chip.styles";
import { defaultTabStyles } from "../../components/tab/tab.styles";
import { defaultIconButtonStyles } from "../../components/icon-button/icon-button.styles";
import { defaultCardStyles } from "../../components/card/card.styles";
import { defaultCardListStyles } from "../../components/card-list/card-list.styles";
import { defaultMenuItemStyles } from "../../components/menu-item/menu-item.styles";
import { defaultBadgeStyles } from "../../components/badge/badge.styles";
import { defaultTagStyles } from "../../components/tag/tag.styles";
import { defaultInputStyles } from "../../components/input/input.styles";
import { defaultAvatarStyles } from "../../components/avatar/avatar.styles";
import { defaultTableStyles, defaultImageStyles } from "../../components/table/table.styles";
import { defaultProgressBarStyles } from "../../components/progress-bar/progress-bar.styles";
import { defaultSelectableChipStyles } from "../../components/selectable-chip/selectable-chip.styles";
import { defaultTextAreaStyles } from "../../components/text-area/text-area.styles";
import { defaultSelectStyles } from "../../components/select/select.styles";
import { defaultTabsStyles } from "../../components/tabs/tabs.styles";
import { defaultSizingToolbarStyles } from "../../components/sizing-toolbar/sizing-toolbar.styles";
import { defaultTabbedPanelStyles } from "../../components/tabbed-panel/tabbed-panel.styles";
import { defaultDockPanelStyles } from "../../components/dock-panel/dock-panel.styles";
import { defaultDockSplitterStyles } from "../../components/dock-splitter/dock-splitter.styles";
import { defaultColorPalettePickerStyles } from "../../components/color-palette-picker/color-palette-picker.styles";
import { defaultMultiSelectStyles } from "../../components/multi-select/multi-select.styles";

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
  return {
    button: defaultButtonStyles(t) satisfies Record<string, ButtonContract>,

    pressable: defaultPressableStyles(t),

    listItem: defaultListItemStyles(t),

    chip: defaultChipStyles(t),

    tab: defaultTabStyles(t),

    iconButton: defaultIconButtonStyles(t),

    card: defaultCardStyles(t),

    cardList: defaultCardListStyles(t),

    menuItem: defaultMenuItemStyles(t),

    badge: defaultBadgeStyles(t),

    tag: defaultTagStyles(t),

    input: defaultInputStyles(t),

    avatar: defaultAvatarStyles(t),

    image: defaultImageStyles(t),

    table: defaultTableStyles(t),

    progressBar: defaultProgressBarStyles(t),

    selectableChip: defaultSelectableChipStyles(t),

    textArea: defaultTextAreaStyles(t),

    select: defaultSelectStyles(t),

    multiSelect: defaultMultiSelectStyles(t),

    tabs: defaultTabsStyles(t),

    sizingToolbar: defaultSizingToolbarStyles(t),

    tabbedPanel: defaultTabbedPanelStyles(t),

    dockPanel: defaultDockPanelStyles(t),

    dockSplitter: defaultDockSplitterStyles(t),

    colorPalettePicker: defaultColorPalettePickerStyles(t),
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
