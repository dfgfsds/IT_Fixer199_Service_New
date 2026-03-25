import { useState, useCallback } from "react"
import { getClosestArea, extractLocalArea } from "@/constants/location"

export interface GeocodedAddress {
  city: string
  area: string
  street: string
  state: string
  pincode: string
  fullAddress: string
}

export function useReverseGeocode() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reverseGeocode = useCallback(
    async (lat: number, lng: number): Promise<GeocodedAddress | null> => {
      setLoading(true)
      setError(null)
      try {
        if (typeof window !== "undefined" && window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder()
          try {
            const response = await geocoder.geocode({ location: { lat, lng } })
            if (response && response.results && response.results[0]) {
              const addrComps = response.results[0].address_components
              let neighborhood = ""
              let sublocality = ""
              let locality = ""
              let route = ""
              let state = ""
              let pincode = ""

              for (const comp of addrComps) {
                if (comp.types.includes("neighborhood")) neighborhood = comp.long_name
                if (comp.types.includes("sublocality")) sublocality = comp.long_name
                if (comp.types.includes("locality")) locality = comp.long_name
                if (comp.types.includes("route")) route = comp.long_name
                if (comp.types.includes("administrative_area_level_1")) state = comp.long_name
                if (comp.types.includes("postal_code")) pincode = comp.long_name
              }

              const exactValue = neighborhood || sublocality || locality || "Unknown Area"
              const finalCity = getClosestArea(lat, lng, exactValue)

              setLoading(false)
              return {
                city: finalCity,
                area: exactValue,
                street: route,
                state,
                pincode,
                fullAddress: response.results[0].formatted_address,
              }
            }
          } catch (e) {
            console.error("Google Geocoder failed, falling back to OSM", e)
          }
        }

        // Fallback to Free BigDataCloud Reverse Geocoding Client (Keyless)
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
        )
        const data = await res.json()

        const cityVal = data.city || data.locality || "Unknown"
        const finalCity = getClosestArea(lat, lng, cityVal)

        setLoading(false)
        return {
          city: finalCity,
          area: data.locality || cityVal,
          street: "",
          state: data.principalSubdivision || "",
          pincode: data.postcode || "",
          fullAddress: `${data.locality || cityVal}, ${data.principalSubdivision || "Tamil Nadu"}`,
        }
      } catch (err) {
        setError("Failed to fetch address")
        setLoading(false)
        return null
      }
    },
    []
  )

  return { reverseGeocode, loading, error }
}
