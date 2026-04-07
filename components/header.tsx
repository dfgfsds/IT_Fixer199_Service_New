'use client'

import Image from 'next/image'
import { MapPin, Search, ShoppingCart, User, ChevronDown, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { LocationModal } from './location-modal'
import { useLocation } from '@/context/location-context'
import { useAuth } from '@/context/auth-context'

export function Header() {
  const { location, setShowLocationModal } = useLocation()
  const { isLoggedIn, user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="bg-white sticky top-0 z-40 w-full shadow-sm">
        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24 gap-8">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center transition-transform hover:scale-105">
              <Image
                src="/logo.png"
                alt="IT FIXER"
                width={100}
                height={100}
                className="h-full w-auto object-contain"
                priority
              />
            </Link>

            {/* Location Picker */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="hidden md:flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border border-slate-200 hover:border-[#800000]/40 hover:shadow-lg transition-all text-slate-600 shadow-sm max-w-[280px] group"
            >
              <MapPin className="w-4 h-4 text-[#800000] flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-[13px] font-bold truncate text-[#1a1c2e]">
                {location?.address || location?.city || 'Select Location'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 group-hover:translate-y-0.5 transition-transform" />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search for services, repairs, accessories..."
                  className="w-full bg-slate-100/80 border-transparent focus:bg-white focus:border-slate-200 focus:ring-0 rounded-full py-3 px-6 pr-12 text-sm transition-all outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 group-focus-within:text-slate-600">
                  <Search className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2.5 bg-slate-50 text-[#1a1c2e] rounded-xl hover:bg-[#800000] hover:text-white transition-all shadow-sm group"
              >
                <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
              </Link>

              {/* Login / Profile */}
              {isLoggedIn ? (
                <Link
                  href="/profile"
                  className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1a1c2e] font-semibold transition-all shadow-sm active:scale-95"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.name?.split(' ')[0] || 'Profile'}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#800000] hover:bg-[#600000] text-white font-semibold transition-all shadow-md active:scale-95"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Login</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-slate-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Navigation Row (Desktop) */}
        <div className="border-t border-slate-100 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-10 h-12">
              <Link href="/" className="text-[15px] font-medium text-slate-500 hover:text-[#1a1c2e] transition-colors border-b-2 border-transparent hover:border-[#1a1c2e] h-full flex items-center">Home</Link>
              <Link href="/about" className="text-[15px] font-medium text-slate-500 hover:text-[#1a1c2e] transition-colors border-b-2 border-transparent hover:border-[#1a1c2e] h-full flex items-center">About</Link>
              <Link href="/services" className="text-[15px] font-medium text-slate-500 hover:text-[#1a1c2e] transition-colors border-b-2 border-transparent hover:border-[#1a1c2e] h-full flex items-center">Services</Link>
              <Link href="/blog" className="text-[15px] font-medium text-slate-500 hover:text-[#1a1c2e] transition-colors border-b-2 border-transparent hover:border-[#1a1c2e] h-full flex items-center">Blog</Link>
              <Link href="/categories" className="text-[15px] font-medium text-slate-500 hover:text-[#1a1c2e] transition-colors border-b-2 border-transparent hover:border-[#1a1c2e] h-full flex items-center">Categories</Link>
              <Link href="/products" className="text-[15px] font-medium text-slate-500 hover:text-[#1a1c2e] transition-colors border-b-2 border-transparent hover:border-[#1a1c2e] h-full flex items-center">Products</Link>
            </nav>
          </div>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1">
            {/* Mobile Location */}
            <button
              onClick={() => { setShowLocationModal(true); setIsMenuOpen(false) }}
              className="w-full flex items-center gap-2.5 px-3 py-3 rounded-xl hover:bg-slate-50 text-[13px] font-bold text-[#1a1c2e]"
            >
              <MapPin className="w-4 h-4 text-[#800000] shrink-0" />
              <span className="truncate flex-1 text-left">
                {location?.address || location?.city || 'Select Location'}
              </span>
            </button>
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/services', label: 'Services' },
              { href: '/blog', label: 'Blog' },
              { href: '/categories', label: 'Categories' },
              { href: '/products', label: 'Products' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <Link href="/profile" className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 text-sm font-bold text-[#1a1c2e]" onClick={() => setIsMenuOpen(false)}>
                <User className="w-4 h-4" /> {user?.name || 'Profile'}
              </Link>
            ) : (
              <Link href="/login" className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#800000] text-white text-sm font-bold" onClick={() => setIsMenuOpen(false)}>
                <User className="w-4 h-4" /> Login
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Global Location Modal - driven by context */}
      <LocationModal
        isOpen={false}
        onClose={() => setShowLocationModal(false)}
      />
    </>
  )
}
