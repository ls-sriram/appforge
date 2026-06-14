import { Result } from "../../../core/types";
import { api } from "../../../services/ApiClient";
import { BackendUserProfileService } from "../../../services/UserProfileService";
import { getFirebaseAuth } from "../../../config/firebase";
import { SettingsRepository } from "../domain/repository";
import { SettingsIdentity } from "../domain/model";

export class BackendSettingsRepository implements SettingsRepository {
  private profileService = new BackendUserProfileService();

  async getIdentity(): Promise<Result<SettingsIdentity>> {
    const result = await this.profileService.getFullProfile();
    if (!result.ok) return { ok: false, error: result.error };
    if (!result.data?.identity) {
      return { ok: false, error: "Profile identity is missing." };
    }
    return {
      ok: true,
      data: {
        uid: result.data.identity.uid,
        email: result.data.identity.email,
        name: result.data.identity.name || undefined,
        createdAt: result.data.identity.createdAt || undefined,
        lastLoginAt: result.data.identity.lastLoginAt || undefined,
      },
    };
  }

  async updateProfileName(name: string): Promise<Result<void>> {
    return this.profileService.updateProfileName(name);
  }

  async signOut(): Promise<Result<void>> {
    try {
      await api.post("/session/logout");
      const { signOut } = await import("firebase/auth");
      await signOut(getFirebaseAuth());
      return { ok: true, data: undefined };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Sign out failed." };
    }
  }

  async deleteAccount(): Promise<Result<void>> {
    try {
      console.log("[settings] deleteAccount: sending DELETE /users/me");
      const result = await api.delete<{ success: boolean }>("/users/me");
      console.log("[settings] deleteAccount: response", { ok: result.ok, status: result.status });
      if (!result.ok) return { ok: false, error: result.error };
      if (!result.data?.success) return { ok: false, error: "Delete account failed." };
      const { signOut } = await import("firebase/auth");
      await signOut(getFirebaseAuth());
      console.log("[settings] deleteAccount: completed");
      return { ok: true, data: undefined };
    } catch (err) {
      console.error("[settings] deleteAccount: exception", err);
      return { ok: false, error: err instanceof Error ? err.message : "Delete account failed." };
    }
  }
}
