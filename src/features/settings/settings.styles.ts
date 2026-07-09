import type { ThemeDefinition } from "../../platform/ui/theme/index";
import { defaultProfileBlockStyle, type ProfileBlockStyle } from "./profile.styles";
import { defaultAccountBlockStyle, type AccountBlockStyle } from "./account.styles";
import { defaultPlanBlockStyle, type PlanBlockStyle } from "./plan.styles";
import { defaultUsageBlockStyle, type UsageBlockStyle } from "./usage.styles";

// Shared by every settings block's own style shape (not owned by any single
// block) — defined here in the assembler rather than co-located under one
// block's styles file, so per-block files can import the type without a
// runtime-circular dependency back into this file.
export interface SettingsShellStyle {
  container: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
  };
  sectionTitle: {
    color: string;
    fontSize: number;
  };
  card: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
  };
}

function createShell(theme: ThemeDefinition, radius: number): SettingsShellStyle {
  return {
    container: {
      backgroundColor: theme.palette.surfaceAlt,
      borderColor: theme.palette.border,
      borderWidth: 1,
      borderRadius: radius,
      padding: theme.spacing.md,
    },
    sectionTitle: {
      color: theme.palette.textMuted,
      fontSize: theme.typography.size.xs,
    },
    card: {
      backgroundColor: theme.palette.surface,
      borderColor: theme.palette.border,
      borderWidth: 1,
      borderRadius: theme.radii.sm,
      padding: theme.spacing.sm,
    },
  };
}

export interface SettingsUiStyles {
  profile: ProfileBlockStyle;
  account: AccountBlockStyle;
  plan: PlanBlockStyle;
  usage: UsageBlockStyle;
}

export function createSettingsStyles(theme: ThemeDefinition): SettingsUiStyles {
  return {
    profile: defaultProfileBlockStyle(theme, createShell(theme, theme.radii.lg)),
    account: defaultAccountBlockStyle(theme, createShell(theme, theme.radii.md)),
    plan: defaultPlanBlockStyle(theme, createShell(theme, theme.radii.lg)),
    usage: defaultUsageBlockStyle(theme, createShell(theme, theme.radii.md)),
  };
}
