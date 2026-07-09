import React from "react";
import { Pressable, Text, View } from "react-native";
import type { BadgeContract } from "./badge.styles";
import type { BadgeProps } from "./badge.contract";
export type { BadgeContract };
export type { BadgeProps };
export { BadgeSchema } from "./badge.contract";

export function Badge({ contract, label, onPress, disabled }: BadgeProps) {
  const s = contract;

  const ix = s.interaction;
  const content = (pressed?: boolean, hovered?: boolean) => {
    const activeStyle = pressed ? ix?.pressed : hovered ? ix?.hover : undefined;
    const opacity = disabled ? (ix?.disabledOpacity ?? 0.45) : (activeStyle as { opacity?: number } | undefined)?.opacity ?? 1;

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          backgroundColor: activeStyle?.backgroundColor ?? s.container.backgroundColor,
          borderRadius: s.container.borderRadius,
          paddingVertical: s.container.paddingVertical,
          paddingHorizontal: s.container.paddingHorizontal,
          borderWidth: s.container.borderWidth,
          borderColor: activeStyle?.borderColor ?? s.container.borderColor,
          opacity,
        }}
      >
        <Text style={{ color: activeStyle?.color ?? s.text.color, fontSize: s.text.fontSize, fontWeight: s.text.fontWeight as any }}>
          {label}
        </Text>
      </View>
    );
  };

  if (onPress) {
    return (
      <Pressable onPress={onPress} disabled={disabled}>
        {({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) =>
          content(pressed, hovered)
        }
      </Pressable>
    );
  }

  return content();
}
