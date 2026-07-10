import { z } from "zod";
import type { MenuItemContract } from "./menu-item.styles";

export const MenuItemSchema = z.object({
  contract: z.custom<MenuItemContract>(),
  label: z.string(),
  accessibilityLabel: z.string(),
  // A dropdown filter row's toggle state (aria-checked) — distinct from
  // `selected` (aria-selected, used by ListItem/Tab). This is the role-
  // correctness fix the spec calls out explicitly: these rows are
  // checkbox-style toggles inside an open menu, not plain buttons.
  checked: z.boolean().default(false),
  disabled: z.boolean().optional(),
  onPress: z.custom<() => void>(),
  testID: z.string().optional(),
});

export type MenuItemProps = z.input<typeof MenuItemSchema>;
