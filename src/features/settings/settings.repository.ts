import { Result } from "../../platform/core/types";
import { SettingsIdentity } from "./settings.types";

export interface SettingsRepository {
  getIdentity(): Promise<Result<SettingsIdentity>>;
  updateProfileName(name: string): Promise<Result<void>>;
  signOut(): Promise<Result<void>>;
  deleteAccount(): Promise<Result<void>>;
}
