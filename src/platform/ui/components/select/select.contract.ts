import { z } from "zod";
import type { SelectContract } from "./select.styles";

export const SelectOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  description: z.string().optional(),
  disabled: z.boolean().optional(),
  swatch: z.string().optional(),
});

export const SelectSchema = z.object({
  contract: z.custom<SelectContract>(),
  options: z.array(SelectOptionSchema),
  value: z.string().nullable().optional(),
  onValueChange: z.custom<(value: string) => void>(),
  placeholder: z.string().default("Select an option"),
  label: z.string().optional(),
  helperText: z.string().optional(),
  disabled: z.boolean().default(false),
  testID: z.string().optional(),
});

export type SelectOption = z.infer<typeof SelectOptionSchema>;
export type SelectProps = z.input<typeof SelectSchema>;
