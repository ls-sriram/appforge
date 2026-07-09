import { z } from "zod";
import type { IconName } from "../../primitives/Icon";
import type { SizingToolbarContract } from "./sizing-toolbar.styles";
import type { SizingToolbarValue } from "./SizingToolbar";

export const SizingToolbarSchema = z.object({
  contract: z.custom<SizingToolbarContract>(),
  value: z.custom<SizingToolbarValue>(),
  onChange: z.custom<(value: SizingToolbarValue) => void>(),
  disabled: z.boolean().default(false),
  icons: z.custom<Partial<Record<SizingToolbarValue, IconName>>>().optional(),
});

export type SizingToolbarProps = z.input<typeof SizingToolbarSchema>;
