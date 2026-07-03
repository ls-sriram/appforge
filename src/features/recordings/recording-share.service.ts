import { Result } from "../../platform/core/types";
import { BackendRecordingSharesRepository } from "./backend-recording-shares.datasource";
import { RecordingShareModel } from "./share.model";
import { RecordingShareRepository } from "./share.repository";

const repository: RecordingShareRepository = new BackendRecordingSharesRepository();

export async function createRecordingShare(recordingId: string): Promise<Result<RecordingShareModel>> {
  return repository.createShare(recordingId);
}

export async function listRecordingShares(recordingId: string): Promise<Result<RecordingShareModel[]>> {
  return repository.listShares(recordingId);
}

export async function revokeRecordingShare(recordingId: string, shareUrl: string): Promise<Result<void>> {
  return repository.revokeShare(recordingId, shareUrl);
}

export async function listOwnerEntityShares(): Promise<Result<RecordingShareModel[]>> {
  return repository.listOwnerShares();
}
