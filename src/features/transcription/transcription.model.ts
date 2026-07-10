export type TranscriptStatus = "idle" | "loading" | "ready" | "error";

export interface TranscriptSegment {
  text: string;
  startMs: number;
  endMs: number;
}

export interface Transcript {
  recordingId: string;
  text: string;
  language?: string;
  segments?: TranscriptSegment[];
}

export interface TranscriptState {
  status: TranscriptStatus;
  transcript?: Transcript;
  error?: TranscriptError;
}

export type TranscriptErrorCode =
  | "recording_unavailable"
  | "provider_unavailable"
  | "request_failed";

export interface TranscriptError {
  code: TranscriptErrorCode;
  message: string;
  recoverable: boolean;
}

export type TranscriptResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: TranscriptError };

