import { ActivityIndicator } from "react-native";
import { styled } from "@tamagui/core";
import React from "react";
import { Pressable } from "react-native";
import { Text } from "./Text";

const ButtonFrame = styled(Pressable, {
  name: "Button",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 9999,
  minHeight: 54,
  paddingVertical: "$4",
  paddingHorizontal: "$5",
});

export function Button({
  loading = false,
  children,
  style,
  ...props
}: React.ComponentProps<typeof ButtonFrame> & { loading?: boolean }) {
  return (
    <ButtonFrame
      {...props}
      opacity={props.disabled || loading ? 0.45 : 1}
      style={style}
    >
      {loading ? <ActivityIndicator /> : children ?? <Text color="$textInverse" fontFamily="$bold" />}
    </ButtonFrame>
  );
}
