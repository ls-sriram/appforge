import { BackendRecordingsRepository } from "../../backend-recordings.datasource";

jest.mock("@api/client", () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
    buildUrl: jest.fn((path: string) => `http://localhost:8080/api/v1${path}`),
  },
}));

import { api } from "../../../../platform/api/client";

const mockApi = api as jest.Mocked<typeof api>;

describe("BackendRecordingsRepository", () => {
  it("maps create response", async () => {
    mockApi.post.mockResolvedValueOnce({
      ok: true,
      data: {
        id: "r1",
        createdAt: { seconds: 1770000000, nanos: 0 },
        durationSeconds: 12,
        contentType: "audio/webm",
        sizeBytes: 1234,
      },
    } as any);

    const repo = new BackendRecordingsRepository();
    const result = await repo.createRecording({ audioBase64: "YQ==", contentType: "audio/webm", durationSeconds: 12 });

    expect(result.ok).toBe(true);
    expect(mockApi.post).toHaveBeenCalledWith(
      "/recordings",
      expect.objectContaining({
        audioBase64: "YQ==",
        contentType: "audio/webm",
        durationSeconds: 12,
      }),
    );
    if (result.ok) {
      expect(result.data.id).toBe("r1");
      expect(result.data.contentType).toBe("audio/webm");
      expect(result.data.sizeBytes).toBe(1234);
    }
  });

  it("maps list response", async () => {
    mockApi.get.mockResolvedValueOnce({
      ok: true,
      data: {
        recordings: [
          {
            id: "r1",
            createdAt: { seconds: 1770000000, nanos: 0 },
            durationSeconds: 12,
            contentType: "audio/webm",
            sizeBytes: 1234,
          },
        ],
      },
    } as any);

    const repo = new BackendRecordingsRepository();
    const result = await repo.listRecordings(20);

    expect(result.ok).toBe(true);
    expect(mockApi.get).toHaveBeenCalledWith("/recordings?limit=20");
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe("r1");
    }
  });

  it("builds recording content URL from canonical recordings path", async () => {
    const repo = new BackendRecordingsRepository();
    const result = await repo.getRecordingContent("abc123");

    expect(result.ok).toBe(true);
    expect(mockApi.buildUrl).toHaveBeenCalledWith("/recordings/abc123/content");
    if (result.ok) {
      expect(result.data.playbackUrl).toBe("http://localhost:8080/api/v1/recordings/abc123/content");
    }
  });
});
