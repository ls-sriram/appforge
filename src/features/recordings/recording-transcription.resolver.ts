import type {
  TranscriptionContentResolver,
} from "../transcription/transcription.provider";
import { loadRecordingContent } from "./recording-actions.usecase";

export const recordingTranscriptionContentResolver: TranscriptionContentResolver = {
  async resolve(recordingId) {
    const result = await loadRecordingContent(recordingId);
    if (!result.ok) {
      return {
        ok: false,
        error: { code: "recording_unavailable", message: result.error, recoverable: true },
      };
    }
    return {
      ok: true,
      data: { recordingId, contentUrl: result.data.playbackUrl },
    };
  },
};

