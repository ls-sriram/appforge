/**
 * UserProfileService tests — verifies API integration contract.
 */

import { BackendUserProfileService } from "../user-profile.service";

// Mock the API client
jest.mock("@api/client", () => ({
  api: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));
jest.mock("@api/proto-client", () => ({
  callProto: jest.fn(),
}));

import { api } from "../../../platform/api/client";
import { callProto } from "../../../platform/api/proto-client";

const mockApi = api as jest.Mocked<typeof api>;
const mockCallProto = callProto as jest.MockedFunction<typeof callProto>;

function makeService() {
  return new BackendUserProfileService();
}

// ─── getIdentity ──────────────────────────────────────────────────

describe("BackendUserProfileService.getIdentity", () => {
  it("returns user identity on success", async () => {
    mockCallProto.mockResolvedValueOnce({
      ok: true,
      data: {
        identity: {
          uid: "abc123",
          email: "test@example.com",
          name: "Test User",
        },
      },
    } as any);

    const service = makeService();
    const result = await service.getIdentity();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({
        uid: "abc123",
        email: "test@example.com",
        name: "Test User",
        createdAt: undefined,
        lastLoginAt: undefined,
      });
    }
  });

  it("returns error when uid is missing", async () => {
    mockCallProto.mockResolvedValueOnce({
      ok: true,
      data: { identity: { uid: "", email: "", name: "" } },
    } as any);

    const result = await makeService().getIdentity();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("missing uid");
    }
  });

  it("returns error when API call fails", async () => {
    mockCallProto.mockResolvedValueOnce({
      ok: false,
      error: "Network error",
    } as any);

    const result = await makeService().getIdentity();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Network error");
    }
  });
});

// ─── getFullProfile ───────────────────────────────────────────────

describe("BackendUserProfileService.getFullProfile", () => {
  it("returns full profile when /users/me succeeds", async () => {
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const pastDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

    mockApi.get.mockResolvedValueOnce({
      ok: true,
      data: {
        uid: "user1",
        email: "user@test.com",
        name: "Jane",
        createdAt: pastDate,
        lastLoginAt: futureDate,
        plan: {
          name: "pro",
          status: "active",
          expiresAt: futureDate,
          startedAt: pastDate,
          cancelAtPeriodEnd: false,
          checkoutUrl: undefined,
          source: "dodo_payments",
        },
        usage: {
          reviewSubmissions: { used: 10, limit: 100, unlocked: false },
          entityCreations: { used: 5, limit: 100, unlocked: false },
          apiRequests: { used: 50, limit: 1000, unlocked: false },
          sharedLinks: { used: 2, limit: 100, unlocked: false },
          storageBytes: { used: 5242880, limit: 1073741824, unlocked: false },
        },
      },
    } as any);

    const result = await makeService().getFullProfile();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.identity.uid).toBe("user1");
      expect(result.data.plan?.name).toBe("pro");
      expect(result.data.plan?.status).toBe("active");
      expect(result.data.usage?.reviewSubmissions.used).toBe(10);
      expect(result.data.usage?.storageBytes.limit).toBe(1073741824);
    }
  });

  it("returns error when /users/me fails", async () => {
    mockApi.get.mockRejectedValueOnce(new Error("Not found"));

    const result = await makeService().getFullProfile();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("Not found");
    }
  });
});

describe("BackendUserProfileService.updateProfileName", () => {
  it("updates profile name when /users/me succeeds", async () => {
    mockApi.put.mockResolvedValueOnce({
      ok: true,
      data: { success: true },
    } as any);

    const result = await makeService().updateProfileName("Updated Name");
    expect(result.ok).toBe(true);
    expect(mockApi.put).toHaveBeenCalledWith("/users/me", { name: "Updated Name" });
  });

  it("rejects blank profile names", async () => {
    const result = await makeService().updateProfileName("   ");
    expect(result.ok).toBe(false);
  });
});

describe("BackendUserProfileService.getUsageSummary", () => {
  it("maps usage summary response", async () => {
    mockApi.get.mockResolvedValueOnce({
      ok: true,
      data: {
        granularity: "day",
        series: [
          {
            metric: "reviews",
            total: 5,
            buckets: [{ windowStart: "2026-05-01T00:00:00.000Z", count: 2 }],
          },
          {
            metric: "entities",
            total: 3,
            buckets: [],
          },
        ],
      },
    } as any);

    const result = await makeService().getUsageSummary({
      granularity: "day",
      from: "2026-05-01T00:00:00.000Z" as any,
      to: "2026-05-31T00:00:00.000Z" as any,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.granularity).toBe("day");
      expect(result.data.series[0].metric).toBe("reviews");
      expect(result.data.series[0].points[0].count).toBe(2);
      expect(result.data.series[1].metric).toBe("entities");
    }
  });

  it("handles empty usage series as valid", async () => {
    mockApi.get.mockResolvedValueOnce({
      ok: true,
      data: { granularity: "week", series: [] },
    } as any);

    const result = await makeService().getUsageSummary({ granularity: "week" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.series).toEqual([]);
      expect(result.data.granularity).toBe("week");
    }
  });
});
