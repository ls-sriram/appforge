import { z } from "zod";
import type { TextAreaContract } from "./text-area.styles";

// Curated editing surface only — same reasoning as input.contract.ts:
// TextAreaProps spreads React Native's TextInput props, which this schema
// deliberately does not attempt to reproduce.
export const TextAreaSchema = z.object({
  contract: z.custom<TextAreaContract>(),
  disabled: z.boolean().optional(),
});
