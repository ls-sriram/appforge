import type { InteractionContract } from "../interaction";

export interface ButtonContract {
  frame: {
    backgroundColor: string;
    borderRadius: number;
    paddingVertical: number;
    paddingHorizontal: number;
    minHeight?: number;
    borderWidth?: number;
    borderColor?: string;
    shadow?: string;
  };
  text: {
    color: string;
    fontSize: number;
    fontWeight: string | number;
  };
  interaction?: InteractionContract;
}
