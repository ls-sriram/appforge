import React from "react";
import { Body, Heading, View, YStack } from "../../../../ui";

export function UiPlaygroundSection() {
  return (
    <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$4" p="$5">
      <YStack gap="$3">
        <Heading fontSize="$4">Tamagui-native playground</Heading>
        <Body color="$textMuted">
          The old Block-based playground has been removed. This screen now marks the migration
          to direct Tamagui composition and a single shared `src/ui` surface.
        </Body>
        <View bg="$surface" borderColor="$border" borderWidth={1} br="$3" p="$4">
          <Body fontFamily="$bold" mb="$2">{`import { View, Text, XStack, YStack, Button } from "src/ui"`}</Body>
          <Body color="$textMuted">{`<YStack gap="$4"><Text>Hello</Text></YStack>`}</Body>
        </View>
      </YStack>
    </View>
  );
}
