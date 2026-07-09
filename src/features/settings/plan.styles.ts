import type { ThemeDefinition } from "../../platform/ui/theme/index";
import { alpha } from "../../platform/ui/theme/definitions/style-tokens";
import type { SettingsShellStyle } from "./settings.styles";

export interface PlanBlockStyle {
  shell: SettingsShellStyle;
  description: {
    color: string;
    fontSize: number;
  };
  badge: {
    paddingHorizontal: number;
    paddingVertical: number;
    textFontWeight: string;
  };
  renewCard: {
    gap: number;
  };
  planStatus: {
    activeBackgroundColor: string;
    activeColor: string;
    pastDueBackgroundColor: string;
    pastDueColor: string;
  };
  renewalIcon: {
    proColor: string;
    trialColor: string;
    defaultColor: string;
    size: number;
  };
}

export function defaultPlanBlockStyle(theme: ThemeDefinition, shell: SettingsShellStyle): PlanBlockStyle {
  return {
    shell,
    description: {
      color: theme.palette.textSecondary,
      fontSize: theme.typography.size.sm,
    },
    badge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      textFontWeight: String(theme.typography.weight.bold),
    },
    renewCard: {
      gap: theme.spacing.xs,
    },
    planStatus: {
      activeBackgroundColor: alpha(theme.palette.success, 0.12),
      activeColor: theme.palette.success,
      pastDueBackgroundColor: alpha(theme.palette.warning, 0.12),
      pastDueColor: theme.palette.warning,
    },
    renewalIcon: {
      proColor: theme.palette.primary,
      trialColor: theme.palette.warning,
      defaultColor: theme.palette.textMuted,
      size: 14,
    },
  };
}
