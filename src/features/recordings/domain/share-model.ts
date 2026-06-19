import type { IsoUtcTimestamp } from "../../../platform/core/dates";

export interface RecordingShareModel {
  id: string;
  entityType: string;
  entityId: string;
  shareUrl: string;
  expiresAt: IsoUtcTimestamp;
  revokedAt?: IsoUtcTimestamp;
}
