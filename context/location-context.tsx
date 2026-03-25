// "use client"

// import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

// export interface LocationData {
//   lat: number
//   lng: number
//   street: string
//   area: string
//   city: string
//   state: string
//   country: string
//   pincode: string
//   address: string
// }

// interface LocationContextType {
//   location: LocationData
//   setLocation: (location: any) => void
//   detecting: boolean
//   detectLocation: () => Promise<LocationData | null>
//   recentLocations: LocationData[]
//   showLocationModal: boolean
//   setShowLocationModal: (show: boolean) => void
// }

// const LocationContext = createContext<LocationContextType | undefined>(undefined)

// const DEFAULT_LOCATION: LocationData = {
//   lat: 13.0827,
//   lng: 80.2707,
//   street: "",
//   area: "T. Nagar",
//   city: "Chennai",
//   state: "Tamil Nadu",
//   country: "India",
//   pincode: "600017",
//   address: "T. Nagar, Chennai, Tamil Nadu, India",
// }

// async function reverseGeocode(lat: number, lng: number): Promise<LocationData> {
//   try {
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`,
//       { headers: { "Accept-Language": "en" } }
//     )
//     console.log(res)
//     const data = await res.json()
//     const addr = data.address || {}
//     const street = addr.road || addr.pedestrian || addr.footway || ""
//     const area = addr.neighbourhood || addr.suburb || addr.hamlet || ""
//     const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || ""
//     const state = addr.state || ""
//     const country = addr.country || ""
//     const pincode = addr.postcode || ""
//     const parts = [street, area, city, state, country].filter(Boolean)
//     return {
//       lat,
//       lng,
//       street,
//       area,
//       city: city || "Unknown",
//       state,
//       country,
//       pincode,
//       address: parts.join(", ") || data.display_name || "Unknown location",
//     }
//   } catch {
//     return { ...DEFAULT_LOCATION, lat, lng, city: "Unknown", address: "Could not determine address" }
//   }
// }

// export function LocationProvider({ children }: { children: ReactNode }) {
//   const [location, setLocationState] = useState<LocationData>(DEFAULT_LOCATION)
//   const [detecting, setDetecting] = useState(false)
//   const [recentLocations, setRecentLocations] = useState<LocationData[]>([])
//   const [showLocationModal, setShowLocationModal] = useState(false)

//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem("servenow_location")
//       if (saved) setLocationState(JSON.parse(saved))
//       const recent = localStorage.getItem("servenow_recent_locations")
//       if (recent) setRecentLocations(JSON.parse(recent))
//     } catch {
//       /* ignore */
//     }
//   }, [])

//   const setLocation = useCallback((loc: LocationData) => {
//     setLocationState(loc)
//     try {
//       localStorage.setItem("servenow_location", JSON.stringify(loc))
//       setRecentLocations((prev) => {
//         const filtered = prev.filter(
//           (r) => !(Math.abs(r.lat - loc.lat) < 0.001 && Math.abs(r.lng - loc.lng) < 0.001)
//         )
//         const updated = [loc, ...filtered].slice(0, 5)
//         localStorage.setItem("servenow_recent_locations", JSON.stringify(updated))
//         return updated
//       })
//     } catch {
//       /* ignore */
//     }
//   }, [])

//   const detectLocation = useCallback((): Promise<LocationData | null> => {
//     return new Promise((resolve) => {
//       setDetecting(true)
//       if (!("geolocation" in navigator)) {
//         setDetecting(false)
//         resolve(null)
//         return
//       }
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const loc = await reverseGeocode(position.coords.latitude, position.coords.longitude)
//           setLocation(loc)
//           setDetecting(false)
//           resolve(loc)
//         },
//         () => {
//           setDetecting(false)
//           resolve(null)
//         },
//         { timeout: 10000, enableHighAccuracy: true }
//       )
//     })
//   }, [setLocation])

//   return (
//     <LocationContext.Provider
//       value={{
//         location,
//         setLocation,
//         detecting,
//         detectLocation,
//         recentLocations,
//         showLocationModal,
//         setShowLocationModal,
//       }}
//     >
//       {children}
//     </LocationContext.Provider>
//   )
// }

// export function useLocation() {
//   const ctx = useContext(LocationContext)
//   if (!ctx) throw new Error("useLocation must be used inside LocationProvider")
//   return ctx
// }


// "use client"

// import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
// import Api from '../api-endpoints/ApiUrls';
// import axiosInstance from "@/configs/axios-middleware";

// export interface LocationData {
//   lat: number
//   lng: number
//   street: string
//   area: string
//   city: string
//   state: string
//   country: string
//   pincode: string
//   address: string
// }

// interface LocationContextType {
//   location: LocationData
//   setLocation: (location: LocationData) => void
//   detecting: boolean
//   detectLocation: () => Promise<LocationData | null>
//   recentLocations: LocationData[]
//   showLocationModal: boolean
//   setShowLocationModal: (show: boolean) => void
//   zoneData: any
// }

// const LocationContext = createContext<LocationContextType | undefined>(undefined)

// const DEFAULT_LOCATION: LocationData = {
//   lat: 13.0827,
//   lng: 80.2707,
//   street: "",
//   area: "T. Nagar",
//   city: "Chennai",
//   state: "Tamil Nadu",
//   country: "India",
//   pincode: "600017",
//   address: "T. Nagar, Chennai, Tamil Nadu, India",
// }

// async function reverseGeocode(lat: number, lng: number): Promise<LocationData> {
//   try {
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`,
//       {
//         headers: {
//           "Accept-Language": "en",
//           "User-Agent": "servenow-app",
//         },
//       }
//     )

//     const data = await res.json()
//     const addr = data.address || {}

//     const street = addr.road || addr.pedestrian || addr.footway || ""
//     const area = addr.neighbourhood || addr.suburb || addr.hamlet || ""
//     const city =
//       addr.city ||
//       addr.town ||
//       addr.village ||
//       addr.county ||
//       addr.state_district ||
//       ""

//     const state = addr.state || ""
//     const country = addr.country || ""
//     const pincode = addr.postcode || ""

//     const parts = [street, area, city, state, country].filter(Boolean)

//     return {
//       lat,
//       lng,
//       street,
//       area,
//       city: city || "Unknown",
//       state,
//       country,
//       pincode,
//       address: parts.join(", ") || data.display_name || "Unknown location",
//     }
//   } catch {
//     return {
//       ...DEFAULT_LOCATION,
//       lat,
//       lng,
//       city: "Unknown",
//       address: "Could not determine address",
//     }
//   }
// }

// export function LocationProvider({ children }: { children: ReactNode }) {
//   const [location, setLocationState] = useState<LocationData>(DEFAULT_LOCATION)
//   const [detecting, setDetecting] = useState(false)
//   const [recentLocations, setRecentLocations] = useState<LocationData[]>([])
//   const [showLocationModal, setShowLocationModal] = useState(false)
//   const [zoneData, setZoneData] = useState<any>("")

//   // 🔥 Load location only once from localStorage
//   useEffect(() => {
//     const savedLocation = localStorage.getItem("servenow_location")
//     const savedRecent = localStorage.getItem("servenow_recent_locations")

//     if (savedLocation) {
//       setLocationState(JSON.parse(savedLocation))
//     } else {
//       // first time user open site
//       detectLocation()
//     }

//     if (savedRecent) {
//       setRecentLocations(JSON.parse(savedRecent))
//     }
//   }, [])

//   const fetchZoneByLocation = async (lat: number, lng: number) => {
//     try {
//       const res = await axiosInstance.get(
//         `${Api?.zoneByLocation}?lat=${lat}&lng=${lng}`
//       )
//       if (res?.data?.success) {
//         setZoneData(res?.data?.zone_slot)
//         localStorage.setItem("zone_data", JSON.stringify(res?.data?.zone_slot))
//       }
//     } catch (err) {
//       console.error("Zone fetch error", err)
//     }
//   }


//   // const setLocation = useCallback((loc: LocationData) => {
//   //   setLocationState(loc)

//   //   localStorage.setItem("servenow_location", JSON.stringify(loc))

//   //   setRecentLocations((prev) => {
//   //     const filtered = prev.filter(
//   //       (r) =>
//   //         !(Math.abs(r.lat - loc.lat) < 0.001 && Math.abs(r.lng - loc.lng) < 0.001)
//   //     )

//   //     const updated = [loc, ...filtered].slice(0, 5)

//   //     localStorage.setItem("servenow_recent_locations", JSON.stringify(updated))

//   //     return updated
//   //   })
//   // }, [])

//   useEffect(() => {
//     const savedZone = localStorage.getItem("zone_data")

//     if (savedZone) {
//       setZoneData(JSON.parse(savedZone))
//     }
//   }, [])

//   const setLocation = useCallback((loc: LocationData) => {
//     setLocationState(loc)

//     localStorage.setItem("servenow_location", JSON.stringify(loc))

//     // 🔥 CALL ZONE API HERE
//     if (loc?.lat && loc?.lng) {
//       fetchZoneByLocation(loc.lat, loc.lng)
//     }

//     setRecentLocations((prev) => {
//       const filtered = prev.filter(
//         (r) =>
//           !(Math.abs(r.lat - loc.lat) < 0.001 && Math.abs(r.lng - loc.lng) < 0.001)
//       )

//       const updated = [loc, ...filtered].slice(0, 5)

//       localStorage.setItem("servenow_recent_locations", JSON.stringify(updated))

//       return updated
//     })
//   }, [])

//   const detectLocation = useCallback((): Promise<LocationData | null> => {
//     return new Promise((resolve) => {
//       setDetecting(true)

//       if (!("geolocation" in navigator)) {
//         setDetecting(false)
//         resolve(null)
//         return
//       }

//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const loc = await reverseGeocode(
//             position.coords.latitude,
//             position.coords.longitude
//           )

//           setLocation(loc)
//           setDetecting(false)
//           resolve(loc)
//         },
//         () => {
//           setDetecting(false)
//           resolve(null)
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 10000,
//         }
//       )
//     })
//   }, [setLocation])

//   return (
//     <LocationContext.Provider
//       value={{
//         location,
//         setLocation,
//         detecting,
//         detectLocation,
//         recentLocations,
//         showLocationModal,
//         setShowLocationModal,
//         zoneData,
//       }}
//     >
//       {children}
//     </LocationContext.Provider>
//   )
// }

// export function useLocation() {
//   const ctx = useContext(LocationContext)

//   if (!ctx) {
//     throw new Error("useLocation must be used inside LocationProvider")
//   }

//   return ctx
// }

// "use client"

// import { createContext, useContext, useState, useEffect, useCallback } from "react"
// import Api from '../api-endpoints/ApiUrls';
// import axiosInstance from "@/configs/axios-middleware";

// export interface LocationData {
//   lat: number
//   lng: number
//   city: string
//   state: string
//   pincode: string
//   address: string
// }

// const LocationContext = createContext<any>(null)

// export function LocationProvider({ children }: any) {
//   const [location, setLocationState] = useState<LocationData | null>(null)
//   const [addressList, setAddressList] = useState<any[]>([])
//   const [showLocationModal, setShowLocationModal] = useState(false)
//   const [zoneData, setZoneData] = useState<any>("")

//   const fetchAddresses = async () => {
//     try {
//       const res = await axiosInstance.get(Api?.selectedAddress)
//       const list = res?.data?.data || []

//       setAddressList(list)

//       if (list) {
//         // const primary = list.find((a: any) => a.is_primary)
//         // const selected = primary || list[0]
//         fetchZoneByLocation(list?.lat, list?.lng)
//         const selected = list;
//         setLocationState({
//           lat: Number(selected?.lat),
//           lng: Number(selected?.lng),
//           city: selected?.district,
//           state: selected?.state,
//           pincode: selected?.pincode,
//           address: selected?.full_address,
//         })
//       } else {
//         // 🔥 no address → open modal
//         setShowLocationModal(true)
//       }

//     } catch (err) {
//       console.error(err)
//       setShowLocationModal(true)
//     }
//   }

//   const fetchZoneByLocation = async (lat: number, lng: number) => {
//     try {
//       const res = await axiosInstance.get(
//         `${Api?.zoneByLocation}?lat=${lat}&lng=${lng}`
//       )
//       if (res?.data?.success) {
//         setZoneData(res?.data?.zone_slot)
//         localStorage.setItem("zone_data", JSON.stringify(res?.data?.zone_slot))
//       }
//     } catch (err) {
//       console.error("Zone fetch error", err)
//     }
//   }


//   useEffect(() => {
//     fetchAddresses()
//   }, [])

//   const setLocation = useCallback((loc: LocationData) => {
//     setLocationState(loc)
//   }, [])

//   return (
//     <LocationContext.Provider value={{
//       location,
//       setLocation,
//       addressList,
//       fetchAddresses,
//       showLocationModal,
//       setShowLocationModal,
//       zoneData,
//     }}>
//       {children}
//     </LocationContext.Provider>
//   )
// }

// export const useLocation = () => useContext(LocationContext)

// "use client"

// import { createContext, useContext, useState, useEffect, useCallback } from "react"
// import axiosInstance from "@/configs/axios-middleware"
// import Api from "@/api-endpoints/ApiUrls"

// export interface LocationData {
//   lat: number
//   lng: number
//   city: string
//   state: string
//   pincode: string
//   address: string
// }

// const LocationContext = createContext<any>(null)

// export function LocationProvider({ children }: any) {
//   const [location, setLocationState] = useState<LocationData | null>(null)
//   const [showLocationModal, setShowLocationModal] = useState(false)
//   const [zoneData, setZoneData] = useState<any>("")

//   // 🔥 ZONE
//   const fetchZoneByLocation = async (lat: number, lng: number) => {
//     try {
//       const res = await axiosInstance.get(
//         `${Api?.zoneByLocation}?lat=${lat}&lng=${lng}`
//       )
//       if (res?.data?.success) {
//         setZoneData(res.data.zone_slot)
//       }
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   // 🔥 SET LOCATION COMMON
//   const setLocation = useCallback((loc: LocationData) => {
//     setLocationState(loc)

//     if (loc?.lat && loc?.lng) {
//       fetchZoneByLocation(loc.lat, loc.lng)
//     }
//   }, [])

//   // 🔥 CURRENT LOCATION
//   const handleCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       setShowLocationModal(true)
//       return
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const lat = pos.coords.latitude
//         const lng = pos.coords.longitude

//         try {
//           // 👉 FREE reverse geocode (openstreetmap)
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//           )

//           const data = await res.json()
//           const addr = data.address || {}

//           const loc = {
//             lat,
//             lng,
//             city: addr.city || addr.town || addr.village || "Unknown",
//             state: addr.state || "",
//             pincode: addr.postcode || "",
//             address: data.display_name || "",
//           }

//           setLocation(loc)

//         } catch {
//           setShowLocationModal(true)
//         }
//       },
//       () => setShowLocationModal(true)
//     )
//   }

//   // 🔥 INITIAL LOAD
//   const initLocation = async () => {
//     try {
//       const token = localStorage.getItem("token")

//       // 🔥 if no login → skip API
//       if (!token) {
//         handleCurrentLocation()
//         return
//       }

//       const res = await axiosInstance.get(Api?.selectedAddress)
//       const selected = res?.data?.data

//       if (selected && selected.lat && selected.lng) {

//         const loc = {
//           lat: Number(selected.lat),
//           lng: Number(selected.lng),
//           city: selected.district,
//           state: selected.state,
//           pincode: selected.pincode,
//           address: selected.full_address,
//         }

//         setLocation(loc)

//       } else {
//         handleCurrentLocation()
//       }

//     } catch {
//       handleCurrentLocation()
//     }
//   }

//   useEffect(() => {
//     initLocation()
//   }, [])

//   return (
//     <LocationContext.Provider value={{
//       location,
//       setLocation,
//       showLocationModal,
//       setShowLocationModal,
//       zoneData,
//     }}>
//       {children}
//     </LocationContext.Provider>
//   )
// }

// export const useLocation = () => useContext(LocationContext)

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

export function LocationProvider({ children }: any) {
  const [location, setLocationState] = useState<LocationData | null>(null)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [zoneData, setZoneData] = useState<any>("")

  const setLocation = useCallback((loc: LocationData) => {
    setLocationState(loc)
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

          setLocation({
            lat,
            lng,
            city: addr.city || addr.town || addr.village || "Unknown",
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