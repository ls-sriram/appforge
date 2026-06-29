import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { InteractionContract } from "../contracts/interaction";

export interface ButtonContract {
  container: {
    backgroundColor: string;
    borderRadius: number;
    paddingVertical: number;
    paddingHorizontal: number;
    minHeight?: number;
    borderWidth?: number;
    borderColor?: string;
    shadow?: string;
  };
  text: {
    color: string;
    fontSize: number;
    fontWeight: string | number;
  };
  interaction?: InteractionContract;
}


export type ButtonProps = {
  contract: ButtonContract;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
};

export function Button({ contract, selected = false, loading = false, disabled, onPress, children }: ButtonProps) {
  const s = contract;

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
              backgroundColor: activeStyle?.backgroundColor ?? s.container.backgroundColor,
              borderRadius: s.container.borderRadius,
              paddingVertical: s.container.paddingVertical,
              paddingHorizontal: s.container.paddingHorizontal,
              minHeight: s.container.minHeight,
              borderWidth: activeBorderWidth ?? s.container.borderWidth,
              borderColor: activeStyle?.borderColor ?? s.container.borderColor,
              opacity,
              transform: scale !== undefined ? [{ scale }] : undefined,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator color={s.text.color} />
            ) : (
              <Text style={{ color: activeStyle?.color ?? s.text.color, fontSize: s.text.fontSize, fontWeight: s.text.fontWeight as any }}>
                {children}
              </Text>
            )}
          </View>
        );
      }}
    </Pressable>
  );
}
