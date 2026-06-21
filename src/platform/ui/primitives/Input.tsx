import { styled, useTheme } from "@tamagui/core";
import React from "react";
import { StyleSheet, TextInput } from "react-native";

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

export type InputProps = Omit<React.ComponentProps<typeof InputFrame>, "style">;

export const Input = React.forwardRef<TextInput, InputProps>(
  function Input(props, ref) {
    const theme = useTheme();
    const { style: _style, ...rest } = props as InputProps & { style?: unknown };
    return (
      <InputFrame
        ref={ref}
        placeholderTextColor={theme.textMuted.get()}
        style={[styles.text, { color: theme.textPrimary.get() }]}
        {...rest}
      />
    );
  },
);

const styles = StyleSheet.create({
  text: {
    fontFamily: "System",
    fontSize: 15,
  },
});
