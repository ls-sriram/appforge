import type { ThemeDefinition } from "./contracts";
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
  TabsVariant,
  SizingToolbarVariant,
  TabbedPanelVariant,
  ColorPalettePickerVariant,
} from "../contracts";

const CONTROL_H = { sm: 36, md: 54, lg: 64 } as const;
const TRACK_H = 4;
const GAP = { tight: 4, xs: 8 } as const;

function alpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function createVariants(t: ThemeDefinition): Variants {
  const { spacing, typography, radii } = t;
  const { pill } = radii;
  const p = t.palette;

  const primaryMuted = alpha(p.primary, 0.12);
  const errorMuted = alpha(p.error, 0.12);
  const successMuted = alpha(p.success, 0.12);
  const warningMuted = alpha(p.warning, 0.12);
  const infoMuted = alpha(p.info, 0.12);

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
      muted: { ...badgeBase, backgroundColor: p.surfaceAlt, color: p.textMuted, borderColor: p.border, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
      success: { ...badgeBase, backgroundColor: successMuted, color: p.success, borderColor: p.success, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
      warning: { ...badgeBase, backgroundColor: warningMuted, color: p.warning, borderColor: p.warning, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
      danger: { ...badgeBase, backgroundColor: errorMuted, color: p.error, borderColor: p.error, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
      info: { ...badgeBase, backgroundColor: infoMuted, color: p.info, borderColor: p.info, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7 } } },
    } satisfies Record<string, BadgeVariant>,

    tag: {
      muted: { ...tagBase, backgroundColor: p.surfaceAlt, color: p.textMuted, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.surfaceAlt, color: p.textPrimary } } },
      secondary: { ...tagBase, backgroundColor: p.surfaceAlt, color: p.textSecondary, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.surfaceAlt, color: p.textPrimary } } },
      accent: { ...tagBase, backgroundColor: primaryMuted, color: p.primary, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.primary, color: p.textInverse } } },
      success: { ...tagBase, backgroundColor: successMuted, color: p.success, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.success, color: p.textInverse } } },
      warning: { ...tagBase, backgroundColor: warningMuted, color: p.warning, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.warning, color: p.textInverse } } },
      danger: { ...tagBase, backgroundColor: errorMuted, color: p.error, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.error, color: p.textInverse } } },
      info: { ...tagBase, backgroundColor: infoMuted, color: p.info, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.75 }, selected: { backgroundColor: p.info, color: p.textInverse } } },
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

    avatar: {
      sm: { ...avatarBase, width: 32, height: 32, fontSize: typography.size.xs, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.93 } } },
      md: { ...avatarBase, width: 40, height: 40, fontSize: typography.size.sm, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.93 } } },
      lg: { ...avatarBase, width: 56, height: 56, fontSize: typography.size.lg, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.95 } } },
      xl: { ...avatarBase, width: 80, height: 80, fontSize: typography.size.xl, interaction: { disabledOpacity: 0.4, pressed: { opacity: 0.7, scale: 0.96 } } },
    } satisfies Record<string, AvatarVariant>,

    image: {
      thumbnail: { width: 32, height: 32, borderRadius: radii.sm },
      card: { width: 40, height: 40, borderRadius: radii.md },
      hero: { width: 56, height: 56, borderRadius: radii.md },
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
      danger: { ...progressBarBase, fillColor: p.error },
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

    tabs: {
      default: {
        listBorderWidth: 1,
        listBorderColor: p.border,
        itemMinHeight: CONTROL_H.sm + 8,
        itemPaddingHorizontal: spacing.md - 4,
        itemPaddingVertical: spacing.sm,
        itemGap: GAP.xs - 2,
        itemBorderWidth: 2,
        selectedBorderColor: p.primary,
        unselectedBorderColor: "transparent",
        disabledOpacity: 0.5,
        selectedIconTone: "brand",
        unselectedIconTone: "muted",
        selectedTextTone: "accent",
        unselectedTextTone: "secondary",
      },
    } satisfies Record<string, TabsVariant>,

    sizingToolbar: {
      default: {
        containerBorderWidth: 1,
        containerBorderColor: p.border,
        containerBorderRadius: pill,
        containerDisabledOpacity: 0.5,
        buttonMinWidth: CONTROL_H.sm,
        buttonMinHeight: CONTROL_H.sm,
        buttonPaddingHorizontal: spacing.sm - 1,
        buttonPaddingVertical: spacing.xs + 2,
        buttonSelectedBackgroundColor: primaryMuted,
        buttonUnselectedBackgroundColor: p.surface,
        buttonDividerWidth: 1,
        buttonDividerColor: p.border,
      },
    } satisfies Record<string, SizingToolbarVariant>,

    tabbedPanel: {
      default: {
        actionButtonMinWidth: 28,
        actionButtonMinHeight: 28,
        actionButtonBorderRadius: pill,
        actionButtonDisabledOpacity: 0.4,
        actionIconTone: "secondary",
        disabledActionIconTone: "muted",
        inlineActionsMarginRight: GAP.tight,
      },
    } satisfies Record<string, TabbedPanelVariant>,

    colorPalettePicker: {
      default: {
        previewSize: 56,
        previewBorderWidth: 2,
        previewBorderRadius: pill,
        swatchSize: 32,
        swatchBorderWidth: 2,
        swatchBorderRadius: pill,
        placeholder: p.primary,
        defaultSwatches: [
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
        previewBorderColor: p.border,
        invalidPreviewBorderColor: p.error,
        swatchBorderColor: p.border,
        selectedSwatchBorderColor: p.primary,
        disabledOpacity: 0.5,
      },
    } satisfies Record<string, ColorPalettePickerVariant>,
  };
}
