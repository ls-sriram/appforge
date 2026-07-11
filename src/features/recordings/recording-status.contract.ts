import { z } from "zod";
import type { UiStamp } from "../../platform/ui/index";
import type { RecordingStatusStyle } from "./recording-status.styles";

export const RecordingStatusStateSchema = z.enum([
  "microphone",
  "muted",
  "recording",
  "uploading",
  "ready",
  "error",
]);

export const RecordingStatusSizeSchema = z.enum(["sm", "md", "lg"]);
export const RecordingStatusPulseSchema = z.enum(["auto", "always", "never"]);

export const RecordingStatusBlockSchema = z.object({
  ui: z.custom<UiStamp>().optional(),
  style: z.custom<RecordingStatusStyle>(),
  state: RecordingStatusStateSchema,
  size: RecordingStatusSizeSchema.default("md"),
  label: z.string().optional(),
  elapsedSeconds: z.number().optional(),
  maxSeconds: z.number().optional(),
  pulse: RecordingStatusPulseSchema.default("auto"),
});

export type RecordingStatusState = z.infer<typeof RecordingStatusStateSchema>;
export type RecordingStatusSize = z.infer<typeof RecordingStatusSizeSchema>;
export type RecordingStatusPulse = z.infer<typeof RecordingStatusPulseSchema>;
export type RecordingStatusBlockProps = z.input<typeof RecordingStatusBlockSchema>;
