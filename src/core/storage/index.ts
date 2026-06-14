export async function readKeyValueStorage(key: string): Promise<string | undefined> {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key) ?? undefined;
    }
  } catch {
    // fall through to native storage
  }

  try {
    const { default: AsyncStorage } = await import("@react-native-async-storage/async-storage");
    return (await AsyncStorage.getItem(key)) ?? undefined;
  } catch {
    return undefined;
  }
}

export async function writeKeyValueStorage(
  key: string,
  value: string | undefined,
): Promise<void> {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      if (value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, value);
      }
      return;
    }
  } catch {
    // fall through to native storage
  }

  try {
    const { default: AsyncStorage } = await import("@react-native-async-storage/async-storage");
    if (value === undefined) {
      await AsyncStorage.removeItem(key);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch {
    // storage unavailable
  }
}
