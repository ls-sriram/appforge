import { styled, useTheme } from "@tamagui/core";
import React from "react";
import { TextInput } from "react-native";

const TextAreaFrame = styled(TextInput, {
  name: "TextArea",
  backgroundColor: "$surfaceAlt",
  borderWidth: 1,
  borderColor: "$border",
  borderRadius: "$3",
  minHeight: 160,
  paddingVertical: "$4",
  paddingHorizontal: "$4",
});

export function TextArea(props: React.ComponentProps<typeof TextInput> & { size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" }) {
  const theme = useTheme();
  const { style, size, ...rest } = props;
  const minHeight =
    size === "sm" ? 80 : size === "md" ? 100 : size === "xl" ? 160 : size === "2xl" ? 220 : size === "3xl" ? 260 : size === "4xl" ? 320 : 120;
  return (
    <TextAreaFrame
      multiline
      textAlignVertical="top"
      placeholderTextColor={theme.textMuted.get()}
      minHeight={minHeight}
      {...rest}
      style={[{ color: theme.textPrimary.get(), fontFamily: "System", fontSize: 15 }, style]}
    />
  );
}
