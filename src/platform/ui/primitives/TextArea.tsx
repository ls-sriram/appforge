import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import type { InteractionContract } from "../contracts/interaction";

export interface TextAreaVariant {
  backgroundColor: string;
  color: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
  minHeight: number;
  placeholderColor?: string;
  interaction?: InteractionContract;
}

export type TextAreaProps = Omit<React.ComponentProps<typeof TextInput>, "style" | "multiline"> & {
  variant: string;
  disabled?: boolean;
};

export const TextArea = React.forwardRef<TextInput, TextAreaProps>(
  function TextArea({ variant, onFocus, onBlur, disabled, ...props }, ref) {
    const theme = useTheme();
    const s = theme.variants.textArea?.[variant];
    if (!s) throw new Error(`Unknown textArea variant "${variant}"`);

    const [focused, setFocused] = useState(false);
    const ix = s.interaction;
    const focusedStyle = focused ? ix?.focused : undefined;
    const opacity = disabled ? (ix?.disabledOpacity ?? 0.5) : 1;

    return (
      <View style={{ opacity }}>
        <TextInput
          ref={ref}
          multiline
          textAlignVertical="top"
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
            fontFamily: theme.typography.family,
            minHeight: s.minHeight,
          }}
        />
      </View>
    );
  },
);
