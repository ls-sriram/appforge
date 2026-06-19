export type IsoUtcTimestamp = string;

export interface ProtoTimestampLike {
  seconds: string | number | bigint;
  nanos?: number;
}

export function asIsoUtcTimestamp(value?: string): IsoUtcTimestamp | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

export function fromProtoTimestamp(
  value?: ProtoTimestampLike,
): IsoUtcTimestamp | undefined {
  if (!value) return undefined;
  const secondsRaw = value.seconds;
  const seconds =
    typeof secondsRaw === "bigint" ? Number(secondsRaw) : Number(secondsRaw);
  if (!Number.isFinite(seconds)) return undefined;

  const nanos = Number(value.nanos ?? 0);
  if (!Number.isFinite(nanos)) return undefined;

  const millis = seconds * 1000 + nanos / 1_000_000;
  const parsed = new Date(millis);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

export function toProtoTimestamp(
  value?: string | Date | number,
): { seconds: number; nanos: number } | undefined {
  const parsed = value instanceof Date ? value : value == null ? undefined : new Date(value);
  if (!parsed || Number.isNaN(parsed.getTime())) return undefined;

  const millis = parsed.getTime();
  const wholeSeconds = Math.floor(millis / 1000);
  const remainderMillis = millis - wholeSeconds * 1000;

  return {
    seconds: wholeSeconds,
    nanos: Math.floor(remainderMillis * 1_000_000),
  };
}

export interface DateOwner {
  now(): Date;
  nowIso(): IsoUtcTimestamp;
  parse(value?: string | Date | number): Date | undefined;
  toIso(value?: string | Date | number): IsoUtcTimestamp | undefined;
  format(
    value?: string | Date | number,
    locale?: string,
    options?: Intl.DateTimeFormatOptions,
  ): string;
}

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export const dateOwner: DateOwner = {
  now(): Date {
    return new Date();
  },
  nowIso(): IsoUtcTimestamp {
    return new Date().toISOString();
  },
  parse(value?: string | Date | number): Date | undefined {
    if (value == null) {
      return undefined;
    }

    const candidate = value instanceof Date ? new Date(value.getTime()) : new Date(value);
    return Number.isNaN(candidate.getTime()) ? undefined : candidate;
  },
  toIso(value?: string | Date | number): IsoUtcTimestamp | undefined {
    const parsed = this.parse(value);
    return parsed ? parsed.toISOString() : undefined;
  },
  format(
    value?: string | Date | number,
    locale = "en-US",
    options: Intl.DateTimeFormatOptions = DEFAULT_FORMAT,
  ): string {
    const parsed = this.parse(value);
    if (!parsed) {
      return "-";
    }

    return new Intl.DateTimeFormat(locale, options).format(parsed);
  },
};
