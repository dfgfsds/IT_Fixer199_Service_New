import { useState, useCallback } from "react"

export function useGeolocation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const detect = useCallback((): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      setLoading(true)
      setError(null)

      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.")
        setLoading(false)
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setLoading(false)
          resolve(coords)
        },
        (err) => {
          setError(
            err.code === 1
              ? "Location access denied. Please allow location permission."
              : "Could not detect location. Please try again."
          )
          setLoading(false)
          resolve(null)
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      )
    })
  }, [])

  return { detect, loading, error }
}
