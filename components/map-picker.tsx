"use client"

import { useCallback, useRef } from "react"
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"

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

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onMove(e.latLng.lat(), e.latLng.lng())
    }
  }

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onMove(e.latLng.lat(), e.latLng.lng())
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
        onClick={handleMapClick}
      >
        <Marker 
          position={{ lat, lng }}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
        />
      </GoogleMap>
    </div>
  )
}
