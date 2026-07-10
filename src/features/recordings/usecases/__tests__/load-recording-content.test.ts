import { loadRecordingContent } from "../../recording-actions.usecase";

jest.mock("../../backend-recordings.datasource", () => ({
  BackendRecordingsRepository: jest.fn().mockImplementation(() => ({
    getRecordingContent: jest.fn().mockResolvedValue({ ok: true, data: { playbackUrl: "https://example.com/audio" } }),
  })),
}));

describe("recordings/usecases/loadRecordingContent", () => {
  it("returns playback url", async () => {
    const result = await loadRecordingContent("r1");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.playbackUrl).toContain("audio");
    }
  });
});
