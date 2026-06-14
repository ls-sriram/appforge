import React from "react";
import { View } from "react-native";

export function OnboardingCard({
  children,
  size = "default",
}: {
  children: React.ReactNode;
  size?: "default" | "tall";
}) {
  void size;

  return (
    <View
    >
      {children}
    </View>
  );
}
