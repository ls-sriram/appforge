import type { InteractionContract } from "../interaction";

export interface AvatarContract {
  frame: {
    width: number;
    height: number;
    borderRadius: number;
    backgroundColor: string;
  };
  text: {
    fontSize: number;
    fontWeight: string | number;
    color: string;
  };
  interaction?: InteractionContract;
}
