import { Result } from "../../platform/core/types";
import { BackendRecordingsRepository } from "./backend-recordings.datasource";
import {
  RecordingCapturePayload,
  RecordingContentRef,
  RecordingFinalizeOptions,
  RecordingFinalizeResult,
  RecordingModel,
} from "./recordings.model";

export async function finalizeRecording(
  input: RecordingCapturePayload,
  options: RecordingFinalizeOptions = {},
): Promise<Result<RecordingFinalizeResult>> {
  const persistenceMode = options.persistenceMode ?? "save";
  if (persistenceMode === "discard") {
    return { ok: true, data: { outcome: "discarded" } };
  }
  const repository = new BackendRecordingsRepository();
  const result = await repository.createRecording(input);
  if (!result.ok) return { ok: false, error: result.error };
  return {
    ok: true,
    data: {
      outcome: "saved",
      recording: result.data,
    },
  };
}

export async function listRecordings(limit = 20): Promise<Result<RecordingModel[]>> {
  const repository = new BackendRecordingsRepository();
  return repository.listRecordings(limit);
}

export async function loadRecordingContent(recordingId: string): Promise<Result<RecordingContentRef>> {
  const repository = new BackendRecordingsRepository();
  return repository.getRecordingContent(recordingId);
}

export async function deleteRecording(recordingId: string): Promise<Result<void>> {
  const repository = new BackendRecordingsRepository();
  return repository.deleteRecording(recordingId);
}
