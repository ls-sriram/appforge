import { Result } from "../../platform/core/types";
import { AuthRepository } from "./auth.repository";

export async function signIn(
  repo: AuthRepository,
  email: string,
  password: string,
): Promise<Result<{ userId: string }>> {
  return repo.signIn(email, password);
}
