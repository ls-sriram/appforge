import { z } from "zod";
import type { ReactNode } from "react";
import type { PressableContract } from "./pressable.styles";

// The ARIA/accessibilityRole vocabulary every Pressable-family variant needs.
// `button` is the default; variants override it (Tab -> "tab", MenuItem ->
// "menuitemcheckbox", ListItem in selection-list mode -> "option").
export const PressableRoleSchema = z.enum(["button", "tab", "option", "menuitemcheckbox", "link"]);

export const PressableSchema = z.object({
  contract: z.custom<PressableContract>(),
  role: PressableRoleSchema.default("button"),
  // Required, not optional: a Pressable with no accessible name is a
  // programming error, not a valid-but-unlabeled state.
  accessibilityLabel: z.string(),
  selected: z.boolean().default(false),
  disabled: z.boolean().optional(),
  onPress: z.custom<() => void>(),
  children: z.custom<ReactNode>().optional(),
  testID: z.string().optional(),
});

// z.input, not z.infer (= z.output): fields with .default() are optional on
// the way in (what a caller may omit) but required on the way out (what
// .parse() guarantees, which React props never go through) — see
// docs/contracts/schema-discoverability.md in appforge-site for the full
// rationale this platform repo inherits.
export type PressableProps = z.input<typeof PressableSchema>;
