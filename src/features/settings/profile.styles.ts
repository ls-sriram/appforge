import type { ThemeDefinition } from "../../platform/ui/theme/index";
import { alpha } from "../../platform/ui/theme/definitions/style-tokens";
import type { SettingsShellStyle } from "./settings.styles";

export interface ProfileBlockStyle {
  shell: SettingsShellStyle;
  avatar: {
    backgroundColor: string;
    textColor: string;
    textFontWeight: string;
    sizeSm: number;
    sizeMd: number;
    sizeLg: number;
  };
  email: {
    color: string;
    fontSize: number;
  };
  uid: {
    color: string;
    fontSize: number;
  };
  chevron: {
    color: string;
    size: number;
  };
}

export function defaultProfileBlockStyle(theme: ThemeDefinition, shell: SettingsShellStyle): ProfileBlockStyle {
  return {
    shell,
    avatar: {
      backgroundColor: alpha(theme.palette.primary, 0.12),
      textColor: theme.palette.primary,
      textFontWeight: String(theme.typography.weight.bold),
      sizeSm: 32,
      sizeMd: 40,
      sizeLg: 56,
    },
    email: {
      color: theme.palette.textSecondary,
      fontSize: theme.typography.size.sm,
    },
    uid: {
      color: theme.palette.textMuted,
      fontSize: theme.typography.size.xs,
    },
    chevron: {
      color: theme.palette.textMuted,
      size: 20,
    },
  };
}
