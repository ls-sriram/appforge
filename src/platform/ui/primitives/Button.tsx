import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import type { InteractionContract } from "../contracts/interaction";

export interface ButtonVariant {
  backgroundColor: string;
  color: string;
  borderRadius: number;
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
  fontWeight: string | number;
  minHeight?: number;
  borderWidth?: number;
  borderColor?: string;
  shadow?: string;
  interaction?: InteractionContract;
}

export type ButtonProps = {
  variant: string;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
};

export function Button({ variant, selected = false, loading = false, disabled, onPress, children }: ButtonProps) {
  const theme = useTheme();
  const s = theme.variants.button?.[variant];
  if (!s) throw new Error(`Unknown button variant "${variant}"`);

  return (
    <Pressable onPress={onPress} disabled={disabled || loading}>
      {({ pressed, hovered, focused }: { pressed: boolean; hovered?: boolean; focused?: boolean }) => {
        const ix = s.interaction;

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
        const activeBorderWidth = (activeStyle as { borderWidth?: number } | undefined)?.borderWidth;

        return (
          <View
            style={{
              backgroundColor: activeStyle?.backgroundColor ?? s.backgroundColor,
              borderRadius: s.borderRadius,
              paddingVertical: s.paddingVertical,
              paddingHorizontal: s.paddingHorizontal,
              minHeight: s.minHeight,
              borderWidth: activeBorderWidth ?? s.borderWidth,
              borderColor: activeStyle?.borderColor ?? s.borderColor,
              opacity,
              transform: scale !== undefined ? [{ scale }] : undefined,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator color={s.color} />
            ) : (
              <Text style={{ color: activeStyle?.color ?? s.color, fontSize: s.fontSize, fontWeight: s.fontWeight as any }}>
                {children}
              </Text>
            )}
          </View>
        );
      }}
    </Pressable>
  );
}
