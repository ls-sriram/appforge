import React from "react";
import { Text } from "react-native";
import { View } from "@tamagui/core";
import { useTheme } from "../../theme/ThemeProvider";

export interface TagProps {
  label: string;
  tone?: string;
}

export function Tag({ label, tone = "muted" }: TagProps) {
  const theme = useTheme();
  const s = theme.variants.tag?.[tone];

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
