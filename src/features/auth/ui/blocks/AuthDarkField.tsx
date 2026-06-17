import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "../../../../theme/ThemeProvider";
import { Icon, View, XStack } from "../../../../ui";
import type { IconName } from "../../../../ui";

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
  autoComplete?: React.ComponentProps<typeof TextInput>["autoComplete"];
  returnKeyType?: React.ComponentProps<typeof TextInput>["returnKeyType"];
  onSubmitEditing?: React.ComponentProps<typeof TextInput>["onSubmitEditing"];
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
    <TouchableOpacity
      activeOpacity={1}
      focusable={false}
      accessible={false}
      onPress={() => effectiveInputRef.current?.focus()}
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
            <TextInput
              ref={(instance) => {
                effectiveInputRef.current = instance ?? undefined;
              }}
              style={[
                styles.input,
                {
                  color: theme.colors.textPrimary,
                  fontSize: theme.colors.typography.sizes.md,
                },
              ]}
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
              <TouchableOpacity
                onPress={() => setShowPassword((x) => !x)}
                activeOpacity={0.7}
                focusable={false}
                accessible={false}
              >
                <Icon name="eye" size="lg" />
              </TouchableOpacity>
            ) : null}
          </XStack>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    minHeight: 36,
  },
});
