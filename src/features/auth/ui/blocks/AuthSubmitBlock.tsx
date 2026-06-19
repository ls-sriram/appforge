import React from "react";
import { Body, Button, View, YStack } from "@ui";

interface AuthSubmitBlockProps {
  label: string;
  loading: boolean;
  disabled?: boolean;
  generalError?: string;
  onPress: () => void;
  testID?: string;
}

export function AuthSubmitBlock({
  label,
  loading,
  disabled,
  generalError,
  onPress,
  testID,
}: AuthSubmitBlockProps) {
  return (
    <YStack gap="$3">
      {generalError ? (
        <View bg="$errorMuted" borderColor="$error" borderWidth={1} br="$2" p="$3">
          <Body color="$error" fontSize="$2">{generalError}</Body>
        </View>
      ) : null}
      <Button
        onPress={onPress}
        disabled={disabled ?? loading}
        testID={testID}
        bg="$textPrimary"
        opacity={disabled ?? loading ? 0.45 : 1}
      >
        <Body color="$textInverse" fontFamily="$bold">
          {loading ? "Loading..." : label}
        </Body>
      </Button>
    </YStack>
  );
}
