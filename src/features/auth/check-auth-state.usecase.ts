import { Result } from "../../platform/core/types";
import { AuthRepository, AuthState } from "./auth.repository";

export async function checkAuthState(
  repo: AuthRepository,
): Promise<Result<AuthState>> {
  return repo.checkAuthState();
}
