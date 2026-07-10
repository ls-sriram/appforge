import type { InteractionContract } from "../../contracts/interaction";
import type { Theme } from "../../theme/definitions/tokens";

export interface PressableContract {
  frame: {
    backgroundColor?: string;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    paddingVertical?: number;
    paddingHorizontal?: number;
    minHeight?: number;
  };
  interaction?: InteractionContract;
}

export function defaultPressableStyles(t: Theme): Record<string, PressableContract> {
  const p = t.palette;

  return {
    default: {
      frame: {
        backgroundColor: "transparent",
        borderRadius: t.radii.md,
        borderWidth: 0,
      },
      interaction: {
        disabledOpacity: 0.45,
        pressed: { opacity: 0.75 },
        hover: { backgroundColor: p.surfaceAlt },
        focused: { borderColor: p.borderFocus, borderWidth: 2 },
        selected: { backgroundColor: p.primaryMuted, borderColor: p.primary },
      },
    },
  };
}
