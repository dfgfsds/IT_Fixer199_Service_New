'use client'

import { useState, useCallback, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Circle } from '@react-google-maps/api'

interface LocationMapProps {
  center: [number, number]
  onMoveEnd: (center: [number, number]) => void
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
}

export function LocationMap({ center, onMoveEnd }: LocationMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''
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
        onMoveEnd([newCenter.lat(), newCenter.lng()])
      }
    }
  }

  if (!isLoaded) return <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 text-sm font-medium">Loading Google Maps...</div>

  return (
    <div className="relative w-full h-full bg-slate-100">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: center[0], lng: center[1] }}
        zoom={15}
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
        {/* Delivery Radius Circle (Zepto Style) */}
        <Circle
          center={{ lat: center[0], lng: center[1] }}
          radius={2500} // 2.5 km service radius visualization
          options={{
            fillColor: '#101242',
            fillOpacity: 0.1,
            strokeColor: '#101242',
            strokeOpacity: 0.3,
            strokeWeight: 1,
            clickable: false,
          }}
        />
      </GoogleMap>

      {/* Fixed Center Pin Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none pb-1">
        {/* Bouncing Animation Wrapper for Zepto Feel */}
        <div className="animate-bounce">
          <div className="w-10 h-10 bg-[#101242] rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(128,0,0,0.4)] transform origin-bottom after:content-[''] after:absolute after:-bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:border-l-[6px] after:border-l-transparent after:border-r-[6px] after:border-r-transparent after:border-t-[8px] after:border-t-[#101242]">
            <div className="w-4 h-4 rounded-full bg-white shadow-inner" />
          </div>
        </div>
      </div>
    </div>
  )
}
