import type { IsoUtcTimestamp } from "../../platform/core/dates/index";

export interface SettingsIdentity {
  uid: string;
  email: string;
  name?: string;
  createdAt?: IsoUtcTimestamp;
  lastLoginAt?: IsoUtcTimestamp;
}
