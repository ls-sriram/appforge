import React from "react";
import { Text as RNText } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

interface LinkProps {
  label: string;
  onPress: () => void;
  testID?: string;
}

export function Link({ label, onPress, testID }: LinkProps) {
  const t = useTheme();
  return (
    <RNText
      onPress={onPress}
      testID={testID}
      style={{
        fontSize: t.colors.typography.sizes.sm,
        fontWeight: t.colors.typography.weights.medium,
        color: t.colors.textLink,
      }}
    >
      {label}
    </RNText>
  );
}
