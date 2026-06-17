import React from 'react'
import { Card } from '../primitives'

export type PanelVariant = 'default' | 'muted' | 'strong' | 'subtle' | 'inverse' | 'selected'

type PanelPad = 'none' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type Props = {
  variant?: PanelVariant
  pad?: PanelPad
  padH?: never  // use pad instead — Card handles uniform padding
  padV?: never
  overflow?: 'hidden' | 'visible'
  frame?: never // use Col fill / Row fill in the caller
  children?: React.ReactNode
  testID?: string
  accessible?: boolean
  accessibilityLabel?: string
}

function cardVariant(v: PanelVariant): React.ComponentProps<typeof Card>['variant'] {
  switch (v) {
    case 'default':  return 'default'
    case 'muted':    return 'muted'
    case 'strong':   return 'strong'
    case 'subtle':   return 'subtle'
    case 'inverse':  return 'inverse'
    case 'selected': return 'selected'
  }
}

export function Panel({
  variant = 'default',
  pad,
  overflow,
  children,
  testID,
  accessible,
  accessibilityLabel,
}: Props) {
  return (
    <Card
      variant={cardVariant(variant)}
      pad={pad}
      overflow={overflow}
      testID={testID}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Card>
  )
}
