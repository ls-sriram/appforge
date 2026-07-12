import type { IsoUtcTimestamp } from "../../platform/core/dates/index";

export type RecordingUiStatus = "idle" | "recording" | "uploading" | "ready" | "error";
export type RecordingPersistenceMode = "save" | "discard";

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

export interface RecordingFinalizeOptions {
  persistenceMode?: RecordingPersistenceMode;
}

export type RecordingFinalizeResult =
  | { outcome: "saved"; recording: RecordingModel }
  | { outcome: "discarded" };

export interface RecordingContentRef {
  playbackUrl: string;
}
