import { z } from "zod";
import type { UiStamp } from "../ui";

export const NavigationBackActionSchema = z.object({
  label: z.string().optional(),
  onPress: z.custom<() => void>(),
  disabled: z.boolean().optional(),
});

export const NavigationTerminalActionSchema = z.object({
  kind: z.enum(["forward", "exit"]),
  label: z.string().optional(),
  onPress: z.custom<() => void>(),
  disabled: z.boolean().optional(),
});

export const NavigationActionBarSchema = z.object({
  ui: z.custom<UiStamp>().optional(),
  back: NavigationBackActionSchema,
  action: NavigationTerminalActionSchema.optional(),
});

export type NavigationBackAction = z.input<typeof NavigationBackActionSchema>;
export type NavigationTerminalAction = z.input<typeof NavigationTerminalActionSchema>;
export type NavigationActionBarProps = z.input<typeof NavigationActionBarSchema>;
