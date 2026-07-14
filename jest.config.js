module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-safe-area-context|react-native-gesture-handler|react-native-reanimated|expo-haptics|@react-native-async-storage/async-storage))",
  ],
  setupFiles: ["./jest.setup.ts"],
  setupFilesAfterEnv: ["./jest.setup-after-env.ts"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.stories.{ts,tsx}",
    "!src/types/**",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    "src/services/UserProfileService.ts": {
      branches: 50,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    "src/organisms/BlockGrid.tsx": {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  coverageReporters: ["text", "lcov"],
};
