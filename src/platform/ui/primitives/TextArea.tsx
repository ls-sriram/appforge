import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { useUI } from "../theme/ThemeProvider";
import type { InteractionContract } from "../contracts/interaction";

export interface TextAreaContract {
  field: {
    backgroundColor: string;
    color: string;
    fontFamily: string;
    borderWidth: number;
    borderColor: string;
    borderRadius: number;
    paddingVertical: number;
    paddingHorizontal: number;
    fontSize: number;
    minHeight: number;
    placeholderColor?: string;
  };
  interaction?: InteractionContract;
}


export type TextAreaProps = Omit<React.ComponentProps<typeof TextInput>, "style" | "multiline"> & {
  variant: string;
  disabled?: boolean;
};

export const TextArea = React.forwardRef<TextInput, TextAreaProps>(
  function TextArea({ variant, onFocus, onBlur, disabled, ...props }, ref) {
    const { contracts } = useUI();
    const s = contracts.textArea?.[variant];
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
          placeholderTextColor={s.field.placeholderColor}
          editable={!disabled}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          {...props}
          style={{
            backgroundColor: s.field.backgroundColor,
            borderRadius: s.field.borderRadius,
            borderWidth: focusedStyle?.borderWidth ?? s.field.borderWidth,
            borderColor: focusedStyle?.borderColor ?? s.field.borderColor,
            paddingVertical: s.field.paddingVertical,
            paddingHorizontal: s.field.paddingHorizontal,
            color: s.field.color,
            fontSize: s.field.fontSize,
            fontFamily: s.field.fontFamily,
            minHeight: s.field.minHeight,
          }}
        />
      </View>
    );
  },
);
