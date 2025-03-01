import { GluestackUIProvider as BaseProvider } from "@gluestack-ui/themed"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
  mode?: 'light' | 'dark'
}

export function GluestackUIProvider({ children, mode = 'light' }: Props) {
  return <BaseProvider config={{ mode }}>{children}</BaseProvider>
} 