import { z } from "zod";
import type { ReactNode } from "react";
import type { ButtonContract } from "./button.styles";

export const ButtonSchema = z.object({
  contract: z.custom<ButtonContract>(),
  selected: z.boolean().default(false),
  disabled: z.boolean().optional(),
  loading: z.boolean().default(false),
  onPress: z.custom<() => void>().optional(),
  children: z.custom<ReactNode>().optional(),
});

// z.input, not z.infer (= z.output): fields with .default() are optional on
// the way in (what a caller may omit) but required on the way out (what
// .parse() guarantees, which React props never go through) — see
// docs/contracts/schema-discoverability.md in appforge-site for the full
// rationale this platform repo inherits.
export type ButtonProps = z.input<typeof ButtonSchema>;
