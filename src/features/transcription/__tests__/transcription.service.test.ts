import { TranscriptionService } from "../transcription.service";

describe("TranscriptionService", () => {
  it("does nothing until request and caches the completed transcript", async () => {
    const resolver = {
      resolve: jest.fn().mockResolvedValue({
        ok: true,
        data: { recordingId: "r1", contentUrl: "https://example.com/r1" },
      }),
    };
    const handler = {
      transcribe: jest.fn().mockResolvedValue({
        ok: true,
        data: { recordingId: "r1", text: "Hello" },
      }),
    };
    const service = new TranscriptionService(resolver, handler);

    expect(resolver.resolve).not.toHaveBeenCalled();
    expect(handler.transcribe).not.toHaveBeenCalled();

    const first = await service.request("r1");
    const second = await service.request("r1");

    expect(first).toEqual(second);
    expect(resolver.resolve).toHaveBeenCalledTimes(1);
    expect(handler.transcribe).toHaveBeenCalledTimes(1);
    expect(service.getState("r1")).toMatchObject({ status: "ready", transcript: { text: "Hello" } });
  });

  it("deduplicates concurrent requests", async () => {
    let finish: ((value: unknown) => void) | undefined;
    const handler = {
      transcribe: jest.fn(() => new Promise((resolve) => { finish = resolve; })),
    };
    const service = new TranscriptionService(
      { resolve: jest.fn().mockResolvedValue({ ok: true, data: { recordingId: "r1", contentUrl: "url" } }) },
      handler as never,
    );

    const first = service.request("r1");
    const second = service.request("r1");
    await Promise.resolve();
    finish?.({ ok: true, data: { recordingId: "r1", text: "Done" } });

    await expect(first).resolves.toMatchObject({ ok: true });
    await expect(second).resolves.toMatchObject({ ok: true });
    expect(handler.transcribe).toHaveBeenCalledTimes(1);
  });
});

