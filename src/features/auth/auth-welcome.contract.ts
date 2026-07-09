import { z } from "zod";
import type { UiStamp } from "../../platform/ui/index";
import type { AuthWelcomeStyle } from "./auth-welcome.styles";

export const AuthWelcomeBlockSchema = z.object({
  ui: z.custom<UiStamp>().optional(),
  style: z.custom<AuthWelcomeStyle>(),
  onSignIn: z.custom<() => void>(),
  onCreateAccount: z.custom<() => void>(),
});

export type AuthWelcomeBlockProps = z.infer<typeof AuthWelcomeBlockSchema>;
