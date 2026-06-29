import React from "react";
import { Pressable, Text, View } from "react-native";
import type { InteractionContract } from "../contracts/interaction";

export interface AvatarContract {
  frame: {
    width: number;
    height: number;
    borderRadius: number;
    backgroundColor: string;
  };
  text: {
    fontSize: number;
    fontWeight: string | number;
    color: string;
  };
  interaction?: InteractionContract;
}


interface AvatarProps {
  contract: AvatarContract;
  initials?: string;
  selected?: boolean;
  loading?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export function Avatar({ contract, initials = "?", selected = false, loading = false, onPress, disabled }: AvatarProps) {
  const s = contract;

  const letters = initials.slice(0, 2).toUpperCase();
  const ix = s.interaction;

  const content = (pressed?: boolean, hovered?: boolean, focused?: boolean) => {
    const activeStyle = selected ? ix?.selected
      : loading || disabled ? undefined
      : pressed ? ix?.pressed
      : hovered ? ix?.hover
      : focused ? ix?.focused
      : undefined;

    const opacity = disabled ? (ix?.disabledOpacity ?? 0.45)
      : loading ? (ix?.loading?.opacity ?? 1)
      : (activeStyle as { opacity?: number } | undefined)?.opacity ?? 1;

    const scale = (activeStyle as { scale?: number } | undefined)?.scale;

    return (
      <View
        style={{
          width: s.frame.width,
          height: s.frame.height,
          borderRadius: s.frame.borderRadius,
          backgroundColor: activeStyle?.backgroundColor ?? s.frame.backgroundColor,
          borderWidth: (activeStyle as { borderWidth?: number } | undefined)?.borderWidth,
          borderColor: activeStyle?.borderColor,
          alignItems: "center",
          justifyContent: "center",
          opacity,
          transform: scale !== undefined ? [{ scale }] : undefined,
        }}
      >
        <Text style={{ color: activeStyle?.color ?? s.text.color, fontSize: s.text.fontSize, fontWeight: s.text.fontWeight as any }}>
          {letters}
        </Text>
      </View>
    );
  };

  if (onPress) {
    return (
      <Pressable onPress={onPress} disabled={disabled || loading}>
        {({ pressed, hovered, focused }: { pressed: boolean; hovered?: boolean; focused?: boolean }) =>
          content(pressed, hovered, focused)
        }
      </Pressable>
    );
  }

  return content();
}
