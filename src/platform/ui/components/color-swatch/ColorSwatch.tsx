import React from "react";
import { Platform } from "react-native";
import { View } from "@tamagui/core";
import type { ColorSwatchProps } from "./color-swatch.contract";
export type { ColorSwatchProps };
export { ColorSwatchSchema } from "./color-swatch.contract";

const SIZE = {
  sm: { w: 14, h: 10 },
  md: { w: 18, h: 12 },
} as const;

function toSafeHex(color: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) return color.toUpperCase();
  return "#000000";
}

export function ColorSwatch({ color, onChange, size = "md" }: ColorSwatchProps) {
  const { w, h } = SIZE[size];
  const hex = toSafeHex(color);

  return (
    <View
      position="relative"
      w={w}
      h={h}
      br={3}
      borderWidth={1}
      borderColor="$borderSubtle"
      overflow="hidden"
      flexShrink={0}
      // @ts-ignore — backgroundColor is safe on web View
      style={{ backgroundColor: hex }}
    >
      {Platform.OS === "web" && onChange ? (
        // @ts-ignore — web-only element scoped inside this primitive
        <input
          type="color"
          value={hex}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value.toUpperCase())
          }
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
            border: "none",
            padding: 0,
          }}
        />
      ) : null}
    </View>
  );
}
