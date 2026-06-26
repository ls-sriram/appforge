import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import type { InteractionContract } from "../contracts/interaction";

export interface InputVariant {
  backgroundColor: string;
  color: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
  fontFamily: string;
  minHeight: number;
  placeholderColor?: string;
  interaction?: InteractionContract;
}

export type InputProps = Omit<React.ComponentProps<typeof TextInput>, "style"> & {
  disabled?: boolean;
};

export const Input = React.forwardRef<TextInput, InputProps>(
  function Input({ onFocus, onBlur, disabled, ...props }, ref) {
    const theme = useTheme();
    const s = theme.variants.input?.["default"];
    if (!s) throw new Error('Unknown input variant "default"');

    const [focused, setFocused] = useState(false);
    const ix = s.interaction;
    const focusedStyle = focused ? ix?.focused : undefined;
    const opacity = disabled ? (ix?.disabledOpacity ?? 0.5) : 1;

    return (
      <View style={{ opacity }}>
        <TextInput
          ref={ref}
          placeholderTextColor={s.placeholderColor}
          editable={!disabled}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          {...props}
          style={{
            backgroundColor: s.backgroundColor,
            borderRadius: s.borderRadius,
            borderWidth: focusedStyle?.borderWidth ?? s.borderWidth,
            borderColor: focusedStyle?.borderColor ?? s.borderColor,
            paddingVertical: s.paddingVertical,
            paddingHorizontal: s.paddingHorizontal,
            color: s.color,
            fontSize: s.fontSize,
            fontFamily: s.fontFamily,
            minHeight: s.minHeight,
          }}
        />
      </View>
    );
  },
);
