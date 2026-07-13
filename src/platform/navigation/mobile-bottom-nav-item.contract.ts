import { z } from "zod";
import type { IconName } from "../ui";
import type { Href } from "expo-router";
import type { MobileBottomNavItemContract } from "./mobile-bottom-nav.styles";

export const MobileBottomNavItemSchema = z.object({
  contract: z.custom<MobileBottomNavItemContract>(),
  route: z.custom<Href>(),
  icon: z.custom<IconName>(),
  label: z.string(),
  accessibilityLabel: z.string(),
});

export type MobileBottomNavItemProps = z.input<typeof MobileBottomNavItemSchema>;
