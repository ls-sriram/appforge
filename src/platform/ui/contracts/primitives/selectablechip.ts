import type { InteractionContract } from "../interaction";

export interface SelectableChipContract {
  container: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    paddingVertical: number;
    paddingHorizontal: number;
  };
  shape: {
    pillBorderRadius: number;
    roundedBorderRadius: number;
  };
  text: {
    color: string;
    fontSize: number;
    fontWeight: string | number;
  };
  interaction?: InteractionContract;
}
