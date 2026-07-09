import React from "react";
import { noopUi, Label, YStack } from "../../platform/ui/index";
import { AuthDarkField } from "./auth-dark-field.block";
import type { AuthFieldBlockProps } from "./auth-field.contract";
export type { AuthFieldBlockProps };
export { AuthFieldBlockSchema } from "./auth-field.contract";

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
