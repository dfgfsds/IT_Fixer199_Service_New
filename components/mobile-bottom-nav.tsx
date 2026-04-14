'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Wrench, Package, User, ShoppingCart } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { useCartItem } from '@/context/CartItemContext'
import { motion } from 'framer-motion'

export function MobileBottomNav() {
  const pathname = usePathname()
  const { isLoggedIn } = useAuth()
  const { totalItems } = useCartItem()

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/services', label: 'Services', icon: Wrench },
    { href: '/products', label: 'Products', icon: Package },
    {
      href: isLoggedIn ? '/profile' : '/login',
      label: isLoggedIn ? 'Account' : 'Login',
      icon: User
    },
    { href: '/cart', label: 'Cart', icon: ShoppingCart, badge: totalItems }
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center h-full px-2 group"
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'text-[#101242]' : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#800000] text-[9px] font-black text-white shadow-sm ring-1 ring-white">
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-[#101242]/5 rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>

              <span className={`text-[9px] font-black uppercase tracking-tighter mt-0.5 transition-colors ${isActive ? 'text-[#101242]' : 'text-slate-400'
                }`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
