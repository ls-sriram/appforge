import { dateOwner } from "../timestamp";

export type IdStrategy = "uuid7" | "random" | "timeOrdered";

export interface IdGenerationOptions {
  strategy?: IdStrategy;
}

export interface IdOwner {
  readonly defaultStrategy: IdStrategy;
  generate(options?: IdGenerationOptions): string;
  generateRandom(): string;
  generateTimeOrdered(): string;
}

export interface IdOwnerConfig {
  defaultStrategy?: IdStrategy;
}

const HEX: string[] = Array.from({ length: 256 }, (_, value) =>
  value.toString(16).padStart(2, "0"),
);

export function createIdOwner(config: IdOwnerConfig = {}): IdOwner {
  const defaultStrategy = config.defaultStrategy ?? "uuid7";

  return {
    defaultStrategy,
    generate(options?: IdGenerationOptions): string {
      const strategy = options?.strategy ?? defaultStrategy;

      if (strategy === "random") {
        return randomUuidV4();
      }

      if (strategy === "timeOrdered") {
        return timeOrderedId();
      }

      return uuidV7();
    },
    generateRandom(): string {
      return randomUuidV4();
    },
    generateTimeOrdered(): string {
      return timeOrderedId();
    },
  };
}

export const idOwner: IdOwner = createIdOwner({ defaultStrategy: "uuid7" });

function uuidV7(): string {
  const bytes = randomBytes(16);
  const timestamp = BigInt(dateOwner.now().getTime());

  bytes[0] = Number((timestamp >> 40n) & 0xffn);
  bytes[1] = Number((timestamp >> 32n) & 0xffn);
  bytes[2] = Number((timestamp >> 24n) & 0xffn);
  bytes[3] = Number((timestamp >> 16n) & 0xffn);
  bytes[4] = Number((timestamp >> 8n) & 0xffn);
  bytes[5] = Number(timestamp & 0xffn);

  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return formatUuid(bytes);
}

function randomUuidV4(): string {
  const bytes = randomBytes(16);

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return formatUuid(bytes);
}

function timeOrderedId(): string {
  const timestamp = dateOwner.now().getTime().toString(36).padStart(10, "0");
  const random = Array.from(randomBytes(8), (byte) => HEX[byte]).join("");

  return `${timestamp}-${random}`;
}

function formatUuid(bytes: Uint8Array): string {
  return (
    HEX[bytes[0]] +
    HEX[bytes[1]] +
    HEX[bytes[2]] +
    HEX[bytes[3]] +
    "-" +
    HEX[bytes[4]] +
    HEX[bytes[5]] +
    "-" +
    HEX[bytes[6]] +
    HEX[bytes[7]] +
    "-" +
    HEX[bytes[8]] +
    HEX[bytes[9]] +
    "-" +
    HEX[bytes[10]] +
    HEX[bytes[11]] +
    HEX[bytes[12]] +
    HEX[bytes[13]] +
    HEX[bytes[14]] +
    HEX[bytes[15]]
  );
}

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);

  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
    return bytes;
  }

  for (let index = 0; index < length; index += 1) {
    bytes[index] = Math.floor(Math.random() * 256);
  }

  return bytes;
}
