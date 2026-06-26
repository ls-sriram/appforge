import React from "react";
import { TextInput } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

export type InputProps = Omit<React.ComponentProps<typeof TextInput>, "style">;

export const Input = React.forwardRef<TextInput, InputProps>(
  function Input(props, ref) {
    const theme = useTheme();
    const s = theme.variants.input?.["default"];

    return (
      <TextInput
        ref={ref}
        placeholderTextColor={s?.placeholderColor}
        {...props}
        style={{
          backgroundColor: s?.backgroundColor,
          borderRadius: s?.borderRadius,
          borderWidth: s?.borderWidth,
          borderColor: s?.borderColor,
          paddingVertical: s?.paddingVertical,
          paddingHorizontal: s?.paddingHorizontal,
          color: s?.color,
          fontSize: s?.fontSize,
          fontFamily: s?.fontFamily,
          minHeight: 54,
        }}
      />
    );
  },
);
