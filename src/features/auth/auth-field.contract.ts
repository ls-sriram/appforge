import { z } from "zod";
import type { ComponentProps } from "react";
import type { TextInput } from "react-native";
import type { IconName, UiStamp } from "../../platform/ui/index";
import type { AuthFieldStyle } from "./auth-field.styles";
import type { InputHandle } from "./auth-dark-field.block";

export const AuthFieldBlockSchema = z.object({
  ui: z.custom<UiStamp>().optional(),
  style: z.custom<AuthFieldStyle>(),
  icon: z.custom<IconName>(),
  placeholder: z.string(),
  value: z.string(),
  onChangeText: z.custom<(value: string) => void>(),
  error: z.string().optional(),
  secureTextEntry: z.boolean().optional(),
  keyboardType: z.enum(["default", "email-address"]).optional(),
  autoCapitalize: z.enum(["none", "sentences", "words", "characters"]).optional(),
  autoComplete: z.custom<ComponentProps<typeof TextInput>["autoComplete"]>().optional(),
  returnKeyType: z.custom<ComponentProps<typeof TextInput>["returnKeyType"]>().optional(),
  onSubmitEditing: z.custom<ComponentProps<typeof TextInput>["onSubmitEditing"]>().optional(),
  blurOnSubmit: z.boolean().optional(),
  inputRef: z.custom<InputHandle>().optional(),
  testID: z.string().optional(),
});

export type AuthFieldBlockProps = z.infer<typeof AuthFieldBlockSchema>;
