import { z } from "zod";
import type { InputContract } from "../input/input.styles";
import type { ColorPalettePickerContract } from "./color-palette-picker.styles";

export const ColorPalettePickerSchema = z.object({
  contract: z.custom<ColorPalettePickerContract>(),
  inputContract: z.custom<InputContract>(),
  value: z.string(),
  onValueChange: z.custom<(value: string) => void>(),
  palette: z.array(z.string()).optional(),
  label: z.string().optional(),
  helperText: z.string().optional(),
  disabled: z.boolean().default(false),
  placeholder: z.string().optional(),
  testID: z.string().optional(),
});

export type ColorPalettePickerProps = z.input<typeof ColorPalettePickerSchema>;
