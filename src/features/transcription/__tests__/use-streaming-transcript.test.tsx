import React from "react";
import { act, renderHook } from "@testing-library/react-native";
import { TranscriptionProvider } from "../transcription.context";
import { useStreamingTranscript } from "../streaming-transcription.viewmodel";

describe("useStreamingTranscript", () => {
  it("stays inert until start and forwards chunks explicitly", async () => {
    let listener: ((update: { text: string; isFinal: boolean }) => void) | undefined;
    const session = {
      append: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
      finish: jest.fn().mockResolvedValue({ ok: true, data: { recordingId: "r1", text: "Hello world" } }),
      cancel: jest.fn().mockResolvedValue(undefined),
      subscribe: jest.fn((next) => {
        listener = next;
        return jest.fn();
      }),
    };
    const streamingHandler = {
      start: jest.fn().mockResolvedValue({ ok: true, data: session }),
    };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TranscriptionProvider
        resolver={{ resolve: jest.fn() }}
        handler={{ transcribe: jest.fn() }}
        streamingHandler={streamingHandler}
      >
        {children}
      </TranscriptionProvider>
    );

    const { result } = renderHook(() => useStreamingTranscript("r1"), { wrapper });
    expect(streamingHandler.start).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.start({ contentType: "audio/webm" });
      await result.current.append(new Uint8Array([1, 2, 3]));
    });
    expect(session.append).toHaveBeenCalledTimes(1);

    act(() => listener?.({ text: "Hello", isFinal: false }));
    expect(result.current.state.partialText).toBe("Hello");

    await act(async () => { await result.current.finish(); });
    expect(result.current.state).toMatchObject({ status: "ready", partialText: "Hello world" });
  });
});

