'use client'

import { AuthProvider } from '@/context/auth-context'
import { LocationProvider } from '@/context/location-context'
import { CartItemProvider } from '@/context/CartItemContext'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LocationProvider>
        <CartItemProvider>
          {children}
          <Toaster position="top-center" richColors />
        </CartItemProvider>
      </LocationProvider>
    </AuthProvider>
  )
}
