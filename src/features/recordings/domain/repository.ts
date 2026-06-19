import { Result } from "@core/types";
import { RecordingCapturePayload, RecordingContentRef, RecordingModel } from "./model";

export interface RecordingsRepository {
  createRecording(input: RecordingCapturePayload): Promise<Result<RecordingModel>>;
  listRecordings(limit?: number): Promise<Result<RecordingModel[]>>;
  getRecordingContent(recordingId: string): Promise<Result<RecordingContentRef>>;
}
