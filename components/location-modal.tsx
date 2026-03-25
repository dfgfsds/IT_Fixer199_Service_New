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
} from "lucide-react"
import { useLocation, type LocationData } from "@/context/location-context"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useReverseGeocode, type GeocodedAddress } from "@/hooks/use-reverse-geocode"
import { MapPicker } from "@/components/map-picker"
import { SearchSuggestions, type SearchResult } from "@/components/search-suggestions"
import { POPULAR_CITIES } from "@/constants/location"

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
    lat: location?.lat || 13.0827,
    lng: location?.lng || 80.2707,
  })
  const [selectedAddress, setSelectedAddress] = useState<GeocodedAddress | null>(null)
  const [geoError, setGeoError] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const visible = isOpen || showLocationModal

  useEffect(() => {
    if (visible && location) {
      setStep("search")
      setSelectedCoords({
        lat: location?.lat || 13.0827,
        lng: location?.lng || 80.2707,
      })
      setSelectedAddress(null)
      setGeoError(null)
    }
  }, [visible, location])

  // When moving to map step, reverse geocode the selected coords
  useEffect(() => {
    if (step === "map") {
      reverseGeo.reverseGeocode(selectedCoords.lat, selectedCoords.lng).then(setSelectedAddress)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Handle popular city click
  const handleCityClick = (city: (typeof POPULAR_CITIES)[0]) => {
    setSelectedCoords({ lat: city.lat, lng: city.lng })
    setStep("map")
  }

  // Handle map drag - debounced reverse geocode
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
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-md animate-in fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl sm:animate-in sm:fade-in sm:zoom-in-95 sm:slide-in-from-bottom-0"
        style={{ maxHeight: "90vh" }}
      >
        {/* ── Header ── */}
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

        {/* ── Search Step ── */}
        {step === "search" && (
          <div className="flex-1 overflow-y-auto">
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
                <div className="mt-2 flex items-center gap-2 rounded-xl bg-destructive/5 px-3 py-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                  <p className="text-xs text-destructive">{geoError}</p>
                </div>
              )}
            </div>

            {/* Search Suggestions Component */}
            <SearchSuggestions onSelect={handleSearchSelect} autoFocus />

            {/* Recent Locations */}
            {recentLocations && recentLocations.length > 0 && (
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

            {/* Popular Cities */}
            <div className="px-5 pb-6 pt-5">
              <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Popular Cities
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_CITIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleCityClick(c)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all active:scale-95 ${
                      location?.city === c.name
                        ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/10"
                        : "border-border bg-card text-foreground hover:bg-primary/[0.03] hover:border-primary/30"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Map Step ── */}
        {step === "map" && (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Map */}
            <div className="relative h-[45vh] shrink-0 sm:h-[40vh]">
              <MapPicker
                lat={selectedCoords.lat}
                lng={selectedCoords.lng}
                onMove={handleMapMove}
              />

              {/* "Move map to adjust" tooltip */}
              <div className="absolute left-1/2 top-4 z-[1001] -translate-x-1/2 animate-in fade-in">
                <div className="rounded-full bg-foreground/80 px-3 py-1.5 text-xs font-medium text-background shadow-lg backdrop-blur-sm">
                  Move map to adjust pin
                </div>
              </div>
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
