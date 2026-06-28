import React from "react";
import { Body, noopUi, type UiStamp } from "../../../platform/ui/index";

export function OnboardingQuestionBlock({ ui = noopUi, text }: { ui?: UiStamp; text: string }) {
  return <Body {...ui("root", "Onboarding question")} fontFamily="$bold">{text}</Body>;
}
