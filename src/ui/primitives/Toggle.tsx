/**
 * ─────────────────────────────────────────────────────────────────
 * TOGGLE — On/off switch control.
 *
 * Accessible, animated toggle for settings and preferences.
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { anim } from "../../theme/tokens";

export interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: { width: 36, height: 20, thumb: 16 },
  md: { width: 48, height: 28, thumb: 22 },
  lg: { width: 56, height: 32, thumb: 26 },
} as const;

export function Toggle({
  value,
  onValueChange,
  disabled = false,
  size = "md",
}: ToggleProps) {
  const t = useTheme();
  const dims = SIZE_MAP[size];
  const translateX = React.useRef(new Animated.Value(value ? dims.width - dims.thumb - 6 : 0)).current;

  const handlePress = useCallback(() => {
    if (disabled) return;
    const next = !value;
    Animated.timing(translateX, {
      toValue: next ? dims.width - dims.thumb - 6 : 0,
      duration: anim.normal,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    onValueChange(next);
  }, [disabled, value, onValueChange, translateX, dims]);

  const thumbColor = disabled
    ? t.colors.textQuaternary
    : value
    ? t.colors.textInverse
    : t.colors.textSecondary;

  const trackBg = disabled
    ? t.colors.surfaceAlt
    : value
    ? t.colors.primary
    : t.colors.border;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      style={{
        width: dims.width,
        height: dims.height,
        borderRadius: t.colors.radii.full,
        backgroundColor: trackBg,
        justifyContent: "center",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Animated.View
        style={{
          width: dims.thumb,
          height: dims.thumb,
          borderRadius: t.colors.radii.full,
          backgroundColor: thumbColor,
          marginLeft: 3,
          transform: [{ translateX }],
        }}
      />
    </TouchableOpacity>
  );
}
