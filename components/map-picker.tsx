"use client"

import { useCallback, useRef } from "react"
import { GoogleMap, useJsApiLoader, Circle } from "@react-google-maps/api"

interface MapPickerProps {
  lat: number
  lng: number
  onMove: (lat: number, lng: number) => void
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

export function MapPicker({ lat, lng, onMove }: MapPickerProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
  })

  const mapRef = useRef<google.maps.Map | null>(null)

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    mapRef.current = map
  }, [])

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    mapRef.current = null
  }, [])

  const handleIdle = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter()
      if (newCenter) {
        onMove(newCenter.lat(), newCenter.lng())
      }
    }
  }

  if (!isLoaded)
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-sm font-medium text-muted-foreground">
        Loading Google Maps...
      </div>
    )

  return (
    <div className="relative h-full w-full bg-muted">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat, lng }}
        zoom={16}
        options={{
          disableDefaultUI: true,
          zoomControl: false,
          clickableIcons: false,
          keyboardShortcuts: false,
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onIdle={handleIdle}
      >
        <Circle
          center={{ lat, lng }}
          radius={2500}
          options={{
            fillColor: "#ea580c",
            fillOpacity: 0.1,
            strokeColor: "#ea580c",
            strokeOpacity: 0.3,
            strokeWeight: 1,
            clickable: false,
          }}
        />
      </GoogleMap>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full pb-1">
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg" 
          className="text-primary drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] origin-bottom"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    </div>
  )
}
