import { z } from "zod";
import type { ProfileBlockStyle } from "./profile.styles";

const ProfileIdentitySchema = z.object({
  uid: z.string(),
  email: z.string(),
  name: z.string().optional(),
});

export const ProfileBlockSchema = z.object({
  style: z.custom<ProfileBlockStyle>(),
  name: z.string().optional(),
  email: z.string().optional(),
  uid: z.string().optional(),
  identity: ProfileIdentitySchema.optional(),
  onPress: z.custom<() => void>().optional(),
  size: z.enum(["sm", "md", "lg"]).default("lg"),
});

export type ProfileBlockProps = z.input<typeof ProfileBlockSchema>;
