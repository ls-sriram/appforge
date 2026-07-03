import { signIn } from "../../sign-in.usecase";

describe("auth/usecases/signIn", () => {
  it("delegates to repository signIn", async () => {
    const repo = {
      signIn: jest.fn().mockResolvedValue({ ok: true, data: { userId: "u1" } }),
    } as any;

    const result = await signIn(repo, "a@b.com", "pw");

    expect(repo.signIn).toHaveBeenCalledWith("a@b.com", "pw");
    expect(result).toEqual({ ok: true, data: { userId: "u1" } });
  });
});
