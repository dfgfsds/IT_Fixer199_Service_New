"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  X,
  Loader2,
  Navigation,
  Clock,
  ChevronLeft,
  MapPin,
  AlertCircle,
  Plus,
  Check,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"
import { useLocation, type LocationData } from "@/context/location-context"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useReverseGeocode, type GeocodedAddress } from "@/hooks/use-reverse-geocode"
import { MapPicker } from "@/components/map-picker"
import { SearchSuggestions, type SearchResult } from "@/components/search-suggestions"
import { POPULAR_CITIES } from "@/constants/location"
import { useAuth } from "@/context/auth-context"
import axiosInstance from "@/configs/axios-middleware"
import Api from "@/api-endpoints/ApiUrls"

export function LocationModal({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const {
    location,
    setLocation,
    recentLocations,
    showLocationModal,
    setShowLocationModal,
  }: any = useLocation()

  const geo = useGeolocation()
  const reverseGeo = useReverseGeocode()

  const [step, setStep] = useState<"search" | "map">("search")
  const [selectedCoords, setSelectedCoords] = useState({
    lat: location?.lat || "",
    lng: location?.lng || "",
  })
  const [selectedAddress, setSelectedAddress] = useState<GeocodedAddress | null>(null)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [fetchingAddresses, setFetchingAddresses] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const { isLoggedIn } = useAuth()

  const visible = isOpen || showLocationModal

  useEffect(() => {
    if (visible && location) {
      setStep("search")
      setSelectedCoords({
        lat: location?.lat || "",
        lng: location?.lng || "",
      })
      setSelectedAddress(null)
      setGeoError(null)
    }
  }, [visible, location])

  // Load saved addresses for logged-in users
  useEffect(() => {
    if (visible && isLoggedIn) {
      setFetchingAddresses(true)
      axiosInstance.get(Api.myAddress)
        .then(res => {
          const rawData = res.data?.data || res.data
          setSavedAddresses(Array.isArray(rawData) ? rawData : [])
        })
        .catch(err => console.error("Failed to fetch addresses:", err instanceof Error ? err.message : String(err)))
        .finally(() => setFetchingAddresses(false))
    }
  }, [visible, isLoggedIn])

  useEffect(() => {
    if (step === "map") {
      reverseGeo.reverseGeocode(selectedCoords.lat, selectedCoords.lng).then(setSelectedAddress)
    }
  }, [step])

  const handleClose = () => {
    setShowLocationModal(false)
    if (onClose) onClose()
  }

  // Handle current location detection
  const handleDetectLocation = async () => {
    setGeoError(null)
    const coords = await geo.detect()
    if (coords) {
      setSelectedCoords(coords)
      setStep("map")
    } else {
      setGeoError(geo.error || "Could not detect location")
    }
  }

  // Handle search suggestion selection
  const handleSearchSelect = (result: SearchResult) => {
    setSelectedCoords({ lat: result.lat, lng: result.lng })
    setStep("map")
  }

  // Handle selecting a recent location
  const handleRecentSelect = (loc: LocationData) => {
    setSelectedCoords({ lat: loc.lat, lng: loc.lng })
    setStep("map")
  }

  // Handle selecting a saved address
  const handleAddressSelect = async (addr: any) => {
    try {
      await axiosInstance.patch(`${Api.addressFlags}/${addr.id}`, {
        ...addr,
        selected_address: true,
        is_primary: true
      })

      setLocation({
        city: addr.district || addr.city || "Unknown",
        address: addr.full_address || addr.address,
        lat: Number(addr.lat),
        lng: Number(addr.lng),
        state: addr.state || "",
        pincode: addr.pincode || "",
      })
      handleClose()
    } catch (err) {
      console.error("Failed to set primary address:", err instanceof Error ? err.message : String(err))
      toast.error("Could not sync selected address")
    }
  }

  // Handle popular city click
  const handleCityClick = (city: (typeof POPULAR_CITIES)[0]) => {
    setSelectedCoords({ lat: city.lat, lng: city.lng })
    setStep("map")
  }

  // Handle map drag
  const mapDragTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleMapMove = useCallback(
    (lat: number, lng: number) => {
      setSelectedCoords({ lat, lng })
      if (mapDragTimeoutRef.current) clearTimeout(mapDragTimeoutRef.current)
      mapDragTimeoutRef.current = setTimeout(async () => {
        const addr = await reverseGeo.reverseGeocode(lat, lng)
        setSelectedAddress(addr)
      }, 500)
    },
    [reverseGeo]
  )

  // Confirm location
  const handleConfirm = () => {
    if (!selectedAddress) return
    const display: any = [selectedAddress.area, selectedAddress.city, selectedAddress.state]
      .filter(Boolean)
      .join(", ")
    setLocation({
      city: selectedAddress.city || "Unknown",
      address: display || selectedAddress.fullAddress,
      lat: selectedCoords.lat,
      lng: selectedCoords.lng,
    })
    handleClose()
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 animate-in fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl sm:animate-in sm:fade-in sm:zoom-in-95 sm:slide-in-from-bottom-0"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            {step === "map" && (
              <button
                onClick={() => setStep("search")}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-muted active:scale-90"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>
            )}
            <div>
              <h2 className="leading-tight text-base font-bold text-foreground">
                {step === "search" ? "Select Location" : "Confirm Location"}
              </h2>
              <p className="mt-0.5 leading-tight text-xs text-muted-foreground">
                {step === "search"
                  ? "Search or pick from the map"
                  : "Drag the map to adjust pin"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-muted active:scale-90"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {step === "search" && (
          <div className="flex-1 overflow-y-auto pb-10">
            {!location && (
              <div className="mx-5 mt-4 flex items-start gap-3 rounded-2xl bg-[#800000]/5 p-4 border border-[#800000]/10 border-dashed">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#800000] text-white">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1a1c2e]">Location Required</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-600">
                    To show you the right pricing and available service experts in your area, please select your city manually or allow browser access.
                  </p>
                </div>
              </div>
            )}

            {/* Current Location Button */}
            <div className="px-5 pt-4">
              <button
                onClick={handleDetectLocation}
                disabled={geo.loading}
                className="flex w-full items-center gap-3.5 rounded-2xl border border-dashed border-primary/30 bg-primary/[0.03] px-4 py-3.5 text-left transition-all hover:bg-primary/[0.07] hover:border-primary/50 active:scale-[0.99] disabled:opacity-60"
              >
                {geo.loading ? (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Navigation className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-primary">Use Current Location</p>
                  <p className="text-xs text-muted-foreground">
                    {geo.loading ? "Detecting your location..." : "Using device GPS"}
                  </p>
                </div>
              </button>

              {/* Permission error */}
              {geoError && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 border border-red-100">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-[13px] font-bold text-red-600">Location Access Blocked</p>
                      <p className="text-[12px] leading-relaxed text-red-500">
                        {geoError.includes("denied") || geoError.includes("permission")
                          ? "You've blocked location access. Please pick a city manually below or reset permissions in your browser settings."
                          : geoError}
                      </p>
                    </div>
                  </div>

                  {(geoError.includes("denied") || geoError.includes("permission")) && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#800000] text-white text-[10px] font-bold">!</div>
                      <p className="text-[11px] font-medium text-slate-600">
                        Click the <span className="font-bold underline">Lock Icon</span> in your browser's address bar to reset.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ADD NEW ADDRESS */}
            <div className="px-5 pt-4">
              <button
                onClick={() => {
                  handleClose();
                  if (!isLoggedIn) {
                    toast.error("Please login to add a new address", { duration: 3000 });
                    setTimeout(() => {
                      window.location.href = '/login';
                    }, 1200);
                  } else {
                    window.location.href = '/profile?tab=addresses&action=add';
                  }
                }}
                className="group flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all hover:bg-primary/5 bg-slate-50 active:scale-[0.99] border-2 border-dashed border-slate-200"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-100 group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-primary shadow-sm transition-all">
                  <Plus className="h-5 w-5 text-slate-400 group-hover:text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1a1c2e] group-hover:text-primary tracking-tight">Add New Address</p>
                  <p className="text-[11px] text-slate-500 font-medium tracking-tight">Save a new location for faster bookings</p>
                </div>
              </button>
            </div>

            {/* SAVED ADDRESSES SECTION*/}
            {isLoggedIn && (fetchingAddresses || (savedAddresses && savedAddresses.length > 0)) && (
              <div className="px-5 pt-6">
                <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Saved Addresses
                </p>
                {fetchingAddresses ? (
                  <div className="pb-2">
                    <div className="flex w-full items-start gap-4 rounded-2xl p-4 bg-slate-50 relative overflow-hidden animate-pulse border-2 border-transparent">
                      <div className="mt-0.5 h-9 w-9 shrink-0 rounded-xl bg-slate-200" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 w-1/3 bg-slate-200 rounded" />
                        <div className="h-3 w-5/6 bg-slate-200 rounded" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 pt-2 pb-2">
                    {(() => {
                      const sorted = [...savedAddresses].sort((a: any, b: any) =>
                        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                      );

                      const finale = sorted.sort((a: any, b: any) => {
                        return a.selected_address ? -1 : b.selected_address ? 1 : 0;
                      });

                      return (
                        <>
                          {finale.slice(0, 4).map((addr: any) => {
                            const isSelected = addr.selected_address === true;

                            return (
                              <button
                                key={addr.id}
                                onClick={() => handleAddressSelect(addr)}
                                className={`group flex w-full items-start gap-4 rounded-2xl p-4 text-left transition-all hover:bg-muted/80 active:scale-[0.99] border-2 ${isSelected ? 'bg-primary/5 border-primary/20 shadow-sm' : 'border-transparent bg-slate-50/50'
                                  }`}
                              >
                                <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm transition-all ${isSelected ? 'bg-primary text-white shadow-primary/20' : 'bg-white text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
                                  }`}>
                                  <MapPin className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1 py-0.5">
                                  <div className="flex items-center gap-2">
                                    <p className="truncate text-sm font-bold text-[#1a1c2e] tracking-tight">{addr.name || 'Saved Address'}</p>
                                    {isSelected && (
                                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 scale-105">
                                        <Check className="h-2.5 w-2.5 stroke-[4]" />
                                      </div>
                                    )}
                                  </div>
                                  <p className="truncate leading-tight text-[11px] text-slate-500 mt-0.5 font-medium italic">
                                    {addr.full_address}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                          {finale.length > 4 && (
                            <button
                              onClick={() => {
                                handleClose();
                                window.location.href = '/profile?tab=addresses';
                              }}
                              className="w-full flex items-center justify-center mt-2 rounded-2xl py-3 text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                            >
                              {/* See all {finale.length} addresses */}
                              See all addresses
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* Recent Locations */}
            {recentLocations && recentLocations.length > 0 && !isLoggedIn && (
              <div className="px-5 pt-4">
                <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Recent
                </p>
                <div className="flex flex-col">
                  {recentLocations.map((loc: any, i: any) => (
                    <button
                      key={i}
                      onClick={() => handleRecentSelect(loc)}
                      className="group flex items-start gap-3 rounded-xl px-3 py-3 text-left transition-all hover:bg-muted/60 active:scale-[0.99]"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-secondary">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{loc.city}</p>
                        <p className="truncate leading-relaxed text-xs text-muted-foreground">
                          {loc.address}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === "map" && (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Map */}
            <div className="relative h-[45vh] shrink-0 sm:h-[40vh]">
              <MapPicker
                lat={selectedCoords.lat}
                lng={selectedCoords.lng}
                onMove={handleMapMove}
              />

              <div className="absolute left-1/2 top-4 z-[1001] -translate-x-1/2 animate-in fade-in">
                <div className="rounded-full bg-foreground/80 px-3 py-1.5 text-xs font-medium text-background shadow-lg backdrop-blur-sm">
                  Move map to adjust pin
                </div>
              </div>

              {/* Floating "Locate Me" GPS Button */}
              {/* <button
                onClick={handleDetectLocation}
                disabled={geo.loading}
                className="absolute right-4 bottom-4 z-[1001] flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-xl shadow-black/10 transition-all hover:bg-slate-50 active:scale-90 disabled:opacity-50"
                title="Locate me"
              >
                {geo.loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Navigation className="h-6 w-6 fill-primary/10" />
                )}
              </button> */}
            </div>

            {/* Sticky Bottom Confirm Section */}
            <div className="flex shrink-0 flex-col gap-4 border-t border-border bg-card px-5 py-5">
              {/* Address card */}
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  {reverseGeo.loading && !selectedAddress ? (
                    <div className="flex items-center gap-2 py-1">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Finding address...</p>
                    </div>
                  ) : selectedAddress ? (
                    <>
                      <p className="leading-tight text-sm font-bold text-foreground">
                        {selectedAddress.area || selectedAddress.street || selectedAddress.city}
                      </p>
                      <p className="mt-1 leading-relaxed text-xs text-muted-foreground">
                        {[
                          selectedAddress.street,
                          selectedAddress.area,
                          selectedAddress.city,
                          selectedAddress.state,
                          selectedAddress.pincode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      {reverseGeo.loading && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <div className="h-1 w-1 animate-pulse rounded-full bg-primary" />
                          <p className="text-[10px] text-primary">Updating...</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="py-1 text-sm text-muted-foreground">
                      Drag the map to select a location
                    </p>
                  )}
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={!selectedAddress || reverseGeo.loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
              >
                <MapPin className="h-4 w-4" />
                Confirm Location
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
