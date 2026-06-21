import React from "react";
import { Body, Button, noopUi, type UiStamp, YStack } from "../../../../platform/ui/index";

interface AuthSubmitBlockProps {
  ui?: UiStamp;
  label: string;
  loading: boolean;
  disabled?: boolean;
  generalError?: string;
  onPress: () => void;
  testID?: string;
}

export function AuthSubmitBlock({
  ui = noopUi,
  label,
  loading,
  disabled,
  generalError,
  onPress,
  testID,
}: AuthSubmitBlockProps) {
  return (
    <YStack {...ui("root")} gap="$3">
      {generalError ? (
        <YStack {...ui("error-box")} bg="$errorMuted" borderColor="$error" borderWidth={1} br="$2" p="$3">
          <Body {...ui("error-text")} color="$error" fontSize="$2">{generalError}</Body>
        </YStack>
      ) : null}
      <Button
        {...ui("button")}
        onPress={onPress}
        disabled={disabled ?? loading}
        testID={testID}
        bg="$textPrimary"
        opacity={disabled ?? loading ? 0.45 : 1}
      >
        <Body {...ui("label")} color="$textInverse" fontFamily="$bold">
          {loading ? "Loading..." : label}
        </Body>
      </Button>
    </YStack>
  );
}
