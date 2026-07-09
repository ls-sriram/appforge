import { z } from "zod";
import type { SelectableChipContract } from "./selectable-chip.styles";
import type { SelectableChipFrame, SelectableChipShape } from "./SelectableChip";

export const SelectableChipSchema = z.object({
  contract: z.custom<SelectableChipContract>(),
  label: z.string(),
  selected: z.boolean(),
  onPress: z.custom<() => void>(),
  shape: z.custom<SelectableChipShape>().default("pill"),
  frame: z.custom<SelectableChipFrame>().default("content"),
  disabled: z.boolean().default(false),
});

export type SelectableChipProps = z.input<typeof SelectableChipSchema>;
