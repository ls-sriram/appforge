import type { ThemeDefinition } from "../../platform/ui/theme/index";
import type { SettingsShellStyle } from "./settings.styles";

export interface UsageBlockStyle {
  shell: SettingsShellStyle;
  metricValue: {
    color: string;
    fontSize: number;
  };
  bar: {
    trackColor: string;
    trackHeight: number;
    radius: number;
    primaryColor: string;
    warningColor: string;
    errorColor: string;
  };
}

export function defaultUsageBlockStyle(theme: ThemeDefinition, shell: SettingsShellStyle): UsageBlockStyle {
  return {
    shell,
    metricValue: {
      color: theme.palette.primary,
      fontSize: theme.typography.size.sm,
    },
    bar: {
      trackColor: theme.palette.surfaceAlt,
      trackHeight: 4,
      radius: theme.radii.pill,
      primaryColor: theme.palette.primary,
      warningColor: theme.palette.warning,
      errorColor: theme.palette.error,
    },
  };
}
