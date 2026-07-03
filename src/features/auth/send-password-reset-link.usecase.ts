import { Result } from "../../platform/core/types";
import { AuthRepository } from "./auth.repository";

export async function sendPasswordResetLink(
  repo: AuthRepository,
  email: string,
): Promise<Result<void>> {
  return repo.sendPasswordResetLink(email);
}
