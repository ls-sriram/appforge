import React from "react";
import { Body, noopUi, type UiStamp } from "../../../../platform/ui/index";
import type { OnboardingPromptStyle } from "../contracts/onboardingContracts";

export function OnboardingPromptBlock({
  ui = noopUi,
  style,
  text,
}: {
  ui?: UiStamp;
  style: OnboardingPromptStyle;
  text: string;
}) {
  return <Body {...ui("root", "Onboarding question")} fontWeight={style.text.fontWeight}>{text}</Body>;
}
