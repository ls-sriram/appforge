import { Result } from "../../../core/types";
import { AuthRepository } from "../domain/repository";

export async function signIn(
  repo: AuthRepository,
  email: string,
  password: string,
): Promise<Result<{ userId: string }>> {
  return repo.signIn(email, password);
}
