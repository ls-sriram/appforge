import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

/**
 * Avatar — user image or initials fallback.
 */

interface AvatarProps {
  name?: string;
  email?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { width: 32, height: 32, fontSize: 12 },
  md: { width: 40, height: 40, fontSize: 14 },
  lg: { width: 56, height: 56, fontSize: 18 },
};

export function Avatar({ name, email, size = "md" }: AvatarProps) {
  const theme = useTheme();
  const c = theme.colors;
  const s = sizeMap[size];

  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : email?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <View
      style={{
        width: s.width,
        height: s.height,
        borderRadius: c.radii.full,
        backgroundColor: c.primaryMuted,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: s.fontSize,
          fontWeight: c.typography.weights.semibold,
          color: c.primary,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
