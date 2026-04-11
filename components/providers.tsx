'use client'

import { AuthProvider } from '@/context/auth-context'
import { LocationProvider } from '@/context/location-context'
import { CartItemProvider } from '@/context/CartItemContext'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { MobileBottomNav } from './mobile-bottom-nav'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LocationProvider>
        <CartItemProvider>
          {children}
          <MobileBottomNav />
          <Toaster position="top-center" richColors />
        </CartItemProvider>
      </LocationProvider>
    </AuthProvider>
  )
}
