import { Result } from "../../platform/core/types";
import { BackendSettingsRepository } from "./backend-settings.datasource";

export async function deleteAccount(): Promise<Result<void>> {
  const repo = new BackendSettingsRepository();
  return repo.deleteAccount();
}
