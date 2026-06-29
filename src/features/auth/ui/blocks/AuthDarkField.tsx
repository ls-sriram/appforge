import React, { useRef, useState } from "react";
import type { TextInput } from "react-native";
import { Icon, Input, noopUi, type UiStamp, useThemeTokens, XStack, YStack } from "../../../../platform/ui/index";
import type { IconName } from "../../../../platform/ui/index";

export interface InputHandle {
  current?: TextInput;
}

interface AuthDarkFieldProps {
  ui?: UiStamp;
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
}: AuthDarkFieldProps) {
  const theme = useThemeTokens();
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
        bg={hasError ? "$errorMuted" : "$surfaceStrong"}
        borderColor={hasError ? "$error" : "$border"}
        borderWidth={1}
        br="$3"
      >
        <YStack {...ui("padding", `${placeholder} padding`)} px="$5" py="$3">
          <XStack {...ui("row", `${placeholder} row`)} ai="center" gap="$3">
            <Icon {...ui("icon", `${placeholder} icon`)} color={theme.palette.textSecondary} name={icon} size={18} />
            <YStack {...ui("input-wrap", `${placeholder} input wrapper`)} f={1}>
              <Input
                {...ui("input", `${placeholder} input`)}
                ref={(instance: TextInput | null) => {
                  effectiveInputRef.current = instance ?? undefined;
                }}
                placeholder={placeholder}
                placeholderTextColor={theme.palette.textMuted}
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
                <Icon {...ui("toggle-icon", `${placeholder} visibility toggle icon`)} color={theme.palette.textSecondary} name="eye" size={18} />
              </YStack>
            ) : null}
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
