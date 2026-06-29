import type { InteractionContract } from "../interaction";

export interface ProgressBarContract {
  track: {
    color: string;
    height: number;
    borderRadius: number;
  };
  fill: {
    color: string;
  };
  interaction?: InteractionContract;
}
