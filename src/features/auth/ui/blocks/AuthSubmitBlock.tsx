import React from "react";
import { Block, Button } from "../../../../ui/primitives"
import { ErrorBanner } from "../../../../ui/blocks";

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
    <Block space="sm">
      {generalError ? <ErrorBanner message={generalError} /> : null}
      <Button
        label={label}
        onPress={onPress}
        variant="neutral"
        loading={loading}
        disabled={disabled ?? loading}
        testID={testID}
      />
    </Block>
  );
}
