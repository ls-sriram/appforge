import type { InteractionContract } from "../../contracts/interaction";
import type { Theme } from "../../theme/definitions/tokens";
import { CONTROL_H } from "../../theme/definitions/style-tokens";

export interface ButtonContract {
  frame: {
    backgroundColor: string;
    borderRadius: number;
    paddingVertical: number;
    paddingHorizontal: number;
    minHeight?: number;
    borderWidth?: number;
    borderColor?: string;
    shadow?: string;
  };
  text: {
    color: string;
    fontSize: number;
    fontWeight: string | number;
  };
  interaction?: InteractionContract;
}

export function defaultButtonStyles(t: Theme): Record<string, ButtonContract> {
  const { spacing, typography, radii } = t;
  const { pill } = radii;
  const p = t.palette;

  return {
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
        focused: { borderColor: p.borderFocus, borderWidth: 2 },
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
        focused: { borderColor: p.borderFocus, borderWidth: 2 },
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
        focused: { borderColor: p.borderFocus, borderWidth: 2 },
      },
    },
    danger: {
      frame: {
        backgroundColor: p.errorMuted,
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
        focused: { borderColor: p.borderFocus, borderWidth: 2 },
      },
    },
  };
}
