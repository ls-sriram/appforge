import { recordingConfig } from "../recording.config";

export interface AudioRecordingSnapshot {
  isRecording: boolean;
  isPreparing: boolean;
  elapsedSeconds: number;
  audioBlob: Blob | null;
  error: string | null;
  generation: number;
}

export class AudioRecordingCapability {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private startedAtMs = 0;
  private timerHandle: ReturnType<typeof setInterval> | null = null;
  private preparationPromise: Promise<MediaStream> | null = null;
  private currentGeneration = 0;

  private snapshot: AudioRecordingSnapshot = {
    isRecording: false,
    isPreparing: false,
    elapsedSeconds: 0,
    audioBlob: null,
    error: null,
    generation: 0,
  };

  async prepare(): Promise<MediaStream> {
    if (this.preparationPromise) return this.preparationPromise;

    this.snapshot = { ...this.snapshot, isPreparing: true, error: null };

    this.preparationPromise = (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(recordingConfig.mediaStreamConstraints);
        this.stream = stream;
        this.snapshot = { ...this.snapshot, isPreparing: false };
        return stream;
      } catch (error) {
        this.snapshot = {
          ...this.snapshot,
          isPreparing: false,
          error: error instanceof Error ? error.message : "Microphone permission denied.",
        };
        this.preparationPromise = null;
        throw error;
      }
    })();

    return this.preparationPromise;
  }

  async start(): Promise<void> {
    if (this.snapshot.isRecording) return;

    this.currentGeneration += 1;
    const generation = this.currentGeneration;
    const stream = await this.prepare();

    const options = this.resolveRecorderOptions();
    const recorder = options ? new MediaRecorder(stream, options) : new MediaRecorder(stream);
    this.mediaRecorder = recorder;
    this.chunks = [];
    this.startedAtMs = Date.now();

    recorder.ondataavailable = (event) => {
      if (this.currentGeneration !== generation) return;
      if (event.data.size > 0) this.chunks.push(event.data);
    };

    recorder.onstop = () => {
      if (this.currentGeneration !== generation) return;
      this.snapshot = {
        ...this.snapshot,
        isRecording: false,
        audioBlob: new Blob(this.chunks, { type: recorder.mimeType || "audio/webm" }),
      };
    };

    recorder.start();
    this.startTimer(generation);
    this.snapshot = {
      ...this.snapshot,
      isRecording: true,
      elapsedSeconds: 0,
      generation,
      audioBlob: null,
      error: null,
    };
  }

  async stop(): Promise<Blob> {
    const recorder = this.mediaRecorder;
    if (!recorder || recorder.state !== "recording") {
      throw new Error("No active recording to stop.");
    }

    return new Promise<Blob>((resolve, reject) => {
      recorder.onerror = () => {
        this.cleanupRecorderOnly();
        reject(new Error("Microphone recording failed."));
      };

      recorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: recorder.mimeType || "audio/webm" });
        this.cleanupRecorderOnly();
        this.snapshot = {
          ...this.snapshot,
          isRecording: false,
          audioBlob: blob,
        };
        resolve(blob);
      };

      recorder.stop();
      this.stopTimer();
    });
  }

  getElapsedSeconds(): number {
    if (!this.startedAtMs) return 0;
    return Math.max(0, Math.floor((Date.now() - this.startedAtMs) / 1000));
  }

  getSnapshot(): AudioRecordingSnapshot {
    return this.snapshot;
  }

  reset(): void {
    this.stopTimer();
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    this.cleanupRecorderOnly();
    this.snapshot = {
      ...this.snapshot,
      isRecording: false,
      elapsedSeconds: 0,
      audioBlob: null,
      error: null,
    };
  }

  shutdown(): void {
    this.reset();
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.preparationPromise = null;
  }

  private startTimer(generation: number): void {
    this.stopTimer();
    this.timerHandle = setInterval(() => {
      if (this.currentGeneration !== generation) {
        this.stopTimer();
        return;
      }
      const elapsed = this.getElapsedSeconds();
      this.snapshot = {
        ...this.snapshot,
        elapsedSeconds: elapsed,
      };
    }, recordingConfig.timerTickMs);
  }

  private stopTimer(): void {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  }

  private cleanupRecorderOnly(): void {
    this.mediaRecorder = null;
    this.chunks = [];
    this.startedAtMs = 0;
  }

  private resolveRecorderOptions(): MediaRecorderOptions | undefined {
    if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) return undefined;

    const mimeType = recordingConfig.preferredMimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
    if (!mimeType) {
      return { audioBitsPerSecond: recordingConfig.audioBitsPerSecond };
    }

    return {
      mimeType,
      audioBitsPerSecond: recordingConfig.audioBitsPerSecond,
    };
  }
}
