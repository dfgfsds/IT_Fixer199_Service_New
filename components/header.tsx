'use client'

import Image from 'next/image'
import { MapPin, Search, ShoppingCart, User, ChevronDown, Menu, X, Loader2, Package, Star } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import axiosInstance from '@/configs/axios-middleware'
import Api from '@/api-endpoints/ApiUrls'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LocationModal } from './location-modal'
import { useLocation } from '@/context/location-context'
import { useAuth } from '@/context/auth-context'
import { formatPrice } from '@/lib/format-price'
import { useCartItem } from '@/context/CartItemContext'

export function Header() {
  const { location, setShowLocationModal } = useLocation()
  const { isLoggedIn, user } = useAuth()
  const { totalItems } = useCartItem()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{ services: any[], products: any[] }>({ services: [], products: [] })
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch results when typing
  const fetchResults = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ services: [], products: [] })
      return
    }

    setIsSearching(true)
    try {
      const queryLower = query.toLowerCase()
      const lat = location?.lat
      const lng = location?.lng

      if (!lat || !lng) {
        setIsSearching(false)
        return
      }

      // Fetch services & products in parallel
      const [servicesRes, productsRes] = await Promise.all([
        axiosInstance.get(Api.services, {
          params: {
            include_categories: true,
            include_media: true,
            include_pricing: true,
            status: 'ACTIVE',
            size: 1000,
            lat,
            lng
          }
        }).catch(() => ({ data: [] })),
        axiosInstance.get(Api.products, {
          params: {
            include_pricing: true,
            include_media: true,
            include_category: true,
            status: 'ACTIVE',
            size: 1000,
            include_attribute: true,
            lat,
            lng
          }
        }).catch(() => ({ data: [] }))
      ])

      // Parse Services
      const servicesArray = Array.isArray(servicesRes.data) ? servicesRes.data : (servicesRes.data?.services || [])
      const matchedServices = servicesArray
        .filter((s: any) =>
          s.status === "ACTIVE" &&
          (s.name.toLowerCase().includes(queryLower) ||
            (s.categories?.[0]?.name || '').toLowerCase().includes(queryLower))
        )
        .slice(0, 4) // Show top 4 suggestions

      // Parse Products
      const productsData = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.data || productsRes.data?.products || [])
      const matchedProducts = productsData
        .filter((p: any) =>
          p.status === "ACTIVE" &&
          (p.name.toLowerCase().includes(queryLower) ||
            (p.categories?.[0]?.name || '').toLowerCase().includes(queryLower))
        )
        .slice(0, 4) // Show top 4 suggestions

      setSearchResults({ services: matchedServices, products: matchedProducts })
    } catch (error) {
      console.error("Header search error:", error instanceof Error ? error.message : String(error))
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Handle input change with debounce
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if (searchQuery.length > 1) {
      setShowDropdown(true)
      timeoutRef.current = setTimeout(() => {
        fetchResults(searchQuery)
      }, 300)
    } else {
      setShowDropdown(false)
      setSearchResults({ services: [], products: [] })
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [searchQuery, fetchResults])

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowDropdown(false)
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

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

            {/* Search Bar Container */}
            <div className="flex-1 max-w-2xl hidden md:block" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length > 1 && setShowDropdown(true)}
                  placeholder="Search for services, repairs, accessories..."
                  className={`w-full transition-all duration-300 py-3 px-6 pr-12 text-sm outline-none ${showDropdown
                    ? 'bg-white border-slate-200 rounded-t-3xl shadow-lg border-b-0'
                    : 'bg-slate-100/80 border-transparent focus:bg-white focus:border-slate-200 rounded-full'
                    }`}
                  autoComplete="off"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 group-focus-within:text-[#800000] hover:text-[#800000] transition-colors">
                  {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </button>

                {/* Dropdown Results */}
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 border-t-0 rounded-b-3xl shadow-2xl shadow-slate-200/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="max-h-[70vh] overflow-y-auto scrollbar-hide py-4">
                      {/* Services Section */}
                      {searchResults.services.length > 0 && (
                        <div className="px-6 py-3 space-y-3">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Services</h4>
                          <div className="grid gap-2">
                            {searchResults.services.map((s) => (
                              <button
                                key={s.id}
                                onClick={() => { router.push(`/services/${s.id}`); setShowDropdown(false); }}
                                className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-slate-50 transition-all text-left group"
                              >
                                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                  <Image
                                    src={s.media_files?.[0]?.image_url || '/placeholder-service.jpg'}
                                    alt={s.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-bold text-[#1a1c2e] line-clamp-1">{s.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{s.categories?.[0]?.name || 'Service'}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-sm font-black text-[#800000]">₹{formatPrice(s.pricing_models?.find((pm: any) => pm.pricing_type_name === "Selling Price")?.price || 0)}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Products Section */}
                      {searchResults.products.length > 0 && (
                        <div className="px-6 py-3 space-y-3 mt-2">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Products</h4>
                          <div className="grid gap-2">
                            {searchResults.products.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => { router.push(`/products/${p.id}`); setShowDropdown(false); }}
                                className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-slate-50 transition-all text-left group"
                              >
                                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                  <Image
                                    src={p.media?.[0]?.url || '/placeholder.jpg'}
                                    alt={p.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-bold text-[#1a1c2e] line-clamp-1">{p.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{p.categories?.[0]?.name || 'Product'}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-sm font-black text-[#1a1c2e]">₹{formatPrice(p.pricing?.[0]?.price || 0)}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No Results or Searching state */}
                      {searchQuery.length > 1 && !isSearching && searchResults.services.length === 0 && searchResults.products.length === 0 && (
                        <div className="px-6 py-10 text-center space-y-3">
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                            <Search className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-bold text-slate-400">No services or products found</p>
                        </div>
                      )}

                      {/* Footer Link if we have results */}
                      {(searchResults.services.length > 0 || searchResults.products.length > 0) && (
                        <div className="px-6 pt-4 border-t border-slate-100 mt-2">
                          <button
                            onClick={handleSearchSubmit as any}
                            className="w-full py-3 bg-[#800000]/5 hover:bg-[#800000]/10 text-[#800000] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            See All Search Results
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Cart - Only visible if logged in */}
              {isLoggedIn && (
                <Link
                  href="/cart"
                  className="relative p-2.5 bg-slate-50 text-[#1a1c2e] rounded-xl hover:bg-[#800000] hover:text-white transition-all shadow-sm group"
                >
                  <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

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
              {/* <Link href="/blog" className="text-[15px] font-medium text-slate-500 hover:text-[#1a1c2e] transition-colors border-b-2 border-transparent hover:border-[#1a1c2e] h-full flex items-center">Blog</Link> */}
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
              // { href: '/blog', label: 'Blog' },
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
