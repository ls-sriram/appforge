import type { IsoUtcTimestamp } from "@core/dates";

export interface SettingsIdentity {
  uid: string;
  email: string;
  name?: string;
  createdAt?: IsoUtcTimestamp;
  lastLoginAt?: IsoUtcTimestamp;
}
