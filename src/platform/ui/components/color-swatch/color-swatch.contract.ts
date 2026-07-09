import { z } from "zod";

export const ColorSwatchSchema = z.object({
  color: z.string(),
  onChange: z.custom<(hex: string) => void>().optional(),
  size: z.enum(["sm", "md"]).default("md"),
});

export type ColorSwatchProps = z.input<typeof ColorSwatchSchema>;
