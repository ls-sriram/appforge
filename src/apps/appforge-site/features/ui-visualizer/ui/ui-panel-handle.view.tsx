import React from "react";
import { Pressable } from "react-native";
import { Body, View } from "@ui";

export function UiPanelHandleView({
  side,
  collapsed,
  onToggle,
}: {
  side: "left" | "right";
  collapsed: boolean;
  onToggle: () => void;
}) {
  const chevron = collapsed ? (side === "left" ? "›" : "‹") : (side === "left" ? "‹" : "›");
  return (
    <Pressable onPress={onToggle} style={{ alignSelf: "stretch", display: "flex" }}>
      <View w={12} f={1} ai="center" jc="center" bg="$surfaceStrong" borderLeftColor="$borderSubtle" borderLeftWidth={1} borderRightColor="$borderSubtle" borderRightWidth={1}
        // @ts-ignore
        style={{ cursor: "col-resize" }}>
        <Body fontSize={9} color="$textMuted" opacity={0.5}>{chevron}</Body>
      </View>
    </Pressable>
  );
}
