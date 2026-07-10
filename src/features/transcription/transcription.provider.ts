import type { Transcript, TranscriptResult } from "./transcription.model";
import type { StreamingTranscriptUpdate } from "./transcription.model";

export interface TranscriptionContent {
  recordingId: string;
  contentUrl: string;
  contentType?: string;
}

/** Resolves recorder-owned content without transferring file ownership. */
export interface TranscriptionContentResolver {
  resolve(recordingId: string): Promise<TranscriptResult<TranscriptionContent>>;
}

/** Client-supplied provider. It is invoked only by an explicit request(). */
export interface TranscriptionHandler {
  transcribe(content: TranscriptionContent): Promise<TranscriptResult<Transcript>>;
}

export interface StreamingTranscriptionStartOptions {
  recordingId: string;
  contentType: string;
  language?: string;
}

export interface StreamingTranscriptionSession {
  append(chunk: Uint8Array): Promise<TranscriptResult<void>>;
  finish(): Promise<TranscriptResult<Transcript>>;
  cancel(): Promise<void>;
  subscribe(listener: (update: StreamingTranscriptUpdate) => void): () => void;
}

export interface StreamingTranscriptionHandler {
  start(
    options: StreamingTranscriptionStartOptions,
  ): Promise<TranscriptResult<StreamingTranscriptionSession>>;
}
