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

// The package's own jestSetup replaces the whole `react-native` module,
// which stomps on the PixelRatio mock above and breaks anything (like
// react-native-svg) that touches RN's StyleSheet afterward. Provide just
// the pieces Sheet.tsx uses instead of pulling that in.
jest.mock("react-native-gesture-handler", () => {
  const React = require("react");
  const chain = () => {
    const gesture: any = {};
    for (const method of ["onUpdate", "onEnd", "onBegin", "onFinalize", "onStart"]) {
      gesture[method] = () => gesture;
    }
    return gesture;
  };
  return {
    __esModule: true,
    Gesture: { Pan: chain },
    GestureDetector: ({ children }: { children: React.ReactNode }) => children,
    GestureHandlerRootView: ({ children, style }: { children: React.ReactNode; style?: unknown }) =>
      React.createElement(require("react-native").View, { style }, children),
  };
});

// react-native-reanimated v4's bundled `/mock` boots the native Worklets
// module, which isn't available under Jest. Provide a lightweight
// synchronous stand-in instead: shared values are plain mutable objects,
// timing/spring helpers resolve immediately to their target value, and
// Animated.* components pass through to their RN equivalents.
jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const RN = require("react-native");

  const useSharedValue = (initial: unknown) => React.useRef({ value: initial }).current;
  const useAnimatedStyle = (fn: () => unknown) => fn();
  const useAnimatedReaction = (prepare: () => unknown, react: (value: unknown, previous: unknown) => void) => {
    React.useEffect(() => {
      react(prepare(), undefined);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  };
  const runOnJS = (fn: (...args: unknown[]) => unknown) => (...args: unknown[]) => fn(...args);
  const withTiming = (toValue: unknown, _config?: unknown, callback?: (finished: boolean) => void) => {
    callback?.(true);
    return toValue;
  };
  const withSpring = withTiming;

  const passthrough = (Component: unknown) =>
    React.forwardRef((props: any, ref: any) =>
      React.createElement(Component as any, { ...props, ref, style: props.style }),
    );

  return {
    __esModule: true,
    default: {
      View: passthrough(RN.View),
      Text: passthrough(RN.Text),
    },
    useSharedValue,
    useAnimatedStyle,
    useAnimatedReaction,
    runOnJS,
    withTiming,
    withSpring,
    Easing: {
      bezier: () => (t: number) => t,
    },
  };
});

// Haptics mock — no native module available under Jest.
jest.mock("expo-haptics", () => ({
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: { Success: "success", Warning: "warning", Error: "error" },
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
}));
