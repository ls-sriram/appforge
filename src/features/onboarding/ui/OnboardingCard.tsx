import React from "react";
import { YStack } from "../../../platform/ui/index";

export function OnboardingCard({
  children,
  size = "default",
}: {
  children: React.ReactNode;
  size?: "default" | "tall";
}) {
  void size;
  return <YStack>{children}</YStack>;
}
