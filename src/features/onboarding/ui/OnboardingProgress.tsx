import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Icon, Text } from "../../../ui/primitives";
import { useTheme } from "../../../theme/ThemeProvider";

export function OnboardingProgress({
  step,
  total,
  onBack,
}: {
  step: number;
  total: number;
  onBack?: () => void;
}) {
  const t = useTheme();
  const c = t.colors;
  return (
    <View>
      <View>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Icon name="chevron-left" size="md" tone="secondary" />
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <Text variant="bodySm">Step {step} of {total}</Text>
      </View>
      <View>
        <View
        />
      </View>
    </View>
  );
}
