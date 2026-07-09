import React, { useState } from "react";
import { TextInput, View } from "react-native";
import type { TextAreaContract } from "./text-area.styles";
export type { TextAreaContract };
export { TextAreaSchema } from "./text-area.contract";


export type TextAreaProps = Omit<React.ComponentProps<typeof TextInput>, "style" | "multiline"> & {
  contract: TextAreaContract;
  disabled?: boolean;
};

export const TextArea = React.forwardRef<TextInput, TextAreaProps>(
  function TextArea({ contract, onFocus, onBlur, disabled, ...props }, ref) {
    const s = contract;

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
