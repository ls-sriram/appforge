import { z } from "zod";
import type { ReactNode } from "react";
import type { PressableContract } from "./pressable.styles";

// The ARIA/accessibilityRole vocabulary every Pressable-family variant needs.
// `button` is the default; variants override it (Tab -> "tab", MenuItem ->
// "menuitemcheckbox", ListItem in selection-list mode -> "option").
export const PressableRoleSchema = z.enum(["button", "tab", "option", "menuitemcheckbox", "link"]);

export const PressableSchema = z.object({
  // Optional: only the plain-ReactNode auto-styled path (below) reads it.
  // A function `children` renders itself and never touches `contract`, so
  // callers using that escape hatch don't need to fabricate an unused one.
  contract: z.custom<PressableContract>().optional(),
  role: PressableRoleSchema.default("button"),
  // Required, not optional: a Pressable with no accessible name is a
  // programming error, not a valid-but-unlabeled state.
  accessibilityLabel: z.string(),
  selected: z.boolean().default(false),
  // Separate from `selected`: aria-checked (menuitemcheckbox, checkbox,
  // switch) is a different accessibility semantic from aria-selected
  // (tab, option). Left undefined, no `checked` key is added to
  // accessibilityState at all — most variants never need it.
  checked: z.boolean().optional(),
  // For disclosure triggers (Select's dropdown trigger, and similar) —
  // aria-expanded, again a distinct accessibility semantic left off
  // accessibilityState entirely unless a caller actually sets it.
  expanded: z.boolean().optional(),
  disabled: z.boolean().optional(),
  onPress: z.custom<() => void>(),
  // Plain ReactNode gets Pressable's own contract-driven styling (the
  // common case: ListItem/Chip/Card/... just want the frame/interaction
  // resolved automatically). A render function opts a caller out of that
  // and back into raw pressed/hovered/focused state — for callers with
  // visual logic Pressable's simple frame+interaction model can't express
  // (Button's loading/scale/ActivityIndicator swap being the motivating
  // case), same escape hatch RN's own Pressable offers.
  children: z.custom<ReactNode | ((state: { pressed: boolean; hovered?: boolean; focused?: boolean }) => ReactNode)>().optional(),
  testID: z.string().optional(),
  // DockPanel/DockSplitter/TabbedPanel's visualizer stamping (`ui()`)
  // sets nativeID alongside testID on every element it touches — forward
  // it the same way so migrating those call sites onto Pressable doesn't
  // silently drop it.
  nativeID: z.string().optional(),
});

// z.input, not z.infer (= z.output): fields with .default() are optional on
// the way in (what a caller may omit) but required on the way out (what
// .parse() guarantees, which React props never go through) — see
// docs/contracts/schema-discoverability.md in appforge-site for the full
// rationale this platform repo inherits.
export type PressableProps = z.input<typeof PressableSchema>;
