import type { IsoUtcTimestamp } from "../../../core/dates";

export type RecordingUiStatus = "idle" | "recording" | "uploading" | "ready" | "error";

export interface RecordingModel {
  id: string;
  createdAt: IsoUtcTimestamp;
  durationSeconds?: number;
  contentType: string;
  sizeBytes: number;
}

export interface RecordingCapturePayload {
  audioBase64: string;
  contentType: string;
  durationSeconds?: number;
}

export interface RecordingContentRef {
  playbackUrl: string;
}
