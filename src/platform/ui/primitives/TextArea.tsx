import { styled, useTheme } from "@tamagui/core";
import React from "react";
import { StyleSheet, TextInput } from "react-native";

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

export type TextAreaProps = Omit<React.ComponentProps<typeof TextAreaFrame>, "style"> & {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
};

export function TextArea(props: TextAreaProps) {
  const theme = useTheme();
  const { style: _style, size, ...rest } = props as TextAreaProps & { style?: unknown };
  const minHeight =
    size === "sm" ? 80 : size === "md" ? 100 : size === "xl" ? 160 : size === "2xl" ? 220 : size === "3xl" ? 260 : size === "4xl" ? 320 : 120;
  return (
    <TextAreaFrame
      multiline
      textAlignVertical="top"
      placeholderTextColor={theme.textMuted.get()}
      minHeight={minHeight}
      style={[styles.text, { color: theme.textPrimary.get() }]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "System",
    fontSize: 15,
  },
});
