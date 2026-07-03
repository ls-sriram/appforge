import { IsoUtcTimestamp } from "../../platform/core/dates/index";

export interface PublicShareEntity {
  id: string;
  category: string;
  title?: string;
  subtitle?: string;
  content?: string;
  question?: string;
  assetUrl?: string;
}

export interface PublicShareMetadata {
  token: string;
  entityType: string;
  entityId: string;
  accessMode: string;
  expiresAt?: IsoUtcTimestamp;
  revokedAt?: IsoUtcTimestamp;
}

export interface PublicShareModel {
  share: PublicShareMetadata;
  entity: PublicShareEntity;
}
