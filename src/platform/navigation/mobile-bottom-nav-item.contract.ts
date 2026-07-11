import { z } from "zod";
import type { IconName } from "../ui";
import type { AppRoute } from "./routes";
import type { MobileBottomNavItemContract } from "./mobile-bottom-nav.styles";

export const MobileBottomNavItemSchema = z.object({
  contract: z.custom<MobileBottomNavItemContract>(),
  route: z.custom<AppRoute>(),
  icon: z.custom<IconName>(),
  accessibilityLabel: z.string(),
});

export type MobileBottomNavItemProps = z.input<typeof MobileBottomNavItemSchema>;
