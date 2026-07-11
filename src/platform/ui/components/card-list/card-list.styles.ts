import type { ViewStyle } from "react-native";
import type { Theme } from "../../theme/definitions/tokens";

export interface CardListContract {
  gap: number;
  alignItems: NonNullable<ViewStyle["alignItems"]>;
}

export function defaultCardListStyles(t: Theme): Record<string, CardListContract> {
  return {
    default: { gap: t.spacing.sm, alignItems: "stretch" },
    compact: { gap: t.spacing.xs, alignItems: "stretch" },
    dense: { gap: 2, alignItems: "stretch" },
  };
}
