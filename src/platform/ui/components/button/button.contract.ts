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
  // Optional, unlike the rest of the Pressable family: Button's children
  // is conventionally its own visible label text (every existing call
  // site in this repo passes a plain string), so that's a legitimate
  // accessible name on its own — WCAG's "label in name" guidance, same as
  // a web <button>. Only icon-only/non-string-children buttons need to
  // set this explicitly.
  accessibilityLabel: z.string().optional(),
});

// z.input, not z.infer (= z.output): fields with .default() are optional on
// the way in (what a caller may omit) but required on the way out (what
// .parse() guarantees, which React props never go through) — see
// docs/contracts/schema-discoverability.md in appforge-site for the full
// rationale this platform repo inherits.
export type ButtonProps = z.input<typeof ButtonSchema>;
