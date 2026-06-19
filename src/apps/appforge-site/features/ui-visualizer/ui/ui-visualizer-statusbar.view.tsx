import React from "react";
import { Pressable } from "react-native";
import { Body, View, XStack } from "@ui";

export function UiVisualizerStatusbarView({
  selectedAppId,
  unsaved,
  docsLoading,
  blockCount,
  componentTypeCount,
  pendingCount,
  onCopyContext,
}: {
  selectedAppId: string;
  unsaved: boolean;
  docsLoading: boolean;
  blockCount: number;
  componentTypeCount: number;
  pendingCount: number;
  onCopyContext: () => void;
}) {
  return (
    <XStack h={24} ai="center" gap="$4" px="$3" bg="$surfaceAlt" borderTopColor="$borderSubtle" borderTopWidth={1} flexShrink={0}>
      <XStack ai="center" gap="$2">
        <View w={6} h={6} br={999} bg={docsLoading ? "$warning" : "$success"} />
        <Body fontSize="$1" color="$textMuted">{docsLoading ? "scanning…" : "editor live"}</Body>
      </XStack>
      <Body fontSize="$1" color="$textMuted">{selectedAppId}</Body>
      <Body fontSize="$1" color={unsaved ? "$warning" : "$textMuted"}>
        {unsaved ? "unsaved changes" : "clean"}
      </Body>
      {pendingCount > 0 && (
        <Pressable onPress={onCopyContext}>
          {({ pressed }: { pressed: boolean }) => (
            <XStack ai="center" gap="$2" opacity={pressed ? 0.6 : 1}>
              <View w={6} h={6} br={999} bg="$accent" />
              <Body fontSize="$1" color="$accent">
                {pendingCount} staged — copy context
              </Body>
            </XStack>
          )}
        </Pressable>
      )}
      <View f={1} />
      {blockCount > 0 && (
        <Body fontSize="$1" color="$textMuted">{blockCount} block{blockCount !== 1 ? "s" : ""}</Body>
      )}
      <Body fontSize="$1" color="$textMuted">{componentTypeCount} component types</Body>
    </XStack>
  );
}
