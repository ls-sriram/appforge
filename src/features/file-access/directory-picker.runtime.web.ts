export interface PickDirectoryOptions {
  mode?: "read" | "readwrite";
}

export async function pickDirectoryHandle(
  options: PickDirectoryOptions = {},
): Promise<FileSystemDirectoryHandle | undefined> {
  if (!("showDirectoryPicker" in window)) return undefined;

  try {
    // @ts-ignore -- File System Access API not in all TS lib versions
    return await window.showDirectoryPicker({ mode: options.mode ?? "read" });
  } catch {
    return undefined;
  }
}
