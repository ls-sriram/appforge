import React from "react";
import { ScrollView } from "react-native";
import { Body, Tag, View, XStack, YStack } from "@ui";

export function UiCodeView({
  documentName,
  previewState,
  serialized,
}: {
  documentName: string;
  previewState: string;
  serialized: string;
}) {
  return (
    <YStack px="$4" py="$4" gap="$4">
      <YStack gap="$1">
        <Body fontFamily="$bold">Generated shape</Body>
        <Body color="$textMuted">This comes from the in-memory UI document, not a hardcoded preview branch.</Body>
      </YStack>
      <View bg="$surface" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$4">
        <YStack gap="$3">
          <XStack ai="center" gap="$3" flexWrap="wrap">
            <Tag label={documentName} tone="info" />
            <Tag label={`${previewState} state`} tone="warning" />
          </XStack>
          <ScrollView horizontal>
            <Body fontSize="$2" color="$textMuted" style={{ fontFamily: "Menlo" }}>
              {serialized}
            </Body>
          </ScrollView>
        </YStack>
      </View>
    </YStack>
  );
}
