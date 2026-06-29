import type { InteractionContract } from "../interaction";

export interface MultiSelectContract {
  label: {
    color: string;
    fontSize: number;
  };
  trigger: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    minHeight: number;
    paddingVertical: number;
    paddingHorizontal: number;
    gap: number;
  };
  text: {
    color: string;
    fontFamily: string;
    placeholderColor: string;
  };
  icon: {
    color: string;
    size: number;
    selectedColor: string;
  };
  menu: {
    backgroundColor: string;
    borderColor: string;
    borderRadius: number;
  };
  option: {
    selectedBackgroundColor: string;
    selectedColor: string;
    color: string;
    fontSize: number;
    fontWeight: string | number;
    selectedFontWeight: string | number;
    descriptionFontSize: number;
    descriptionColor: string;
    rowGap: number;
  };
  token: {
    backgroundColor: string;
    color: string;
    borderRadius: number;
    paddingVertical: number;
    paddingHorizontal: number;
    fontWeight: string | number;
    fontSize: number;
  };
  helper: {
    color: string;
    fontSize: number;
  };
  layout: {
    fieldGap: number;
  };
  interaction?: InteractionContract;
}
