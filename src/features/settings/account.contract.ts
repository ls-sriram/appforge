import { z } from "zod";
import type { AccountBlockStyle } from "./account.styles";

export const AccountBlockSchema = z.object({
  style: z.custom<AccountBlockStyle>(),
  createdAt: z.string().optional(),
  lastLoginAt: z.string().optional(),
});

export type AccountBlockProps = z.infer<typeof AccountBlockSchema>;
