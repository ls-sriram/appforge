import React, { useRef, useState } from "react";
import type { TextInput } from "react-native";
import { useTheme } from "../../../../platform/theme/ThemeProvider";
import { Icon, Input, View, XStack, YStack } from "../../../../platform/ui/index";
import type { IconName } from "../../../../platform/ui/index";

export interface InputHandle {
  current?: TextInput;
}

interface AuthDarkFieldProps {
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
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const localInputRef = useRef<TextInput | undefined>(undefined);
  const effectiveInputRef = inputRef ?? localInputRef;
  const hide = secureTextEntry && !showPassword;

  return (
    <YStack
      onPress={() => effectiveInputRef.current?.focus()}
      cursor="text"
    >
      <View
        bg={hasError ? "$errorMuted" : "$surfaceStrong"}
        borderColor={hasError ? "$error" : "$border"}
        borderWidth={1}
        br="$3"
      >
        <View px="$5" py="$3">
          <XStack ai="center" gap="$3">
            <Icon name={icon} size="lg" />
            <Input
              ref={(instance) => {
                effectiveInputRef.current = instance ?? undefined;
              }}
              style={{ flex: 1, minHeight: 36, color: theme.colors.textPrimary, fontSize: theme.colors.typography.sizes.md }}
              placeholder={placeholder}
              placeholderTextColor={theme.colors.textMuted}
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
            {secureTextEntry ? (
              <YStack onPress={() => setShowPassword((x) => !x)} pressStyle={{ opacity: 0.7 }}>
                <Icon name="eye" size="lg" />
              </YStack>
            ) : null}
          </XStack>
        </View>
      </View>
    </YStack>
  );
}
