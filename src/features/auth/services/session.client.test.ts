import { api } from "../../../platform/api/client";
import {
  __resetSessionClientForTests,
  getSessionMe,
  isSessionAuthenticated,
} from "../session.client";

jest.mock("@api/client", () => ({
  api: {
    get: jest.fn(),
  },
}));

const mockApi = api as jest.Mocked<typeof api>;

describe("SessionClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.get.mockReset();
    __resetSessionClientForTests();
  });

  it("dedupes concurrent getSessionMe calls into one network call", async () => {
    let resolveCall: (value: any) => void = () => {};
    mockApi.get.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveCall = resolve;
        }) as any,
    );

    const p1 = getSessionMe();
    const p2 = getSessionMe();
    const p3 = getSessionMe();

    expect(mockApi.get).toHaveBeenCalledTimes(1);
    resolveCall({
      ok: true,
      data: { identity: { uid: "u1", email: "u1@example.com" } },
    });

    const [r1, r2, r3] = await Promise.all([p1, p2, p3]);
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    expect(r3.ok).toBe(true);
  });

  it("retries network after settled success (no post-settle cache window)", async () => {
    mockApi.get.mockResolvedValueOnce({
      ok: true,
      data: { identity: { uid: "a", email: "a@example.com" } },
    } as any);
    await getSessionMe();

    mockApi.get.mockResolvedValueOnce({
      ok: true,
      data: { identity: { uid: "a", email: "a@example.com" } },
    } as any);
    await getSessionMe();

    expect(mockApi.get).toHaveBeenCalledTimes(2);
  });

  it("clears pending state after failure so next call retries", async () => {
    mockApi.get.mockRejectedValueOnce(new Error("boom"));
    const first = await getSessionMe();
    expect(first.ok).toBe(false);

    mockApi.get.mockResolvedValueOnce({
      ok: true,
      data: { identity: { uid: "retry", email: "retry@example.com" } },
    } as any);
    const second = await getSessionMe();
    expect(second.ok).toBe(true);

    expect(mockApi.get).toHaveBeenCalledTimes(2);
  });

  it("isSessionAuthenticated handles identity and legacy uid shapes", () => {
    expect(isSessionAuthenticated({ identity: { uid: "abc" } } as any)).toBe(true);
    expect(isSessionAuthenticated({ uid: "legacy" } as any)).toBe(true);
    expect(isSessionAuthenticated({} as any)).toBe(false);
  });
});
