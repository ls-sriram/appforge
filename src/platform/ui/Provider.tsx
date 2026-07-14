import React from 'react'
import { TamaguiProvider } from '@tamagui/core'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { createConfigForTheme } from './config'
import {
  uiRuntime as defaultUiRuntime,
  UiRuntime,
} from './theme/index'
import { ThemeProvider } from './theme/ThemeProvider'
import { ToastProvider } from './components/toast/ToastProvider'
import { SheetProvider } from './components/sheet/SheetProvider'

// Initialises Tamagui — must wrap the entire app tree before any styled()
// atom renders. It now derives the Tamagui theme and the platform theme
// context from the same active platform theme so feature UI stays in sync.
// Also mounts the gesture/safe-area roots and the Toast/Sheet overlay
// providers, so consuming apps don't need to wire those up themselves.
export function UIProvider({
  children,
  value = defaultUiRuntime,
}: {
  children: React.ReactNode
  value?: UiRuntime
}) {
  const config = React.useMemo(
    () => createConfigForTheme(value.theme),
    [value],
  )

  return (
    <ThemeProvider value={value}>
      <TamaguiProvider config={config} defaultTheme="dark">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <ToastProvider>
              <SheetProvider>{children}</SheetProvider>
            </ToastProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </TamaguiProvider>
    </ThemeProvider>
  )
}
