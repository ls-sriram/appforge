import { z } from "zod";
import type { ReactNode } from "react";
import type { UiStamp } from "../../platform/ui/index";
import type { AuthFormStyle } from "./auth-form.styles";

const AuthFormFooterSchema = z.object({
  prompt: z.string(),
  linkLabel: z.string(),
  onPress: z.custom<() => void>(),
});

export const AuthFormBlockSchema = z.object({
  ui: z.custom<UiStamp>().optional(),
  style: z.custom<AuthFormStyle>(),
  subtitle: z.string(),
  children: z.custom<ReactNode>(),
  showTerms: z.boolean().default(false),
  footer: AuthFormFooterSchema.optional(),
});

export type AuthFormBlockProps = z.input<typeof AuthFormBlockSchema>;
