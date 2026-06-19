import { Result } from "../../../platform/core/types";
import { SettingsIdentity } from "../domain/model";
import { BackendSettingsRepository } from "../data/backend-settings.repository";

export async function loadSettingsIdentity(
): Promise<Result<SettingsIdentity>> {
  const repo = new BackendSettingsRepository();
  return repo.getIdentity();
}
