import { BackendSettingsRepository } from "../data/backend-settings.repository";

export async function saveProfileName(name: string): Promise<boolean> {
  const repo = new BackendSettingsRepository();
  const result = await repo.updateProfileName(name);
  return result.ok;
}
