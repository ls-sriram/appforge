/**
 * Setup file — runs BEFORE test framework. Mocks native modules.
 */

// PixelRatio mock (must be before any StyleSheet import)
jest.mock("react-native/Libraries/Utilities/PixelRatio", () => ({
  get: () => 2,
  set: jest.fn(),
  roundToNearestPixel: (s: number) => s,
  getPixelSizeForLayoutSize: (s: number) => s * 2,
  startDetecting: jest.fn(),
}));

// Dimensions mock
jest.mock("react-native/Libraries/Utilities/Dimensions", () => ({
  get: () => ({ width: 390, height: 844, scale: 2, fontScale: 1 }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Safe area context mock
jest.mock("react-native-safe-area-context", () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }: any) => children),
    SafeAreaView: jest.fn(({ children }: any) => children),
    useSafeAreaInsets: jest.fn(() => inset),
    useSafeAreaFrame: jest.fn(() => ({ x: 0, y: 0, width: 390, height: 844 })),
  };
});
