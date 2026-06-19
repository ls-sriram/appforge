import { Result } from "@core/types";
import { RecordingShareModel } from "./share-model";

export interface RecordingShareRepository {
  createShare(recordingId: string): Promise<Result<RecordingShareModel>>;
  listShares(recordingId: string): Promise<Result<RecordingShareModel[]>>;
  revokeShare(recordingId: string, shareUrl: string): Promise<Result<void>>;
  listOwnerShares(): Promise<Result<RecordingShareModel[]>>;
}
