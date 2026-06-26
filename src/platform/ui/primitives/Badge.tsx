import React from "react";
import { Text } from "react-native";
import { View } from "@tamagui/core";
import { useTheme } from "../../theme/ThemeProvider";

interface BadgeProps {
  label: string;
  tone?: string;
}

export function Badge({ label, tone = "muted" }: BadgeProps) {
  const theme = useTheme();
  const s = theme.variants.badge?.[tone];

  return (
    <View
      fd="row"
      ai="center"
      alignSelf="flex-start"
      style={{
        backgroundColor: s?.backgroundColor,
        borderRadius: s?.borderRadius,
        paddingVertical: s?.paddingVertical,
        paddingHorizontal: s?.paddingHorizontal,
        borderWidth: s?.borderWidth,
        borderColor: s?.borderColor,
      }}
    >
      <Text
        style={{
          color: s?.color,
          fontSize: s?.fontSize,
          fontWeight: s?.fontWeight as any,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
