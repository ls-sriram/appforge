import { z } from "zod";
import type { ChipContract } from "./chip.styles";

export const ChipShapeSchema = z.enum(["pill", "rounded"]);
export const ChipFrameSchema = z.enum(["content", "fill"]);

export const ChipSchema = z.object({
  contract: z.custom<ChipContract>(),
  label: z.string(),
  accessibilityLabel: z.string(),
  selected: z.boolean().default(false),
  disabled: z.boolean().optional(),
  onPress: z.custom<() => void>(),
  shape: ChipShapeSchema.default("pill"),
  frame: ChipFrameSchema.default("content"),
  testID: z.string().optional(),
});

export type ChipProps = z.input<typeof ChipSchema>;
