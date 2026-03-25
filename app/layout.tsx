import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'IT FIXER @199 - Fast, Reliable IT Repair at Your Doorstep',
  description: 'Book trusted on-site IT support for just ₹199. Laptop, desktop, gaming PC repairs and accessories delivered to your door.',
  openGraph: {
    title: 'IT FIXER @199 - Professional IT Repair Services',
    description: 'Fast, reliable, and affordable on-site IT support. Starting at ₹199.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
