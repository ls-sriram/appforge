import {
  createRecordingShare,
  listOwnerEntityShares,
  listRecordingShares,
  revokeRecordingShare,
} from "./recording-share.service";

export const recordingShareUsecase = {
  createRecordingShare,
  listOwnerEntityShares,
  listRecordingShares,
  revokeRecordingShare,
};
