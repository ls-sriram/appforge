import type { ThemeDefinition } from "../../platform/ui/theme/index";
import { alpha } from "../../platform/ui/theme/definitions/style-tokens";

export interface AuthSubmitStyle {
  layout: {
    gap: number;
  };
  errorBox: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
  };
  errorText: {
    color: string;
    fontSize: number;
  };
}

export function defaultAuthSubmitStyle(theme: ThemeDefinition): AuthSubmitStyle {
  return {
    layout: {
      gap: theme.spacing.sm,
    },
    errorBox: {
      backgroundColor: alpha(theme.palette.error, 0.12),
      borderColor: theme.palette.error,
      borderWidth: 1,
      borderRadius: theme.radii.sm,
      padding: theme.spacing.sm,
    },
    errorText: {
      color: theme.palette.error,
      fontSize: theme.typography.size.sm,
    },
  };
}
