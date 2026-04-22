'use client'

import { AuthProvider } from '@/context/auth-context'
import { LocationProvider } from '@/context/location-context'
import { CartItemProvider } from '@/context/CartItemContext'
import { NotificationProvider } from '@/context/notification-context'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { MobileBottomNav } from './mobile-bottom-nav'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LocationProvider>
        <CartItemProvider>
          <NotificationProvider>
            {children}
            <MobileBottomNav />
            <Toaster
              position="top-right"
              richColors
              style={{
                top: '80px',
                right: '30px',
              }}
              toastOptions={{
                className: 'animate-in fade-in slide-in-from-right-full duration-500'
              }}
            />
          </NotificationProvider>
        </CartItemProvider>
      </LocationProvider>
    </AuthProvider>
  )
}
