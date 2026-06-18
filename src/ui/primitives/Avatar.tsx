import React from "react";
import { View } from "@tamagui/core";
import { Body } from "./Text";

interface AvatarProps {
  initials?: string;
  size?: number;
}

export function Avatar({ initials = "?", size = 40 }: AvatarProps) {
  const letters = initials.slice(0, 2).toUpperCase();
  return (
    <View w={size} h={size} br={9999} bg="$primaryMuted" ai="center" jc="center">
      <Body color="$primary" weight="bold" size="sm">
        {letters}
      </Body>
    </View>
  );
}
