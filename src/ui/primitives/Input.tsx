import React from "react";
import { TextInput, TextStyle } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

type InputVariant = "default" | "error";

interface InputProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  variant?: InputVariant;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address";
  autoComplete?: React.ComponentProps<typeof TextInput>["autoComplete"];
  testID?: string;
}

function getInputStyle(
  variant: InputVariant,
  theme: ReturnType<typeof useTheme>,
): TextStyle {
  const { colors } = theme;
  const base: TextStyle = {
    backgroundColor: colors.surfaceAlt,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: colors.radii.pill,
    minHeight: 54,
    paddingVertical: colors.space.md,
    paddingHorizontal: colors.space.lg,
    fontSize: colors.typography.sizes.md,
    fontFamily: colors.typography.fontFamily,
  };
  if (variant === "error") {
    return { ...base, borderColor: colors.error, borderWidth: 2 };
  }
  return base;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  variant = "default",
  secureTextEntry = false,
  autoCapitalize = "none",
  keyboardType = "default",
  autoComplete,
  testID,
}: InputProps) {
  const theme = useTheme();

  return (
    <TextInput
      style={getInputStyle(variant, theme)}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textMuted}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      autoComplete={autoComplete}
      testID={testID}
    />
  );
}
