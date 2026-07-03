import { BackendSettingsRepository } from "./backend-settings.datasource";

export async function saveProfileName(name: string): Promise<boolean> {
  const repo = new BackendSettingsRepository();
  const result = await repo.updateProfileName(name);
  return result.ok;
}
