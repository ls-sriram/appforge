import { signUp } from "../sign-up";

describe("auth/usecases/signUp", () => {
  it("delegates to repository signUp", async () => {
    const repo = {
      signUp: jest.fn().mockResolvedValue({ ok: true, data: { userId: "u2" } }),
    } as any;

    const result = await signUp(repo, "x@y.com", "pw");

    expect(repo.signUp).toHaveBeenCalledWith("x@y.com", "pw");
    expect(result).toEqual({ ok: true, data: { userId: "u2" } });
  });
});
