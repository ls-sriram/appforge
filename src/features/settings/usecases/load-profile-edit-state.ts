import { Result } from "../../../platform/core/types";
import { BackendSettingsRepository } from "../data/backend-settings.repository";

export interface ProfileEditLoadedState {
  uid: string;
  email: string;
  name: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export async function loadProfileEditState(): Promise<Result<ProfileEditLoadedState>> {
  const repo = new BackendSettingsRepository();
  const res = await repo.getIdentity();
  if (!res.ok) return { ok: false, error: res.error };
  return {
    ok: true,
    data: {
      uid: res.data.uid,
      email: res.data.email,
      name: res.data.name ?? "",
      createdAt: res.data.createdAt,
      lastLoginAt: res.data.lastLoginAt,
    },
  };
}
