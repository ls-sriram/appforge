import React from "react";
import { View } from "react-native";

export function OnboardingFrame({
  header,
  panel,
  footer,
}: {
  header: React.ReactNode;
  panel: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <View>
      <View>
        <View>{header}</View>
        <View>{panel}</View>
        <View>
          {footer}
        </View>
      </View>
    </View>
  );
}
