import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Pressable } from "../pressable/Pressable";
import type { ButtonContract } from "./button.styles";
import type { ButtonProps } from "./button.contract";
export type { ButtonContract };
export type { ButtonProps };
export { ButtonSchema } from "./button.contract";

export function Button({
  contract,
  selected = false,
  loading = false,
  disabled,
  onPress,
  children,
  accessibilityLabel,
}: ButtonProps) {
  const s = contract;
  const resolvedLabel = accessibilityLabel ?? (typeof children === "string" ? children : undefined);

  if (!resolvedLabel && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(
      "Button: no accessibilityLabel and children isn't plain text — this button has no accessible name. Pass accessibilityLabel explicitly.",
    );
  }

  return (
    <Pressable
      accessibilityLabel={resolvedLabel ?? ""}
      onPress={onPress ?? (() => {})}
      disabled={disabled || loading}
    >
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
              backgroundColor: activeStyle?.backgroundColor ?? s.frame.backgroundColor,
              borderRadius: s.frame.borderRadius,
              paddingVertical: s.frame.paddingVertical,
              paddingHorizontal: s.frame.paddingHorizontal,
              minHeight: s.frame.minHeight,
              borderWidth: activeBorderWidth ?? s.frame.borderWidth,
              borderColor: activeStyle?.borderColor ?? s.frame.borderColor,
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
