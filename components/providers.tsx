'use client'

import { AuthProvider } from '@/context/auth-context'
import { LocationProvider } from '@/context/location-context'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LocationProvider>
        {children}
      </LocationProvider>
    </AuthProvider>
  )
}
