import {
  createRecordingShare,
  listOwnerEntityShares,
  listRecordingShares,
  revokeRecordingShare,
} from "../services/recording-share.service";

export const recordingShareUsecase = {
  createRecordingShare,
  listOwnerEntityShares,
  listRecordingShares,
  revokeRecordingShare,
};
