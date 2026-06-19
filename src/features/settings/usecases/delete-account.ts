import { Result } from "@core/types";
import { BackendSettingsRepository } from "../data/backend-settings.repository";

export async function deleteAccount(): Promise<Result<void>> {
  const repo = new BackendSettingsRepository();
  return repo.deleteAccount();
}
