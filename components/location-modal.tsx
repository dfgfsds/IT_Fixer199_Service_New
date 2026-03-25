'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, MapPin, Navigation, Search, Clock, ChevronLeft, Loader2, AlertCircle, CheckCircle2, Home, Briefcase } from 'lucide-react'
import { useLocation } from '@/context/location-context'
import { useAuth } from '@/context/auth-context'

const CHENNAI_AREAS = [
  { name: 'T. Nagar', lat: 13.0418, lng: 80.2341 },
  { name: 'Anna Nagar', lat: 13.0850, lng: 80.2101 },
  { name: 'Velachery', lat: 12.9754, lng: 80.2201 },
  { name: 'Adyar', lat: 13.0063, lng: 80.2574 },
  { name: 'Porur', lat: 13.0339, lng: 80.1561 },
  { name: 'Ambattur', lat: 13.1143, lng: 80.1548 },
  { name: 'Tambaram', lat: 12.9249, lng: 80.1000 },
  { name: 'Guindy', lat: 13.0067, lng: 80.2206 },
  { name: 'Chromepet', lat: 12.9516, lng: 80.1462 },
  { name: 'Perambur', lat: 13.1177, lng: 80.2323 },
  { name: 'Pallavaram', lat: 12.9675, lng: 80.1491 },
  { name: 'Sholinganallur', lat: 12.9010, lng: 80.2279 },
]

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect?: (location: string) => void
}

async function reverseGeocode(lat: number, lng: number) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
    const data = await res.json()
    const addr = data.address || {}
    return {
      city: addr.city || addr.town || addr.village || addr.county || 'Unknown',
      state: addr.state || '',
      pincode: addr.postcode || '',
      address: data.display_name || 'Unknown location',
      lat,
      lng,
    }
  } catch {
    return null
  }
}

async function searchPlaces(query: string) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Chennai')}&countrycodes=in&limit=6&viewbox=79.7,13.3,80.4,12.7&bounded=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
    return await res.json()
  } catch {
    return []
  }
}

export function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const { location, setLocation, showLocationModal, setShowLocationModal } = useLocation()
  const { isLoggedIn } = useAuth()

  const visible = isOpen || showLocationModal

  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return }
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    setSearching(true)
    searchTimeout.current = setTimeout(async () => {
      const results = await searchPlaces(searchQuery)
      setSearchResults(results)
      setSearching(false)
    }, 500)
  }, [searchQuery])

  const close = useCallback(() => {
    setShowLocationModal(false)
    onClose?.()
    setSearchQuery('')
    setSearchResults([])
    setGeoError(null)
  }, [setShowLocationModal, onClose])

  // Detect GPS location
  const handleDetectLocation = async () => {
    setGeoError(null)
    setGeoLoading(true)
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.')
      setGeoLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
        if (loc) {
          setLocation(loc)
          close()
        } else {
          setGeoError('Could not determine your address. Please search manually.')
        }
        setGeoLoading(false)
      },
      () => {
        setGeoError('Location access denied. Please allow location permission or search manually.')
        setGeoLoading(false)
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  // Select from search result
  const handleSearchSelect = async (result: any) => {
    setConfirming(true)
    const loc = await reverseGeocode(parseFloat(result.lat), parseFloat(result.lon))
    if (loc) { setLocation(loc); close() }
    setConfirming(false)
  }

  // Select area
  const handleCityClick = async (city: typeof CHENNAI_AREAS[0]) => {
    setConfirming(true)
    const loc = await reverseGeocode(city.lat, city.lng)
    if (loc) { setLocation(loc); close() }
    setConfirming(false)
  }

  if (!visible) return null

  // ─── LOGGED IN VIEW: Show saved address ─────────────────────────────────────
  const LoggedInView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-black text-[#1a1c2e]">Your Location</h2>
          <p className="text-xs text-slate-500 mt-0.5">Service will be delivered here</p>
        </div>
        <button onClick={close} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
          <X className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Current selected address */}
        {location && (
          <div className="flex items-start gap-4 p-4 bg-[#800000]/5 border border-[#800000]/20 rounded-2xl">
            <div className="w-10 h-10 bg-[#800000] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#800000]/20">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#800000] bg-[#800000]/10 px-2 py-0.5 rounded-full">Selected</span>
              </div>
              <p className="text-sm font-bold text-[#1a1c2e]">{location.city}</p>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{location.address}</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-[#800000] flex-shrink-0 mt-0.5" />
          </div>
        )}

        {/* Change location option */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Change Location</p>

          <button
            onClick={handleDetectLocation}
            disabled={geoLoading}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all active:scale-[0.99] disabled:opacity-60"
          >
            {geoLoading ? <Loader2 className="w-5 h-5 text-[#800000] animate-spin" /> : <Navigation className="w-5 h-5 text-[#800000]" />}
            <div className="text-left">
              <p className="text-sm font-bold text-[#1a1c2e]">Use Current Location</p>
              <p className="text-xs text-slate-500">Auto-detect via GPS</p>
            </div>
          </button>

          {geoError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100 text-xs text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {geoError}
            </div>
          )}

          {/* Area pills - Chennai only */}
          <div className="pt-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 mb-2">Areas in Chennai</p>
            <div className="flex flex-wrap gap-2">
              {CHENNAI_AREAS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleCityClick(c)}
                  disabled={confirming}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all active:scale-95 disabled:opacity-60 ${
                    location?.city === c.name
                      ? 'bg-[#800000] border-[#800000] text-white shadow-lg shadow-[#800000]/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-[#800000]/30 hover:text-[#800000]'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // ─── NOT LOGGED IN VIEW: Full location selection ─────────────────────────────
  const GuestView = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-black text-[#1a1c2e]">Select Location</h2>
          <p className="text-xs text-slate-500 mt-0.5">Search or pick your city</p>
        </div>
        <button onClick={close} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
          <X className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Detect GPS */}
        <div className="px-5 pt-4">
          <button
            onClick={handleDetectLocation}
            disabled={geoLoading}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 border-2 border-dashed border-[#800000]/30 bg-[#800000]/[0.03] rounded-2xl hover:bg-[#800000]/[0.07] hover:border-[#800000]/50 transition-all active:scale-[0.99] disabled:opacity-60"
          >
            <div className="w-10 h-10 bg-[#800000]/10 rounded-full flex items-center justify-center flex-shrink-0">
              {geoLoading ? <Loader2 className="w-5 h-5 text-[#800000] animate-spin" /> : <Navigation className="w-5 h-5 text-[#800000]" />}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-[#800000]">Use Current Location</p>
              <p className="text-xs text-slate-500">{geoLoading ? 'Detecting...' : 'Using device GPS'}</p>
            </div>
          </button>

          {geoError && (
            <div className="mt-2 flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100 text-xs text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {geoError}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="px-5 pt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for area, street or landmark..."
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-transparent focus:bg-white focus:border-slate-200 focus:ring-2 focus:ring-[#800000]/10 rounded-2xl text-sm outline-none transition-all font-medium"
              autoFocus
            />
            {searching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />}
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="px-5 pt-2 pb-2">
            {searchResults.map((r, i) => (
              <button
                key={i}
                onClick={() => handleSearchSelect(r)}
                disabled={confirming}
                className="w-full flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#800000]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1a1c2e] truncate">{r.display_name?.split(',')[0]}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{r.display_name}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Areas in Chennai */}
        <div className="px-5 pt-4 pb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 mb-3">Areas in Chennai</p>
          <div className="flex flex-wrap gap-2">
            {CHENNAI_AREAS.map((c) => (
              <button
                key={c.name}
                onClick={() => handleCityClick(c)}
                disabled={confirming}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all active:scale-95 disabled:opacity-60 ${
                  location?.city === c.name
                    ? 'bg-[#800000] border-[#800000] text-white shadow-lg shadow-[#800000]/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-[#800000]/30 hover:text-[#800000]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: '85vh' }}
      >
        {confirming && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#800000] animate-spin" />
          </div>
        )}
        {isLoggedIn ? <LoggedInView /> : <GuestView />}
      </div>
    </div>
  )
}
