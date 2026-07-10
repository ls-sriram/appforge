jest.mock("expo-speech-recognition", () => ({ ExpoSpeechRecognitionModule: {} }));

import { LiveTranscriptionManager } from "../live-transcription.runtime";

function createSpeechModule() {
  const listeners = new Map<string, (event?: any) => void>();
  return {
    listeners,
    module: {
      addListener: jest.fn((name: string, listener: (event?: any) => void) => {
        listeners.set(name, listener);
        return { remove: jest.fn() };
      }),
      isRecognitionAvailable: jest.fn(() => true),
      requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
      start: jest.fn(),
      stop: jest.fn(),
    },
  };
}

describe("LiveTranscriptionManager", () => {
  it("is lazy, ignores duplicate starts, and emits interim and final text", async () => {
    const speech = createSpeechModule();
    const manager = new LiveTranscriptionManager(speech.module as never);
    const updates: Array<{ transcript: string; isFinal: boolean }> = [];
    manager.subscribeTranscript((event) => updates.push(event));

    expect(speech.module.requestPermissionsAsync).not.toHaveBeenCalled();
    manager.start({ language: "en-US", contextualStrings: ["next"] });
    manager.start({ language: "en-US" });
    await Promise.resolve();

    expect(speech.module.requestPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(speech.module.start).toHaveBeenCalledWith(expect.objectContaining({ lang: "en-US", contextualStrings: ["next"] }));

    speech.listeners.get("start")?.();
    speech.listeners.get("result")?.({ isFinal: false, results: [{ transcript: "two" }] });
    speech.listeners.get("result")?.({ isFinal: true, results: [{ transcript: "two next" }] });

    expect(updates).toEqual([
      { transcript: "two", isFinal: false },
      { transcript: "two next", isFinal: true },
    ]);
    expect(manager.getState()).toMatchObject({ isRecording: true, transcript: "two next" });
  });

  it("makes stop safe before and during recognition", async () => {
    const speech = createSpeechModule();
    const manager = new LiveTranscriptionManager(speech.module as never);
    manager.stop();
    expect(speech.module.stop).not.toHaveBeenCalled();

    manager.start();
    await Promise.resolve();
    speech.listeners.get("start")?.();
    manager.stop();
    manager.stop();

    expect(speech.module.stop).toHaveBeenCalledTimes(1);
  });

  it("normalizes transient recognizer errors", () => {
    const speech = createSpeechModule();
    const manager = new LiveTranscriptionManager(speech.module as never);
    speech.listeners.get("error")?.({ error: "busy" });
    expect(manager.getState().error).toContain("busy");
  });
});
