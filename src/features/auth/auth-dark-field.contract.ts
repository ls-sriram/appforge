import { z } from "zod";
import type { ComponentProps } from "react";
import type { Input, IconName, UiStamp } from "../../platform/ui/index";
import type { AuthFieldStyle } from "./auth-field.styles";
import type { InputHandle } from "./auth-dark-field.block";

export const AuthDarkFieldSchema = z.object({
  ui: z.custom<UiStamp>().optional(),
  style: z.custom<AuthFieldStyle>(),
  icon: z.custom<IconName>(),
  placeholder: z.string(),
  value: z.string(),
  onChangeText: z.custom<(value: string) => void>(),
  secureTextEntry: z.boolean().default(false),
  keyboardType: z.enum(["default", "email-address"]).default("default"),
  autoCapitalize: z.enum(["none", "sentences", "words", "characters"]).default("none"),
  autoComplete: z.custom<ComponentProps<typeof Input>["autoComplete"]>().optional(),
  returnKeyType: z.custom<ComponentProps<typeof Input>["returnKeyType"]>().default("done"),
  onSubmitEditing: z.custom<ComponentProps<typeof Input>["onSubmitEditing"]>().optional(),
  blurOnSubmit: z.boolean().default(true),
  inputRef: z.custom<InputHandle>().optional(),
  testID: z.string().optional(),
  hasError: z.boolean().default(false),
});

export type AuthDarkFieldProps = z.input<typeof AuthDarkFieldSchema>;
