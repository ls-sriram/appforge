import { Result } from "@core/types";
import { BackendSettingsRepository } from "../data/backend-settings.repository";

export async function signOut(): Promise<Result<void>> {
  const repo = new BackendSettingsRepository();
  return repo.signOut();
}
