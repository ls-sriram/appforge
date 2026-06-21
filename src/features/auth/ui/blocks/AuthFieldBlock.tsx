import React from "react";
import type { TextInput } from "react-native";
import { Label, noopUi, type UiStamp, YStack } from "../../../../platform/ui/index";
import { AuthDarkField, type InputHandle } from "./AuthDarkField";
import type { IconName } from "../../../../platform/ui/index";

interface AuthFieldBlockProps {
  ui?: UiStamp;
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
  ui = noopUi,
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
    <YStack {...ui("root")} gap="$2">
      <AuthDarkField
        ui={ui.scope("field")}
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
      {error ? <Label {...ui("error")} color="$error" fontSize="$2">{error}</Label> : null}
    </YStack>
  );
}
