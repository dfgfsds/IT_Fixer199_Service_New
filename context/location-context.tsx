"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import axiosInstance from "@/configs/axios-middleware"
import Api from "@/api-endpoints/ApiUrls"
import { useAuth } from "./auth-context"
import { extractErrorMessage } from "@/lib/error-utils"

export interface LocationData {
  city: string
  address: string
  lat: number
  lng: number
  state?: string
  pincode?: string
}

interface LocationContextType {
  location: LocationData | null
  setLocation: (loc: LocationData) => void
  showLocationModal: boolean
  setShowLocationModal: (show: boolean) => void
  zoneData: any
  refreshZoneData: (lat: number, lng: number) => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

// Helper to extract a city name from Nominatim data
const extractLocalArea = (addr: any) => {
  return (
    addr.suburb ||
    addr.neighbourhood ||
    addr.city_district ||
    addr.town ||
    addr.village ||
    addr.city ||
    ""
  )
}

// Simple fallback to find the "closest" city if Nominatim's data is fragmented
const getClosestArea = (lat: number, lng: number, addr: any) => {
  if (lat && lng && !addr.city && !addr.town) {
    return (
      addr.suburb ||
      addr.neighbourhood ||
      addr.residential ||
      addr.city_district ||
      addr.state_district ||
      addr.state ||
      "Chennai"
    )
  }
  return addr.city || addr.town || addr.village || "Unknown"
}

export function LocationProvider({ children }: any) {
  const [location, setLocationState] = useState<LocationData | null>(null)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [zoneData, setZoneData] = useState<any>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const isInitializingRef = useRef(false)
  const { user } = useAuth()

  const fetchZoneData = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await axiosInstance.get(Api.zoneByLocation, {
        params: { lat, lng }
      })
      if (res?.data) {
        setZoneData(res.data?.zone_slot || res.data?.data)
      }
    } catch (err: any) {
      if (err.response?.status !== 500) {
        console.warn("Zone fetch error", extractErrorMessage(err))
      }
    }
  }, [])

  const setLocation = useCallback((loc: LocationData) => {
    setLocationState(loc)
    localStorage.setItem("user_location", JSON.stringify(loc))
  }, [])

  // CURRENT LOCATION
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setShowLocationModal(true)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        try {
          // Reverse geocode via Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
          )

          const data = await res.json()
          const addr = data.address || {}

          const extracted = extractLocalArea(addr)
          const finalCity = getClosestArea(lat, lng, extracted)

          setLocation({
            lat,
            lng,
            city: finalCity,
            state: addr.state || "",
            pincode: addr.postcode || "",
            address: data.display_name || "",
          })

        } catch {
          console.warn("Reverse geocoding failed.")
        }
      },
      () => {
        console.log("No location detected from GPS.")
      }
    )
  }

  const initLocation = async () => {
    if (isInitializingRef.current) return
    isInitializingRef.current = true

    try {
      // STEP 0: IMMEDIATELY LOAD FROM LOCAL STORAGE
      const savedLocation = localStorage.getItem("user_location")
      if (savedLocation && !location) {
        try {
          const parsed = JSON.parse(savedLocation)
          if (parsed?.lat && parsed?.lng) {
            setLocationState(parsed)
          }
        } catch (e) {
          localStorage.removeItem("user_location")
        }
      }

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

      // STEP 1: PRIORITIZE SELECTED ADDRESS
      if (token) {
        try {
          const res = await axiosInstance.get(Api?.selectedAddress)
          const selected = res?.data?.data || res?.data

          if (selected && selected?.lat && selected?.lng) {
            const serverLoc = {
              lat: Number(selected.lat),
              lng: Number(selected.lng),
              city: selected.district || selected.city || "Unknown",
              state: selected.state || "",
              pincode: selected.pincode || "",
              address: selected.full_address || selected.address || "",
            }
            setLocation(serverLoc)
            setIsInitialized(true)
            isInitializingRef.current = false
            return
          }
        } catch (e: any) {
          if (e.response?.status !== 401 && e.response?.status !== 404) {
            console.warn("Init location fetch error", extractErrorMessage(e))
          }
        }
      }

      // STEP 2: GPS FALLBACK
      if (!localStorage.getItem("user_location")) {
        handleCurrentLocation()
      }

      setIsInitialized(true)
    } catch (error: any) {
      console.error("Critical error in location init", extractErrorMessage(error))
    } finally {
      isInitializingRef.current = false
    }
  }

  useEffect(() => {
    // Only run if we haven't successfully loaded a location yet OR user changed
    initLocation()
  }, [user?.id])

  useEffect(() => {
    if (location?.lat && location?.lng) {
      // INITIAL FETCH
      fetchZoneData(location.lat, location.lng)
    }
  }, [location?.lat, location?.lng, fetchZoneData])

  return (
    <LocationContext.Provider value={{
      location,
      setLocation,
      showLocationModal,
      setShowLocationModal,
      zoneData,
      refreshZoneData: fetchZoneData
    }}>
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}