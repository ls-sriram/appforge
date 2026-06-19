import { AuthRepository, AuthState } from "../domain/repository";
import { AuthService } from "../services/auth.service";
import { BackendAuthService } from "../services/backend-auth.service";
import { Result } from "@core/types";

export class BackendAuthRepository implements AuthRepository {
  private service: AuthService;

  constructor(service?: AuthService) {
    this.service = service ?? new BackendAuthService();
  }

  signIn(email: string, password: string): Promise<Result<{ userId: string }>> {
    return this.service.signIn(email, password);
  }

  signUp(email: string, password: string, fullName?: string): Promise<Result<{ userId: string }>> {
    return this.service.signUp(email, password, fullName);
  }

  sendPasswordResetLink(email: string): Promise<Result<void>> {
    return this.service.sendPasswordResetLink(email);
  }

  signOut(): Promise<Result<void>> {
    return this.service.signOut();
  }

  checkAuthState(): Promise<Result<AuthState>> {
    return this.service.checkAuthState();
  }
}
