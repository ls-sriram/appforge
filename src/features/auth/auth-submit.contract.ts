import { z } from "zod";
import type { UiStamp } from "../../platform/ui/index";
import type { AuthSubmitStyle } from "./auth-submit.styles";

export const AuthSubmitBlockSchema = z.object({
  ui: z.custom<UiStamp>().optional(),
  style: z.custom<AuthSubmitStyle>(),
  label: z.string(),
  loading: z.boolean(),
  disabled: z.boolean().optional(),
  generalError: z.string().optional(),
  onPress: z.custom<() => void>(),
  testID: z.string().optional(),
});

export type AuthSubmitBlockProps = z.infer<typeof AuthSubmitBlockSchema>;
