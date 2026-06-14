import React from "react";
import { TextInput, TextStyle } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

export type TextAreaSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

interface TextAreaProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  size?: TextAreaSize;
  testID?: string;
}

const MIN_HEIGHT_MAP: Record<TextAreaSize, number> = {
  sm: 80,
  md: 100,
  lg: 120,
  xl: 160,
  "2xl": 220,
  "3xl": 260,
  "4xl": 320,
};

export function TextArea({ value, onChangeText, placeholder, size = "lg", testID }: TextAreaProps) {
  const theme = useTheme();
  const style: TextStyle = {
    backgroundColor: theme.colors.surfaceAlt,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.colors.radii.lg,
    minHeight: MIN_HEIGHT_MAP[size],
    paddingVertical: theme.colors.space.md,
    paddingHorizontal: theme.colors.space.md,
    fontSize: theme.colors.typography.sizes.md,
    fontFamily: theme.colors.typography.fontFamily,
    textAlignVertical: "top",
  };

  return (
    <TextInput
      multiline
      style={style}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textMuted}
      testID={testID}
    />
  );
}
