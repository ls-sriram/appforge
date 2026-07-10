import { z } from "zod";
import type { IconName } from "../icon/Icon";
import type { IconButtonContract } from "./icon-button.styles";

export const IconButtonSchema = z.object({
  contract: z.custom<IconButtonContract>(),
  icon: z.custom<IconName>(),
  // No default and no fallback to an icon name or visible text — this is
  // the one variant in the family where the spec is explicit that
  // accessibilityLabel must be required at the type level, since there's
  // no visible-text fallback a screen reader could fall back to.
  accessibilityLabel: z.string(),
  selected: z.boolean().default(false),
  disabled: z.boolean().optional(),
  onPress: z.custom<() => void>(),
  testID: z.string().optional(),
});

export type IconButtonProps = z.input<typeof IconButtonSchema>;
