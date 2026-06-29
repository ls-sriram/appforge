import React from "react";
import { Pressable, Text, View } from "react-native";
import type { TagContract } from "../contracts/primitives/tag";
export type { TagContract };


export interface TagProps {
  contract: TagContract;
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export function Tag({ contract, label, selected = false, onPress, disabled }: TagProps) {
  const s = contract;

  const ix = s.interaction;
  const content = (pressed?: boolean, hovered?: boolean) => {
    const activeStyle = selected ? ix?.selected
      : pressed ? ix?.pressed
      : hovered ? ix?.hover
      : undefined;

    const pressedOpacity = !selected && pressed ? ix?.pressed?.opacity : undefined;
    const hoveredOpacity = !selected && !pressed && hovered ? ix?.hover?.opacity : undefined;
    const opacity = disabled
      ? (ix?.disabledOpacity ?? 0.45)
      : (pressedOpacity ?? hoveredOpacity ?? 1);

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
          borderWidth: activeStyle?.borderColor !== undefined ? 1 : undefined,
          borderColor: activeStyle?.borderColor,
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
