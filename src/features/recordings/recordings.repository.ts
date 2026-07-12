import { Result } from "../../platform/core/types";
import { RecordingCapturePayload, RecordingContentRef, RecordingModel } from "./recordings.model";

export interface RecordingsRepository {
  createRecording(input: RecordingCapturePayload): Promise<Result<RecordingModel>>;
  listRecordings(limit?: number): Promise<Result<RecordingModel[]>>;
  getRecordingContent(recordingId: string): Promise<Result<RecordingContentRef>>;
  deleteRecording(recordingId: string): Promise<Result<void>>;
}
