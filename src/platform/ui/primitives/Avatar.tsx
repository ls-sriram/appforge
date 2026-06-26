import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import type { InteractionContract } from "../contracts/interaction";

export interface AvatarVariant {
  width: number;
  height: number;
  borderRadius: number;
  fontSize: number;
  fontWeight: string | number;
  backgroundColor: string;
  color: string;
  interaction?: InteractionContract;
}

interface AvatarProps {
  initials?: string;
  variant: string;
  selected?: boolean;
  loading?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export function Avatar({ initials = "?", variant, selected = false, loading = false, onPress, disabled }: AvatarProps) {
  const theme = useTheme();
  const s = theme.variants.avatar?.[variant];
  if (!s) throw new Error(`Unknown avatar variant "${variant}"`);

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
          width: s.width,
          height: s.height,
          borderRadius: s.borderRadius,
          backgroundColor: activeStyle?.backgroundColor ?? s.backgroundColor,
          borderWidth: (activeStyle as { borderWidth?: number } | undefined)?.borderWidth,
          borderColor: activeStyle?.borderColor,
          alignItems: "center",
          justifyContent: "center",
          opacity,
          transform: scale !== undefined ? [{ scale }] : undefined,
        }}
      >
        <Text style={{ color: activeStyle?.color ?? s.color, fontSize: s.fontSize, fontWeight: s.fontWeight as any }}>
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
