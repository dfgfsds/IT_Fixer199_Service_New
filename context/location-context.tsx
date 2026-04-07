"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import axiosInstance from "@/configs/axios-middleware"
import Api from "@/api-endpoints/ApiUrls"

export interface LocationData {
  lat: number
  lng: number
  city: string
  state: string
  pincode: string
  address: string
}

const LocationContext = createContext<any>(null)

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

function getClosestArea(lat: number, lng: number, defaultName: string) {
  if (!lat || !lng) return defaultName;
  const R = 6371;
  let closest = null;
  let minD = 2.5; // 2.5 km radius snap

  for (const area of CHENNAI_AREAS) {
    const dLat = (area.lat - lat) * (Math.PI / 180);
    const dLon = (area.lng - lng) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * (Math.PI / 180)) * Math.cos(area.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    if (d < minD) {
      minD = d;
      closest = area.name;
    }
  }
  return closest || defaultName;
}

const extractLocalArea = (addr: any) => {
  if (!addr) return "Unknown"
  const str = (name: any) => name ? String(name) : ""
  const isValid = (name: string) => {
    const l = name.toLowerCase()
    return !l.includes('ward') && !l.includes('division') && !l.includes('cmwssb')
  }
  const clean = (name: string) => name.replace(/zone\s*\d+\s*/i, '').trim()

  const candidates = [
    addr.residential,
    addr.neighbourhood,
    addr.suburb,
    addr.city_district,
    addr.city,
    addr.town,
    addr.village
  ]

  for (const c of candidates) {
    const val = str(c)
    if (val && isValid(val)) {
      const cleaned = clean(val)
      if (cleaned) return cleaned
    }
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
    } catch (err) {
      console.error("Zone fetch error", err)
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
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
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
          setShowLocationModal(true)
        }
      },
      () => setShowLocationModal(true)
    )
  }

  // 🔥 INIT FLOW
  const initLocation = async () => {
    try {
      const savedLoc = localStorage.getItem("user_location")
      if (savedLoc) {
        try {
          const parsed = JSON.parse(savedLoc)
          if (parsed && parsed.lat && parsed.lng) {
            setLocationState(parsed)
            return
          }
        } catch (e) {
          console.error("Failed to parse saved location", e)
        }
      }

      const token = localStorage.getItem("token")

      if (!token) {
        handleCurrentLocation()
        return
      }

      const res = await axiosInstance.get(Api?.selectedAddress)
      const selected = res?.data?.data

      if (selected && selected.lat && selected.lng) {
        setLocation({
          lat: Number(selected.lat),
          lng: Number(selected.lng),
          city: selected.district,
          state: selected.state,
          pincode: selected.pincode,
          address: selected.full_address,
        })
      } else {
        handleCurrentLocation()
      }

    } catch {
      handleCurrentLocation()
    }
  }

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

export const useLocation = () => useContext(LocationContext)