import { Result } from "../../../core/types";
import { AuthRepository } from "../domain/repository";

export async function sendPasswordResetLink(
  repo: AuthRepository,
  email: string,
): Promise<Result<void>> {
  return repo.sendPasswordResetLink(email);
}
