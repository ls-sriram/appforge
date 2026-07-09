import React from "react";
import { Body, noopUi } from "../../platform/ui/index";
import type { OnboardingPromptBlockProps } from "./onboarding-prompt.contract";
export type { OnboardingPromptBlockProps };
export { OnboardingPromptBlockSchema } from "./onboarding-prompt.contract";

export function OnboardingPromptBlock({
  ui = noopUi,
  style,
  text,
}: OnboardingPromptBlockProps) {
  return <Body {...ui("root", "Onboarding question")} fontWeight={style.text.fontWeight}>{text}</Body>;
}
