import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import type { InteractionContract } from "../contracts/interaction";

export interface TagVariant {
  backgroundColor: string;
  color: string;
  borderRadius: number;
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
  fontWeight: string | number;
  interaction?: InteractionContract;
}

export interface TagProps {
  label: string;
  variant: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export function Tag({ label, variant, selected = false, onPress, disabled }: TagProps) {
  const theme = useTheme();
  const s = theme.variants.tag?.[variant];
  if (!s) throw new Error(`Unknown tag variant "${variant}"`);

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
          backgroundColor: activeStyle?.backgroundColor ?? s.backgroundColor,
          borderRadius: s.borderRadius,
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          borderWidth: activeStyle?.borderColor !== undefined ? 1 : undefined,
          borderColor: activeStyle?.borderColor,
          opacity,
        }}
      >
        <Text style={{ color: activeStyle?.color ?? s.color, fontSize: s.fontSize, fontWeight: s.fontWeight as any }}>
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
