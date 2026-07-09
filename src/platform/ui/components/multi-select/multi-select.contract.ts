import { z } from "zod";
import { SelectOptionSchema } from "../select/select.contract";
import type { MultiSelectContract } from "./multi-select.styles";

export const MultiSelectSchema = z.object({
  contract: z.custom<MultiSelectContract>(),
  options: z.array(SelectOptionSchema),
  value: z.array(z.string()),
  onValueChange: z.custom<(value: string[]) => void>(),
  placeholder: z.string().default("Select one or more options"),
  label: z.string().optional(),
  helperText: z.string().optional(),
  disabled: z.boolean().default(false),
  testID: z.string().optional(),
});

export type MultiSelectProps = z.input<typeof MultiSelectSchema>;
