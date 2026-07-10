import { z } from "zod";
import type { IconName } from "../ui";
import type { NavItemContract } from "./nav-item.styles";
import type { AppRoute } from "./routes";

export const NavItemSchema = z.object({
  contract: z.custom<NavItemContract>(),
  route: z.custom<AppRoute>(),
  label: z.string(),
  icon: z.custom<IconName>().optional(),
});

// z.input, not z.infer — see button.contract.ts for the rationale this
// platform repo's contract system follows.
export type NavItemProps = z.input<typeof NavItemSchema>;
