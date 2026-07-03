import { Result } from "../../platform/core/types";
import { BackendRecordingsRepository } from "./backend-recordings.datasource";
import { RecordingCapturePayload, RecordingContentRef, RecordingModel } from "./recordings.model";

export async function createRecording(input: RecordingCapturePayload): Promise<Result<RecordingModel>> {
  const repository = new BackendRecordingsRepository();
  return repository.createRecording(input);
}

export async function listRecordings(limit = 20): Promise<Result<RecordingModel[]>> {
  const repository = new BackendRecordingsRepository();
  return repository.listRecordings(limit);
}

export async function loadRecordingContent(recordingId: string): Promise<Result<RecordingContentRef>> {
  const repository = new BackendRecordingsRepository();
  return repository.getRecordingContent(recordingId);
}
