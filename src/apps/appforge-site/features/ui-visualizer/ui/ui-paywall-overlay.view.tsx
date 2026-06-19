import React from "react";
import { Pressable } from "react-native";
import { Body, Button, Heading, Tag, View, XStack, YStack } from "@ui";

export function UiPaywallOverlay({ onClose }: { onClose: () => void }) {
  return (
    <View
      bg="$scrim"
      ai="center"
      jc="center"
      p="$4"
      style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
    >
      <View w="100%" maxWidth={520} bg="$surface" borderColor="$borderSubtle" borderWidth={1} br="$4" p="$5">
        <YStack gap="$4">
          <XStack ai="center" jc="space-between" gap="$3">
            <YStack gap="$1">
              <Heading>Unlock save</Heading>
              <Body color="$textMuted">Keep playing for free. Saving, export, and project persistence are the paid unlock.</Body>
            </YStack>
            <Pressable onPress={onClose}>
              <Body color="$textMuted">×</Body>
            </Pressable>
          </XStack>
          <XStack gap="$3" flexWrap="wrap">
            <Tag label="$199 one-time" tone="warning" />
            <Tag label="lifetime updates" tone="success" />
            <Tag label="source included" tone="info" />
          </XStack>
          <YStack gap="$2">
            <Body>Includes:</Body>
            <Body color="$textMuted">• save and re-open editor sessions</Body>
            <Body color="$textMuted">• export scaffold-ready code</Body>
            <Body color="$textMuted">• continue from the example app baseline</Body>
          </YStack>
          <XStack gap="$3" flexWrap="wrap">
            <Button bg="$primary" onPress={onClose}>
              <Body color="$textInverse" fontFamily="$bold">Continue to checkout</Body>
            </Button>
            <Button bg="$surfaceAlt" borderColor="$border" borderWidth={1} onPress={onClose}>
              <Body>Keep playing</Body>
            </Button>
          </XStack>
        </YStack>
      </View>
    </View>
  );
}
