import { z } from "zod";
import type { ReactNode } from "react";

export const SheetOptionsSchema = z.object({
  dismissOnScrimPress: z.boolean().default(true),
});

export type SheetOptions = z.infer<typeof SheetOptionsSchema>;

export const SheetSchema = z.object({
  open: z.boolean(),
  onClose: z.custom<() => void>(),
  dismissOnScrimPress: z.boolean().optional(),
  content: z.custom<ReactNode>().optional(),
});

export type SheetProps = z.infer<typeof SheetSchema>;
