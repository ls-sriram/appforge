import React from "react";
import { Body } from "../../../platform/ui/index";

export function OnboardingQuestionBlock({ text }: { text: string }) {
  return <Body fontFamily="$bold">{text}</Body>;
}
