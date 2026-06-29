import React from "react";
import type { TextInput } from "react-native";
import { Label, noopUi, type UiStamp, YStack } from "../../../../platform/ui/index";
import { AuthDarkField, type InputHandle } from "./AuthDarkField";
import type { IconName } from "../../../../platform/ui/index";
import type { AuthFieldStyle } from "../contracts/authContracts";

interface AuthFieldBlockProps {
  ui?: UiStamp;
  style: AuthFieldStyle;
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
  style,
}: AuthFieldBlockProps) {
  return (
    <YStack {...ui("root", `${placeholder} field block`)} gap={style.layout.gap}>
      <AuthDarkField
        ui={ui.scope("field")}
        style={style}
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
      {error ? <Label {...ui("error", `${placeholder} field error`)} color={style.error.textColor} fontSize={style.error.fontSize}>{error}</Label> : null}
    </YStack>
  );
}
