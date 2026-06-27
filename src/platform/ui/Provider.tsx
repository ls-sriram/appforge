import React from 'react'
import { TamaguiProvider } from '@tamagui/core'
import { createConfigForTheme } from './config'
import {
  applyUiOverride,
  uiRuntime as defaultUiRuntime,
  UiRuntime,
  UiOverride,
} from './theme'
import { ThemeProvider } from './theme/ThemeProvider'

// Initialises Tamagui — must wrap the entire app tree before any styled()
// atom renders. It now derives the Tamagui theme and the platform theme
// context from the same active platform theme so feature UI stays in sync.
export function UIProvider({
  children,
  value = defaultUiRuntime,
  override,
}: {
  children: React.ReactNode
  value?: UiRuntime
  override?: UiOverride
}) {
  const activeUi = React.useMemo(
    () => applyUiOverride(value, override),
    [override, value],
  )
  const config = React.useMemo(
    () => createConfigForTheme(activeUi.theme),
    [activeUi],
  )

  return (
    <ThemeProvider value={activeUi}>
      <TamaguiProvider config={config} defaultTheme="dark">
        {children}
      </TamaguiProvider>
    </ThemeProvider>
  )
}
