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

export type StreamingTranscriptStatus = "idle" | "starting" | "streaming" | "ready" | "error";

export interface StreamingTranscriptState {
  status: StreamingTranscriptStatus;
  partialText: string;
  transcript?: Transcript;
  error?: TranscriptError;
}

export interface StreamingTranscriptUpdate {
  text: string;
  isFinal: boolean;
  segment?: TranscriptSegment;
}

export interface LiveTranscriptionOptions {
  language?: string;
  interimResults?: boolean;
  continuous?: boolean;
  contextualStrings?: string[];
}

export interface LiveTranscriptEvent {
  transcript: string;
  isFinal: boolean;
}

export interface LiveTranscriptionState {
  isSupported: boolean;
  isStarting: boolean;
  isRecording: boolean;
  transcript: string;
  error: string;
}

export interface LiveTranscriptionRuntime extends LiveTranscriptionState {
  start(): void;
  stop(): void;
  subscribe(listener: (event: LiveTranscriptEvent) => void): () => void;
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
