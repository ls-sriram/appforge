import React from 'react'
import { TamaguiProvider } from '@tamagui/core'
import { createConfigForTheme } from './config'
import {
  applyThemeOverride,
  theme as defaultTheme,
  Theme,
  ThemeOverride,
} from '../theme'
import { ThemeProvider } from '../theme/ThemeProvider'

// Initialises Tamagui — must wrap the entire app tree before any styled()
// atom renders. It now derives the Tamagui theme and the platform theme
// context from the same active platform theme so feature UI stays in sync.
export function UIProvider({
  children,
  value = defaultTheme,
  override,
}: {
  children: React.ReactNode
  value?: Theme
  override?: ThemeOverride
}) {
  const activeTheme = React.useMemo(
    () => applyThemeOverride(value, override),
    [override, value],
  )
  const config = React.useMemo(
    () => createConfigForTheme(activeTheme),
    [activeTheme],
  )

  return (
    <ThemeProvider value={activeTheme}>
      <TamaguiProvider config={config} defaultTheme="dark">
        {children}
      </TamaguiProvider>
    </ThemeProvider>
  )
}
