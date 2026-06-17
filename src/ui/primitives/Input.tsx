import { styled, useTheme } from "@tamagui/core";
import React from "react";
import { TextInput } from "react-native";

const InputFrame = styled(TextInput, {
  name: "Input",
  backgroundColor: "$surfaceAlt",
  borderWidth: 1,
  borderColor: "$border",
  borderRadius: 9999,
  minHeight: 54,
  paddingVertical: "$4",
  paddingHorizontal: "$5",
});

export function Input(props: React.ComponentProps<typeof TextInput>) {
  const theme = useTheme();
  return (
    <InputFrame
      placeholderTextColor={theme.textMuted.get()}
      style={{ color: theme.textPrimary.get(), fontFamily: "System", fontSize: 15 }}
      {...props}
    />
  );
}
