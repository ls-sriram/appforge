import type { ThemeDefinition } from "../../platform/ui/theme/index";
import { alpha } from "../../platform/ui/theme/definitions/style-tokens";

export interface AuthFieldStyle {
  layout: {
    gap: number;
  };
  frame: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
  };
  padding: {
    horizontal: number;
    vertical: number;
    gap: number;
  };
  icon: {
    color: string;
    size: number;
  };
  input: {
    textColor: string;
    placeholderColor: string;
    fontSize: number;
  };
  error: {
    textColor: string;
    fontSize: number;
  };
  states: {
    error: {
      frameBackgroundColor: string;
      frameBorderColor: string;
    };
  };
}

export function defaultAuthFieldStyle(theme: ThemeDefinition): AuthFieldStyle {
  return {
    layout: {
      gap: theme.spacing.xs,
    },
    frame: {
      backgroundColor: theme.palette.surfaceAlt,
      borderColor: theme.palette.border,
      borderWidth: 1,
      borderRadius: theme.radii.md,
    },
    padding: {
      horizontal: theme.spacing.xl,
      vertical: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    icon: {
      color: theme.palette.textSecondary,
      size: 18,
    },
    input: {
      textColor: theme.palette.textPrimary,
      placeholderColor: theme.palette.textMuted,
      fontSize: theme.typography.size.md,
    },
    error: {
      textColor: theme.palette.error,
      fontSize: theme.typography.size.sm,
    },
    states: {
      error: {
        frameBackgroundColor: alpha(theme.palette.error, 0.12),
        frameBorderColor: theme.palette.error,
      },
    },
  };
}
