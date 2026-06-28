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
    <YStack {...ui("root", `${label} submit block`)} gap="$3">
      {generalError ? (
        <YStack {...ui("error-box", `${label} error box`)} bg="$errorMuted" borderColor="$error" borderWidth={1} br="$2" p="$3">
          <Body {...ui("error-text", `${label} error text`)} color="$error" fontSize="$2">{generalError}</Body>
        </YStack>
      ) : null}
      <Button
        {...ui("button", `${label} button`)}
        variant="primary"
        onPress={onPress}
        disabled={disabled ?? loading}
        loading={loading}
      >
        {loading ? "Loading..." : label}
      </Button>
    </YStack>
  );
}
