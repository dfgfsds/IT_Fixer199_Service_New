"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import axiosInstance from "@/configs/axios-middleware"
import Api from "@/api-endpoints/ApiUrls"

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
    // If we have coordinates but Nominatim didn't give a clear city/town
    // we can use the most descriptive local place name available.
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

  const fetchZoneData = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await axiosInstance.get(Api.zoneByLocation, {
        params: { lat, lng }
      })
      if (res?.data) {
        setZoneData(res.data?.data)
      }
    } catch (err: any) {
       // Silence expected server-side errors to avoid triggering the dev overlay
       if (err.response?.status !== 500) {
        console.warn("Zone fetch error", err)
      }
    }
  }, [])

  const setLocation = useCallback((loc: LocationData) => {
    setLocationState(loc)
    localStorage.setItem("user_location", JSON.stringify(loc))
  }, [])

  // 🔥 CURRENT LOCATION
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setShowLocationModal(true)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        try {
          // Reverse geocode via Nominatim (Free, no key needed)
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
        // GPS permission denied or failed but we keep it silent
        console.log("No location detected from GPS.")
      }
    )
  }

  // 🔥 INIT FLOW: Implements the exact priority: 1. Selected Address -> 2. GPS Fallback
  const initLocation = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      // STEP 1: PRIORITIZE SELECTED ADDRESS (Server Profile)
      if (token) {
        try {
          const res = await axiosInstance.get(Api?.selectedAddress);
          const selected = res?.data?.data;

          if (selected && selected?.lat && selected?.lng) {
             setLocation({
              lat: Number(selected.lat),
              lng: Number(selected.lng),
              city: selected.district || "Unknown",
              state: selected.state || "",
              pincode: selected.pincode || "",
              address: selected.full_address || "",
            });
            return; // 🎯 Found server-side address. STOP HERE. (No GPS prompt shown)
          }
        } catch (e: any) {
          // Silent 404 is allowed here.
          if (e.response?.status !== 401 && e.response?.status !== 404) {
             console.warn("Init location fetch error", e)
          }
        }
      }

      // STEP 2: GPS FALLBACK (If profile is empty)
      // This will trigger the browser permission popup only if step 1 found nothing.
      handleCurrentLocation();

    } catch (error: any) {
       // Final fallback if everything fails
    }
  };

  useEffect(() => {
    initLocation()
  }, [])

  useEffect(() => {
    if (location?.lat && location?.lng) {
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