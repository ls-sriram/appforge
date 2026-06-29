import type { InteractionContract } from "../interaction";

export interface TextAreaContract {
  field: {
    backgroundColor: string;
    color: string;
    fontFamily: string;
    borderWidth: number;
    borderColor: string;
    borderRadius: number;
    paddingVertical: number;
    paddingHorizontal: number;
    fontSize: number;
    minHeight: number;
    placeholderColor?: string;
  };
  interaction?: InteractionContract;
}
