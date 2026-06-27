import React from "react";
import { Pressable, Text, View } from "react-native";
import { useUI } from "../theme/ThemeProvider";
import type { InteractionContract } from "../contracts/interaction";

export interface BadgeVariant {
  backgroundColor: string;
  color: string;
  borderRadius: number;
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
  fontWeight: string | number;
  borderWidth?: number;
  borderColor?: string;
  interaction?: InteractionContract;
}

interface BadgeProps {
  label: string;
  variant: string;
  onPress?: () => void;
  disabled?: boolean;
}

export function Badge({ label, variant, onPress, disabled }: BadgeProps) {
  const { variants } = useUI();
  const s = variants.badge?.[variant];
  if (!s) throw new Error(`Unknown badge variant "${variant}"`);

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
          backgroundColor: activeStyle?.backgroundColor ?? s.backgroundColor,
          borderRadius: s.borderRadius,
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          borderWidth: s.borderWidth,
          borderColor: activeStyle?.borderColor ?? s.borderColor,
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
