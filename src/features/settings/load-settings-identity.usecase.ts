import { Result } from "../../platform/core/types";
import { SettingsIdentity } from "./settings.model";
import { BackendSettingsRepository } from "./backend-settings.datasource";

export async function loadSettingsIdentity(
): Promise<Result<SettingsIdentity>> {
  const repo = new BackendSettingsRepository();
  return repo.getIdentity();
}
