import type { IsoUtcTimestamp } from "@core/dates";

export interface RecordingShareModel {
  id: string;
  entityType: string;
  entityId: string;
  shareUrl: string;
  expiresAt: IsoUtcTimestamp;
  revokedAt?: IsoUtcTimestamp;
}
