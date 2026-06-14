import React from "react";
import { Animated } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

/**
 * Skeleton — placeholder for loading content.
 */

type RadiusToken = "none" | "sm" | "md" | "lg" | "xl" | "pill" | "full";

interface SkeletonProps {
  width?: number | `${number}%` | "auto";
  height?: number;
  variant?: "text" | "circle" | "rect";
  radius?: RadiusToken;
}

export function Skeleton({
  width = "100%",
  height = 16,
  variant = "rect",
  radius,
}: SkeletonProps) {
  const theme = useTheme();
  const c = theme.colors;
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  const variantRadius = variant === "circle" ? c.radii.full : variant === "text" ? c.radii.sm : c.radii.md;
  const borderRadius = radius ? c.radii[radius] : variantRadius;

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: c.border,
        opacity,
      }}
    />
  );
}
