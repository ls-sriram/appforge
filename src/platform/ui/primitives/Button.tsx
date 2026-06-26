import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { View } from "@tamagui/core";
import { useTheme } from "../../theme/ThemeProvider";

export type ButtonProps = React.ComponentProps<typeof Pressable> & {
  variant?: string;
  label?: string;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  label,
  loading = false,
  disabled,
  onPress,
  children,
}: ButtonProps) {
  const theme = useTheme();
  const s = theme.variants.button?.[variant];

  return (
    <Pressable onPress={onPress} disabled={disabled || loading}>
      <View
        ai="center"
        jc="center"
        pointerEvents="none"
        style={{
          backgroundColor: s?.backgroundColor,
          borderRadius: s?.borderRadius,
          paddingVertical: s?.paddingVertical,
          paddingHorizontal: s?.paddingHorizontal,
          minHeight: s?.minHeight,
          borderWidth: s?.borderWidth,
          borderColor: s?.borderColor,
          opacity: disabled || loading ? 0.45 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator />
        ) : label ? (
          <Text
            style={{
              color: s?.color,
              fontSize: s?.fontSize,
              fontWeight: s?.fontWeight as any,
            }}
          >
            {label}
          </Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
}
