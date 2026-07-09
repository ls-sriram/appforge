import { z } from "zod";
import type { AvatarContract } from "./avatar.styles";

export const AvatarSchema = z.object({
  contract: z.custom<AvatarContract>(),
  initials: z.string().default("?"),
  selected: z.boolean().default(false),
  loading: z.boolean().default(false),
  onPress: z.custom<() => void>().optional(),
  disabled: z.boolean().optional(),
});

export type AvatarProps = z.input<typeof AvatarSchema>;
