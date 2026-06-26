import React from "react";
import { Text } from "react-native";
import { View } from "@tamagui/core";
import { useTheme } from "../../theme/ThemeProvider";

interface AvatarProps {
  initials?: string;
  size?: string;
}

export function Avatar({ initials = "?", size = "md" }: AvatarProps) {
  const theme = useTheme();
  const s = theme.variants.avatar?.[size];
  const letters = initials.slice(0, 2).toUpperCase();

  return (
    <View
      ai="center"
      jc="center"
      style={{
        width: s?.width,
        height: s?.height,
        borderRadius: s?.borderRadius,
        backgroundColor: s?.backgroundColor,
      }}
    >
      <Text style={{ color: s?.color, fontSize: s?.fontSize, fontWeight: "700" }}>
        {letters}
      </Text>
    </View>
  );
}
