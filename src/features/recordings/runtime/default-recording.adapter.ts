import { runtime } from "../../../core/runtime";
import { Result } from "../../../core/types";
import { recordingConfig } from "../recording.config";
import { AudioRecordingCapability } from "./audio-recording.capability";
import { NativeAudioRecordingCapability } from "./native-audio-recording.capability";
import { RecordingRuntimeAdapter, RuntimeRecordingResult } from "./adapter";

class BrowserRecordingRuntimeAdapter implements RecordingRuntimeAdapter {
  private capability = new AudioRecordingCapability();

  async prepare(): Promise<Result<void>> {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      return { ok: false, error: "Microphone is not available in this browser." };
    }

    try {
      await this.capability.prepare();
      return { ok: true, data: undefined };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Could not prepare microphone.",
      };
    }
  }

  async start(): Promise<Result<void>> {
    const prepared = await this.prepare();
    if (!prepared.ok) return prepared;

    try {
      await this.capability.start();
      return { ok: true, data: undefined };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Could not start microphone recording.",
      };
    }
  }

  async stop(): Promise<Result<RuntimeRecordingResult>> {
    try {
      const blob = await this.capability.stop();
      const audioBase64 = await blobToBase64(blob);
      const durationSeconds = this.capability.getElapsedSeconds();
      return {
        ok: true,
        data: {
          audioBase64,
          contentType: blob.type || "audio/webm",
          durationSeconds: durationSeconds > 0 ? durationSeconds : recordingConfig.maxSeconds,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to process recording.",
      };
    }
  }

  reset(): void {
    this.capability.reset();
  }

  shutdown(): void {
    this.capability.shutdown();
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Unable to read recording output."));
        return;
      }
      const commaIndex = result.indexOf(",");
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.onerror = () => reject(new Error("Failed to encode recording."));
    reader.readAsDataURL(blob);
  });
}

export class DefaultRecordingRuntimeAdapter implements RecordingRuntimeAdapter {
  private readonly delegate: RecordingRuntimeAdapter;

  constructor() {
    if (runtime.isWeb) {
      this.delegate = new BrowserRecordingRuntimeAdapter();
      return;
    }
    this.delegate = new NativeRecordingRuntimeAdapter();
  }

  prepare(): Promise<Result<void>> {
    return this.delegate.prepare ? this.delegate.prepare() : Promise.resolve({ ok: true, data: undefined });
  }

  start(): Promise<Result<void>> {
    return this.delegate.start();
  }

  stop(): Promise<Result<RuntimeRecordingResult>> {
    return this.delegate.stop();
  }

  reset(): Promise<void> | void {
    return this.delegate.reset?.();
  }

  shutdown(): Promise<void> | void {
    return this.delegate.shutdown?.();
  }
}

class NativeRecordingRuntimeAdapter implements RecordingRuntimeAdapter {
  private capability = new NativeAudioRecordingCapability();

  async prepare(): Promise<Result<void>> {
    try {
      await this.capability.prepare();
      return { ok: true, data: undefined };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Could not prepare microphone.",
      };
    }
  }

  async start(): Promise<Result<void>> {
    try {
      await this.capability.start();
      return { ok: true, data: undefined };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Could not start microphone recording.",
      };
    }
  }

  async stop(): Promise<Result<RuntimeRecordingResult>> {
    try {
      const result = await this.capability.stop();
      return { ok: true, data: result };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to process recording.",
      };
    }
  }

  async reset(): Promise<void> {
    await this.capability.reset();
  }

  async shutdown(): Promise<void> {
    await this.capability.shutdown();
  }
}
