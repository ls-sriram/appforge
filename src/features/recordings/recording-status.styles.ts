import type { ThemeDefinition } from "../../platform/ui/theme/index";
import { alpha } from "../../platform/ui/theme/definitions/style-tokens";
import type { RecordingStatusSize, RecordingStatusState } from "./recording-status.contract";

export interface RecordingStatusStyle {
  layout: {
    gap: number;
    iconGap: number;
  };
  sizes: Record<RecordingStatusSize, {
    iconSize: number;
    frameSize: number;
    pulseSize: number;
    dotSize: number;
    labelFontSize: number;
    timerFontSize: number;
    slashWidth: number;
  }>;
  frame: {
    borderRadius: number;
  };
  colors: Record<RecordingStatusState, {
    iconColor: string;
    labelColor: string;
    timerColor: string;
    accentColor: string;
    accentMutedColor: string;
  }>;
}

export function defaultRecordingStatusStyle(theme: ThemeDefinition): RecordingStatusStyle {
  return {
    layout: {
      gap: theme.spacing.xs,
      iconGap: theme.spacing.sm,
    },
    sizes: {
      sm: {
        iconSize: 16,
        frameSize: 20,
        pulseSize: 10,
        dotSize: 6,
        labelFontSize: theme.typography.size.xs,
        timerFontSize: theme.typography.size.xs,
        slashWidth: 2,
      },
      md: {
        iconSize: 20,
        frameSize: 24,
        pulseSize: 12,
        dotSize: 8,
        labelFontSize: theme.typography.size.sm,
        timerFontSize: theme.typography.size.sm,
        slashWidth: 2,
      },
      lg: {
        iconSize: 24,
        frameSize: 30,
        pulseSize: 14,
        dotSize: 10,
        labelFontSize: theme.typography.size.md,
        timerFontSize: theme.typography.size.sm,
        slashWidth: 3,
      },
    },
    frame: {
      borderRadius: theme.radii.pill,
    },
    colors: {
      microphone: {
        iconColor: theme.palette.textPrimary,
        labelColor: theme.palette.textPrimary,
        timerColor: theme.palette.textMuted,
        accentColor: theme.palette.primary,
        accentMutedColor: alpha(theme.palette.primary, 0.18),
      },
      muted: {
        iconColor: theme.palette.textMuted,
        labelColor: theme.palette.textMuted,
        timerColor: theme.palette.textMuted,
        accentColor: theme.palette.textMuted,
        accentMutedColor: alpha(theme.palette.textMuted, 0.18),
      },
      recording: {
        iconColor: theme.palette.error,
        labelColor: theme.palette.textPrimary,
        timerColor: theme.palette.error,
        accentColor: theme.palette.error,
        accentMutedColor: alpha(theme.palette.error, 0.18),
      },
      uploading: {
        iconColor: theme.palette.warning,
        labelColor: theme.palette.textPrimary,
        timerColor: theme.palette.textMuted,
        accentColor: theme.palette.warning,
        accentMutedColor: alpha(theme.palette.warning, 0.18),
      },
      ready: {
        iconColor: theme.palette.success,
        labelColor: theme.palette.textPrimary,
        timerColor: theme.palette.textMuted,
        accentColor: theme.palette.success,
        accentMutedColor: alpha(theme.palette.success, 0.18),
      },
      error: {
        iconColor: theme.palette.error,
        labelColor: theme.palette.error,
        timerColor: theme.palette.error,
        accentColor: theme.palette.error,
        accentMutedColor: alpha(theme.palette.error, 0.18),
      },
    },
  };
}
