import { parsePlanModel } from "../plan";

describe("parsePlanModel", () => {
  it("parses valid backend plan payload", () => {
    const result = parsePlanModel({
      name: "pro",
      status: "active",
      expiresAt: "2026-05-15T12:00:00.000Z",
      startedAt: "2026-05-01T12:00:00.000Z",
      cancelAtPeriodEnd: false,
      checkoutUrl: "https://example.com/checkout",
    });

    expect(result).toEqual({
      name: "pro",
      status: "active",
      expiresAt: "2026-05-15T12:00:00.000Z",
      startedAt: "2026-05-01T12:00:00.000Z",
      cancelAtPeriodEnd: false,
      checkoutUrl: "https://example.com/checkout",
    });
  });

  it("falls back for unknown name/status and invalid timestamps", () => {
    const result = parsePlanModel({
      name: "enterprise",
      status: "queued",
      expiresAt: "not-a-date",
      startedAt: undefined,
      cancelAtPeriodEnd: undefined,
      checkoutUrl: undefined,
    });

    expect(result).toEqual({
      name: "free",
      status: "active",
      expiresAt: undefined,
      startedAt: undefined,
      cancelAtPeriodEnd: false,
      checkoutUrl: undefined,
    });
  });

  it("returns undefined for missing payload", () => {
    expect(parsePlanModel(undefined)).toBeUndefined();
  });
});
