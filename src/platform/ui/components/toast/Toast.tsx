import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { Icon } from "../icon/Icon";
import { useTheme } from "../../theme/ThemeProvider";
import { defaultToastStyles, toastPadding } from "./toast.styles";
import { motion, useSharedValue, useAnimatedStyle } from "../../primitives/motion";
import type { ToastItem } from "./toast.contract";
export type { ToastItem } from "./toast.contract";
export { ToastSchema, ToastVariantSchema } from "./toast.contract";

export function Toast({ item }: { item: ToastItem }) {
  const theme = useTheme();
  const styles = defaultToastStyles(theme)[item.variant];
  const padding = toastPadding(theme);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = motion.timing(theme, 1, "fast", "decelerate");
  }, [theme]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * -12 }],
  }));

  return (
    <Animated.View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: styles.container.backgroundColor,
          borderRadius: styles.container.borderRadius,
          borderWidth: styles.container.borderWidth,
          borderColor: styles.container.borderColor,
          ...padding,
        },
        animatedStyle,
      ]}
    >
      <Icon name={styles.icon.name} color={styles.icon.color} size={18} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: styles.text.color, fontSize: styles.text.fontSize, fontWeight: styles.text.fontWeight as any }}>
          {item.message}
        </Text>
      </View>
    </Animated.View>
  );
}
