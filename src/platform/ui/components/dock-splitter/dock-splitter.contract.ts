import { z } from "zod";
import type { UiStamp } from "../../viz";
import type { DockSplitterContract } from "./dock-splitter.styles";

export const DockSplitterDragEventSchema = z.object({
  clientX: z.number().optional(),
  clientY: z.number().optional(),
  nativeEvent: z
    .object({
      clientX: z.number().optional(),
      clientY: z.number().optional(),
      pageX: z.number().optional(),
      pageY: z.number().optional(),
      locationX: z.number().optional(),
      locationY: z.number().optional(),
    })
    .optional(),
});

export const DockSplitterSchema = z.object({
  contract: z.custom<DockSplitterContract>(),
  orientation: z.enum(["vertical", "horizontal"]).default("vertical"),
  disabled: z.boolean().default(false),
  onDragStart: z.custom<(event: z.infer<typeof DockSplitterDragEventSchema>) => void>().optional(),
  onDrag: z.custom<(delta: number, event: z.infer<typeof DockSplitterDragEventSchema>) => void>().optional(),
  onDragEnd: z.custom<(event: z.infer<typeof DockSplitterDragEventSchema>) => void>().optional(),
  ui: z.custom<UiStamp>().optional(),
});

export type DockSplitterOrientation = z.infer<typeof DockSplitterSchema>["orientation"];
export type DockSplitterDragEvent = z.infer<typeof DockSplitterDragEventSchema>;
export type DockSplitterProps = z.input<typeof DockSplitterSchema>;
