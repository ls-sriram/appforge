import { LoginController } from "../LoginController";

describe("login/controller integration", () => {
  it("authenticates on successful submit", async () => {
    const model = {
      signInWithEmailAndPassword: jest.fn().mockResolvedValue({ ok: true, data: { userId: "u1" } }),
      signOut: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
      checkAuthState: jest.fn().mockResolvedValue({ ok: true, data: { isAuthenticated: false, userId: null } }),
    };

    const controller = new LoginController(model as any);

    await controller.dispatch({ type: "email_changed", value: "user@example.com" });
    await controller.dispatch({ type: "password_changed", value: "secret" });
    const view = await controller.dispatch({ type: "submit" });

    expect(model.signInWithEmailAndPassword).toHaveBeenCalledWith("user@example.com", "secret");
    expect(view.isAuthenticated).toBe(true);
    expect(view.generalError).toBe("");
  });
});
