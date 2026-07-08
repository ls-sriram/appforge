import type { Theme } from "../../theme/definitions/tokens";

export interface ImageContract {
  frame: {
    width: number;
    height: number;
    borderRadius: number;
  };
}

export interface TableContract {
  container: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
  };
  header: {
    backgroundColor: string;
    paddingVertical: number;
    gap: number;
    textColor: string;
    textFontFamily: string;
    textFontSize: number;
    textLineHeight: number;
  };
  row: {
    contentPaddingHorizontal: number;
    dividerWidth: number;
    stripedBackgroundColor: string;
  };
  cell: {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
  };
  empty: {
    padding: number;
    textColor: string;
    textFontFamily: string;
    textFontSize: number;
    textLineHeight: number;
  };
  interaction?: {
    rowPressedOpacity?: number;
    rowHoverBackgroundColor?: string;
    disabledOpacity?: number;
  };
}

export function defaultTableStyles(t: Theme): Record<string, TableContract> {
  const { spacing, typography, radii } = t;
  const p = t.palette;

  return {
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
  };
}

export function defaultImageStyles(t: Theme): Record<string, ImageContract> {
  const { radii } = t;

  return {
    thumbnail: { frame: { width: 32, height: 32, borderRadius: radii.sm } },
    card: { frame: { width: 40, height: 40, borderRadius: radii.md } },
    hero: { frame: { width: 56, height: 56, borderRadius: radii.md } },
  };
}
