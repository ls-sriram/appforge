import { Result } from "../../platform/core/types";
import { AuthRepository } from "./auth.repository";

export async function signUp(
  repo: AuthRepository,
  email: string,
  password: string,
  fullName?: string,
): Promise<Result<{ userId: string }>> {
  return repo.signUp(email, password, fullName);
}
