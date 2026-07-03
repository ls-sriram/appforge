import React from "react";
import { Body, Button, noopUi, type UiStamp, useUI, YStack } from "../../platform/ui/index";
import type { AuthSubmitStyle } from "./auth.contracts";

interface AuthSubmitBlockProps {
  ui?: UiStamp;
  style: AuthSubmitStyle;
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
  style,
}: AuthSubmitBlockProps) {
  const { contracts } = useUI();
  return (
    <YStack {...ui("root", `${label} submit block`)} gap={style.layout.gap}>
      {generalError ? (
        <YStack
          {...ui("error-box", `${label} error box`)}
          bg={style.errorBox.backgroundColor}
          borderColor={style.errorBox.borderColor}
          borderWidth={style.errorBox.borderWidth}
          br={style.errorBox.borderRadius}
          p={style.errorBox.padding}
        >
          <Body {...ui("error-text", `${label} error text`)} color={style.errorText.color} fontSize={style.errorText.fontSize}>{generalError}</Body>
        </YStack>
      ) : null}
      <Button
        {...ui("button", `${label} button`)}
        contract={contracts.button!["primary"]}
        onPress={onPress}
        disabled={disabled ?? loading}
        loading={loading}
      >
        {loading ? "Loading..." : label}
      </Button>
    </YStack>
  );
}
