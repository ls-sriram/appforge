import React from 'react'
import { TamaguiProvider } from '@tamagui/core'
import { config } from './config'

// Initialises Tamagui — must wrap the entire app tree before any styled()
// atom renders. Each layout keeps its own ThemeProvider (for leaf primitives
// that still use useTheme()) as a child of this provider.
export function UIProvider({ children }: { children: React.ReactNode }) {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      {children}
    </TamaguiProvider>
  )
}
