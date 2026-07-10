import type { Transcript, TranscriptResult } from "./transcription.model";

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

