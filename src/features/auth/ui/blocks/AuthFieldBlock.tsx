import React from "react";
import { TextInput } from "react-native";
import { Block, Text } from "../../../../ui/primitives"
import { AuthDarkField, type InputHandle } from "./AuthDarkField";
import type { IconName } from "../../../../ui/primitives/Icon";

interface AuthFieldBlockProps {
  icon: IconName;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: React.ComponentProps<typeof TextInput>["autoComplete"];
  returnKeyType?: React.ComponentProps<typeof TextInput>["returnKeyType"];
  onSubmitEditing?: React.ComponentProps<typeof TextInput>["onSubmitEditing"];
  blurOnSubmit?: boolean;
  inputRef?: InputHandle;
  testID?: string;
}

export function AuthFieldBlock({
  icon,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoComplete,
  returnKeyType,
  onSubmitEditing,
  blurOnSubmit,
  inputRef,
  testID,
}: AuthFieldBlockProps) {
  return (
    <Block space="xs">
      <AuthDarkField
        icon={icon}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        hasError={!!error}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={blurOnSubmit}
        inputRef={inputRef}
        testID={testID}
      />
      {error ? <Text variant="caption">{error}</Text> : null}
    </Block>
  );
}
