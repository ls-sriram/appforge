import React, { useRef, useState } from "react";
import type { TextInput } from "react-native";
import { Icon, Input, noopUi, type UiStamp, useUI, XStack, YStack } from "../../../../platform/ui/index";
import type { IconName } from "../../../../platform/ui/index";
import type { AuthFieldStyle } from "../contracts/authContracts";

export interface InputHandle {
  current?: TextInput;
}

interface AuthDarkFieldProps {
  ui?: UiStamp;
  style: AuthFieldStyle;
  icon: IconName;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: React.ComponentProps<typeof Input>["autoComplete"];
  returnKeyType?: React.ComponentProps<typeof Input>["returnKeyType"];
  onSubmitEditing?: React.ComponentProps<typeof Input>["onSubmitEditing"];
  blurOnSubmit?: boolean;
  inputRef?: InputHandle;
  testID?: string;
  hasError?: boolean;
}

export function AuthDarkField({
  ui = noopUi,
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  autoComplete,
  returnKeyType = "done",
  onSubmitEditing,
  blurOnSubmit = true,
  inputRef,
  testID,
  hasError = false,
  style,
}: AuthDarkFieldProps) {
  const { contracts } = useUI();
  const [showPassword, setShowPassword] = useState(false);
  const localInputRef = useRef<TextInput | undefined>(undefined);
  const effectiveInputRef = inputRef ?? localInputRef;
  const hide = secureTextEntry && !showPassword;

  return (
    <YStack
      {...ui("press-target", `${placeholder} press target`)}
      onPress={() => effectiveInputRef.current?.focus()}
      cursor="text"
    >
      <YStack
        {...ui("frame", `${placeholder} frame`)}
        bg={hasError ? style.states.error.frameBackgroundColor : style.frame.backgroundColor}
        borderColor={hasError ? style.states.error.frameBorderColor : style.frame.borderColor}
        borderWidth={style.frame.borderWidth}
        br={style.frame.borderRadius}
      >
        <YStack {...ui("padding", `${placeholder} padding`)} px={style.padding.horizontal} py={style.padding.vertical}>
          <XStack {...ui("row", `${placeholder} row`)} ai="center" gap={style.padding.gap}>
            <Icon {...ui("icon", `${placeholder} icon`)} color={style.icon.color} name={icon} size={style.icon.size} />
            <YStack {...ui("input-wrap", `${placeholder} input wrapper`)} f={1}>
              <Input
                {...ui("input", `${placeholder} input`)}
                contract={contracts.input!["default"]}
                ref={(instance: TextInput | null) => {
                  effectiveInputRef.current = instance ?? undefined;
                }}
                placeholder={placeholder}
                placeholderTextColor={style.input.placeholderColor}
                value={value}
                onChangeText={onChangeText}
                editable
                secureTextEntry={hide}
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
                autoComplete={autoComplete}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
                blurOnSubmit={blurOnSubmit}
                testID={testID}
              />
            </YStack>
            {secureTextEntry ? (
              <YStack
                {...ui("toggle", `${placeholder} visibility toggle`)}
                onPress={() => setShowPassword((x) => !x)}
                pressStyle={{ opacity: 0.7 }}
              >
                <Icon {...ui("toggle-icon", `${placeholder} visibility toggle icon`)} color={style.icon.color} name="eye" size={style.icon.size} />
              </YStack>
            ) : null}
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
