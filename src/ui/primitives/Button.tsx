import React from "react";
import {
  TouchableOpacity,
  Text as RNText,
  ActivityIndicator,
  TextStyle,
  ViewStyle,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "neutral";
type ButtonSize = "md" | "sm";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  testID?: string;
  /** Stretch to full width. Primary buttons use this by default. */
  fullWidth?: boolean;
  size?: ButtonSize;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  full: {
    width: "100%",
  },
});

export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  testID,
  fullWidth,
  size = "md",
}: ButtonProps) {
  const theme = useTheme();
  const c = theme.colors;

  const isPrimary = variant === "primary";
  const isNeutral = variant === "neutral";
  const isDanger = variant === "danger";
  const isSmall = size === "sm";
  const width = fullWidth !== undefined ? fullWidth : isPrimary || isNeutral;

  const containerStyle: ViewStyle = {
    borderRadius: c.radii.pill,
    minHeight: isSmall ? 42 : 54,
    paddingVertical: isSmall ? c.space.sm : c.space.md,
    paddingHorizontal: isSmall ? c.space.lg : isPrimary || isNeutral || isDanger ? c.space.xl : c.space.lg,
    backgroundColor: isPrimary
      ? c.primary
      : isNeutral
        ? c.textPrimary
        : isDanger
          ? c.errorMuted
          : variant === "secondary"
            ? c.surfaceAlt
            : "transparent",
    borderWidth: isPrimary || isNeutral || isDanger ? 1 : variant === "secondary" ? 1 : 0,
    borderColor: isNeutral ? c.textPrimary : isDanger ? c.error : variant === "secondary" ? c.border : "transparent",
    ...(width ? styles.full : {}),
    opacity: disabled || loading ? 0.45 : 1,
  };

  const textStyle: TextStyle = {
    fontSize: isPrimary || isNeutral || isDanger ? (isSmall ? c.typography.sizes.sm : c.typography.sizes.md) : c.typography.sizes.sm,
    fontWeight: c.typography.weights.semibold,
    letterSpacing: isPrimary || isNeutral || isDanger ? 0.2 : 0,
    color: isPrimary || isNeutral ? c.textInverse : isDanger ? c.error : variant === "secondary" ? c.textPrimary : c.textLink,
    textTransform: "none",
  };

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={isPrimary ? 0.85 : 0.7}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary || isNeutral ? c.textInverse : isDanger ? c.error : c.textSecondary}
          size="small"
        />
      ) : (
        <RNText style={textStyle}>{label}</RNText>
      )}
    </TouchableOpacity>
  );
}
