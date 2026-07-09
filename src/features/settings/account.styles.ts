import type { ThemeDefinition } from "../../platform/ui/theme/index";
import type { SettingsShellStyle } from "./settings.styles";

export interface AccountBlockStyle {
  shell: SettingsShellStyle;
  icon: {
    color: string;
    size: number;
  };
  value: {
    color: string;
    fontSize: number;
  };
}

export function defaultAccountBlockStyle(theme: ThemeDefinition, shell: SettingsShellStyle): AccountBlockStyle {
  return {
    shell,
    icon: {
      color: theme.palette.textMuted,
      size: 16,
    },
    value: {
      color: theme.palette.primary,
      fontSize: theme.typography.size.sm,
    },
  };
}
