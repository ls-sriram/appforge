import { Result } from "../../../core/types";
import { AuthRepository } from "../domain/repository";

export async function signOut(repo: AuthRepository): Promise<Result<void>> {
  return repo.signOut();
}
