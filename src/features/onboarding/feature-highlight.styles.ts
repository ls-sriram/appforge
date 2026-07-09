import type { ThemeDefinition } from "../../platform/ui/theme/index";

export interface FeatureHighlightStyle {
  layout: {
    rootGap: number;
    copyGap: number;
  };
  frame: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
  };
  icon: {
    color: string;
    size: number;
  };
  description: {
    color: string;
  };
}

export function defaultFeatureHighlightStyle(theme: ThemeDefinition): FeatureHighlightStyle {
  return {
    layout: {
      rootGap: theme.spacing.md,
      copyGap: theme.spacing.xs,
    },
    frame: {
      backgroundColor: theme.palette.surfaceAlt,
      borderColor: theme.palette.border,
      borderWidth: 1,
      borderRadius: theme.radii.md,
      padding: theme.spacing.md,
    },
    icon: {
      color: theme.palette.textPrimary,
      size: 48,
    },
    description: {
      color: theme.palette.textSecondary,
    },
  };
}
