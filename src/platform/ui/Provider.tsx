import React from 'react'
import { TamaguiProvider } from '@tamagui/core'
import { createConfigForTheme } from './config'
import {
  uiRuntime as defaultUiRuntime,
  UiRuntime,
} from './theme/index'
import { ThemeProvider } from './theme/ThemeProvider'

// Initialises Tamagui — must wrap the entire app tree before any styled()
// atom renders. It now derives the Tamagui theme and the platform theme
// context from the same active platform theme so feature UI stays in sync.
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
        {children}
      </TamaguiProvider>
    </ThemeProvider>
  )
}
