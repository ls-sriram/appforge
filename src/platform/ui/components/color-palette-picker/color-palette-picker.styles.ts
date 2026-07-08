import type { Theme } from "../../theme/definitions/tokens";

export interface ColorPalettePickerContract {
  preview: {
    size: number;
    borderWidth: number;
    borderRadius: number;
    borderColor: string;
    invalidBorderColor: string;
  };
  swatch: {
    size: number;
    borderWidth: number;
    borderRadius: number;
    borderColor: string;
    selectedBorderColor: string;
    disabledOpacity: number;
    defaultColors: string[];
  };
  input: {
    placeholder: string;
  };
  label: {
    color: string;
    fontSize: number;
    fontFamily: string;
  };
  helper: {
    color: string;
    fontSize: number;
    lineHeight: number;
    fontFamily: string;
  };
  error: {
    color: string;
  };
  icon: {
    selectedColor: string;
    selectedSize: number;
  };
}

export function defaultColorPalettePickerStyles(t: Theme): Record<string, ColorPalettePickerContract> {
  const { typography, radii } = t;
  const { pill } = radii;
  const p = t.palette;

  return {
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
  };
}
