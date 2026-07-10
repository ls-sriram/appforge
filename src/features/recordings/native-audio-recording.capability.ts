import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { recordingConfig } from "./recording.config";

interface NativeRecordingResult {
  audioBase64: string;
  contentType: string;
  durationSeconds?: number;
}

export class NativeAudioRecordingCapability {
  private recording: Audio.Recording | undefined;

  async prepare(): Promise<void> {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      throw new Error("Microphone permission denied.");
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: false,
    });
  }

  async start(): Promise<void> {
    if (this.recording) {
      throw new Error("A recording is already active.");
    }
    await this.prepare();

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync({
      android: {
        extension: ".m4a",
        outputFormat: Audio.AndroidOutputFormat.MPEG_4,
        audioEncoder: Audio.AndroidAudioEncoder.AAC,
        sampleRate: 48000,
        numberOfChannels: 1,
        bitRate: recordingConfig.audioBitsPerSecond,
      },
      ios: {
        extension: ".m4a",
        outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
        audioQuality: Audio.IOSAudioQuality.MAX,
        sampleRate: 48000,
        numberOfChannels: 1,
        bitRate: recordingConfig.audioBitsPerSecond,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      web: {
        mimeType: "audio/webm",
        bitsPerSecond: recordingConfig.audioBitsPerSecond,
      },
      isMeteringEnabled: false,
    });

    await recording.startAsync();
    this.recording = recording;
  }

  async stop(): Promise<NativeRecordingResult> {
    const recording = this.recording;
    if (!recording) {
      throw new Error("No active recording to stop.");
    }

    await recording.stopAndUnloadAsync();
    const status = await recording.getStatusAsync();
    const uri = recording.getURI();
    this.recording = undefined;

    if (!uri) {
      throw new Error("Recording URI unavailable after stop.");
    }

    const fetchResult = await fetch(uri);
    const blob = await fetchResult.blob();
    const audioBase64 = await blobToBase64(blob);
    const durationMillis = "durationMillis" in status ? status.durationMillis ?? 0 : 0;
    const durationSeconds = durationMillis > 0 ? Math.max(1, Math.round(durationMillis / 1000)) : undefined;

    return {
      audioBase64,
      contentType: blob.type || "audio/mp4",
      durationSeconds,
    };
  }

  async reset(): Promise<void> {
    if (!this.recording) return;
    try {
      const status = await this.recording.getStatusAsync();
      const isRecording = "isRecording" in status ? Boolean(status.isRecording) : false;
      if (isRecording) {
        await this.recording.stopAndUnloadAsync();
      }
    } finally {
      this.recording = undefined;
    }
  }

  async shutdown(): Promise<void> {
    await this.reset();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
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
