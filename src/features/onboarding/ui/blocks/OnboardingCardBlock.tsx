import React from "react";
import { YStack } from "../../../../platform/ui/index";

export function OnboardingCardBlock({
  children,
  size = "default",
}: {
  children: React.ReactNode;
  size?: "default" | "tall";
}) {
  void size;
  return <YStack>{children}</YStack>;
}
