import { act, renderHook } from "@testing-library/react-native";
import { useSettingsViewModel } from "../use-settings-viewmodel";

jest.mock("../../usecases/load-settings-identity", () => ({
  loadSettingsIdentity: jest.fn().mockResolvedValue({
    ok: true,
    data: { uid: "u1", email: "a@b.com", name: "A", createdAt: null, lastLoginAt: null },
  }),
}));

jest.mock("../../usecases/sign-out", () => ({
  signOut: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
}));

describe("settings/viewmodel/useSettingsViewModel", () => {
  it("loads identity and exposes signOut action", async () => {
    const { result } = renderHook(() => useSettingsViewModel());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.identity?.uid).toBe("u1");

    await act(async () => {
      await result.current.actions.signOut();
    });
  });
});
