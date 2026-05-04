'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Loader2, Target, LocateFixed } from 'lucide-react'
import { safeErrorLog } from '@/lib/error-handler'

// Helper: Handle Google Maps Script loading safely
const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return;
    if ((window as any).google) {
      resolve((window as any).google);
      return;
    }

    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      const handleLoad = () => resolve((window as any).google);
      existingScript.addEventListener("load", handleLoad);
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve((window as any).google);
    script.onerror = () => reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });
};

// Math helper to find the directional angle between two map points
const getBearing = (startLat: number, startLng: number, destLat: number, destLng: number) => {
  const toRad = (degree: number) => degree * Math.PI / 180;
  const toDeg = (rad: number) => rad * 180 / Math.PI;

  const startLatRad = toRad(startLat);
  const startLngRad = toRad(startLng);
  const destLatRad = toRad(destLat);
  const destLngRad = toRad(destLng);

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);

  const brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

export function LiveMap({
  agentLat,
  agentLng,
  customerLat,
  customerLng,
}: {
  agentLat?: number
  agentLng?: number
  customerLat?: number
  customerLng?: number
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const agentMarkerRef = useRef<google.maps.Marker | null>(null)
  const customerMarkerRef = useRef<google.maps.Marker | null>(null)
  const routePolylineRef = useRef<google.maps.Polyline | null>(null)
  const lastRoutePosRef = useRef<{ lat: number, lng: number } | null>(null)

  // Animation refs for smooth movement
  const prevPosRef = useRef<{ lat: number, lng: number } | null>(null)
  const currentPosRef = useRef<{ lat: number, lng: number } | null>(null)
  const animationFrameRef = useRef<number | null>(null)


  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialRouteFetched, setInitialRouteFetched] = useState(false)
  const [isFollowing, setIsFollowing] = useState(true)

  // 1. INITIALIZE MAP
  const initMap = useCallback(async () => {
    if (!mapRef.current || !customerLat || !customerLng) return

    try {
      const google: any = await loadGoogleMaps()

      const mapOptions: google.maps.MapOptions = {
        center: { lat: customerLat, lng: customerLng },
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "greedy",
        styles: [
          {
            "featureType": "poi",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "transit",
            "stylers": [{ "visibility": "simplified" }]
          }
        ]
      }

      googleMapRef.current = new google.maps.Map(mapRef.current, mapOptions)

      // Listen for user dragging map to pause auto-following
      googleMapRef.current?.addListener('dragstart', () => {
        setIsFollowing(false)
      })

      // Customer Marker (Destination - Native Google Red Pin)
      customerMarkerRef.current = new google.maps.Marker({
        position: { lat: customerLat, lng: customerLng },
        map: googleMapRef.current,
        zIndex: 1
      })

      setIsLoaded(true)
    } catch (err: any) {
      safeErrorLog("Map Load Error", err)
      setError("Failed to load Google Maps")
    }
  }, [customerLat, customerLng])

  useEffect(() => {
    initMap()
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      googleMapRef.current = null
      if (routePolylineRef.current) routePolylineRef.current.setMap(null)
    }
  }, [initMap])

  // 2. FETCH ROUTE & UPDATE DYNAMICALLY
  useEffect(() => {
    if (!isLoaded || !agentLat || !agentLng || !customerLat || !customerLng || !googleMapRef.current) return

    // Movement threshold: Only recalculate if moved > ~10-15 meters 
    // to avoid flickering and save API quota
    if (lastRoutePosRef.current) {
      const distLat = Math.abs(lastRoutePosRef.current.lat - agentLat)
      const distLng = Math.abs(lastRoutePosRef.current.lng - agentLng)
      if (distLat < 0.0001 && distLng < 0.0001) return
    }

    const google: any = (window as any).google
    const startPos = { lat: agentLat, lng: agentLng }
    const destPos = { lat: customerLat, lng: customerLng }

    const directionsService = new google.maps.DirectionsService()

    // Fetch route
    directionsService.route(
      {
        origin: startPos,
        destination: destPos,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result: any, status: any) => {
        if (status === google.maps.DirectionsStatus.OK) {
          lastRoutePosRef.current = startPos

          // Fix the visual disconnect AND overflow: Extract the exact detailed road path
          // and prepend/append our exact marker coordinates to create ONE continuous line.
          const route = result.routes[0];
          if (route && route.legs && route.legs.length > 0) {
            const leg = route.legs[0];

            // Extract detailed path from steps
            const detailedPath: google.maps.LatLng[] = [];
            leg.steps.forEach((step: any) => {
              step.path.forEach((point: google.maps.LatLng) => {
                detailedPath.push(point);
              });
            });

            // Create a single unified array of coordinates
            const unifiedPath = [
              new google.maps.LatLng(startPos.lat, startPos.lng),
              ...detailedPath,
              new google.maps.LatLng(destPos.lat, destPos.lng)
            ];

            // If we already have a polyline, update it. Otherwise, create it.
            if (!routePolylineRef.current) {
              routePolylineRef.current = new google.maps.Polyline({
                path: unifiedPath,
                strokeColor: "#101242",
                strokeOpacity: 0.9,
                strokeWeight: 6,
                map: googleMapRef.current,
                // Ensure rounded caps and joins for perfectly smooth corners
                strokeLinecap: "round",
                strokeLinejoin: "round"
              });
            } else {
              routePolylineRef.current.setPath(unifiedPath);
            }
          }

          // Only auto-zoom/fit bounds the very first time so we don't annoy the user
          if (!initialRouteFetched) {
            const bounds = new google.maps.LatLngBounds()
            bounds.extend(startPos)
            bounds.extend(destPos)
            googleMapRef.current?.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 })
            setInitialRouteFetched(true)
          }
        }
      }
    )
  }, [isLoaded, agentLat, agentLng, customerLat, customerLng]) // Re-run when agent moves


  // 3. SMOOTH DRIVER MOVEMENT, ROTATION & AUTO-FOLLOW
  useEffect(() => {
    if (!isLoaded || !agentLat || !agentLng || !googleMapRef.current) return

    const google: any = (window as any).google
    const newPos = { lat: agentLat, lng: agentLng }

    // Top-Down Delivery Bike Icon Configuration (Dynamic SVG)
    const getAgentIcon = (rotation: number) => {
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="-30 -30 60 60">
            <g transform="rotate(${rotation})">
                <!-- Optional soft shadow -->
                <ellipse cx="0" cy="0" rx="12" ry="24" fill="rgba(0,0,0,0.15)" />
                <!-- Front wheel -->
                <rect x="-2" y="-22" width="4" height="12" rx="2" fill="#1e293b" />
                <!-- Rear wheel -->
                <rect x="-2.5" y="10" width="5" height="14" rx="2" fill="#1e293b" />
                <!-- Bike Chassis / Body (Green) -->
                <path d="M-4,-14 L4,-14 L5.5,-4 L-5.5,-4 Z" fill="#22c55e" />
                <!-- Handles -->
                <rect x="-10" y="-12" width="20" height="2" rx="1" fill="#475569" />
                <rect x="-10" y="-14" width="2" height="4" rx="1" fill="#0f172a" />
                <rect x="8" y="-14" width="2" height="4" rx="1" fill="#0f172a" />
                <!-- Cargo Box (Green outer, dark green inner) -->
                <rect x="-8" y="2" width="16" height="16" rx="2" fill="#22c55e" />
                <rect x="-6" y="4" width="12" height="12" rx="1" fill="#16a34a" />
                <!-- Driver Body -->
                <path d="M-6,-2 C-6,-6 6,-6 6,-2 C6,4 -6,4 -6,-2 Z" fill="#334155" />
                <!-- Driver Helmet -->
                <circle cx="0" cy="-4" r="5.5" fill="#0f172a" stroke="#fff" stroke-width="1.5" />
            </g>
        </svg>`;
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}`,
        anchor: new google.maps.Point(30, 30),
        scaledSize: new google.maps.Size(60, 60),
      };
    };

    // Initial setup if tracking just started
    if (!prevPosRef.current) {
      agentMarkerRef.current = new google.maps.Marker({
        position: newPos,
        map: googleMapRef.current,
        icon: getAgentIcon(0),
        zIndex: 999
      })
      prevPosRef.current = newPos
      currentPosRef.current = newPos
      return
    }

    const targetPos = prevPosRef.current

    // If a new location arrived -> start animation
    if (targetPos.lat !== newPos.lat || targetPos.lng !== newPos.lng) {

      // Ignore tiny micro-fluctuations (GPS jitter)
      const distanceThreshold = 0.00001
      if (Math.abs(targetPos.lat - newPos.lat) < distanceThreshold && Math.abs(targetPos.lng - newPos.lng) < distanceThreshold) {
        return;
      }

      // We animate from exactly where the marker is currently physically sitting
      const startLat = currentPosRef.current ? currentPosRef.current.lat : targetPos.lat
      const startLng = currentPosRef.current ? currentPosRef.current.lng : targetPos.lng

      // Calculate which direction the arrow should face based on where we are going
      const currentHeading = getBearing(startLat, startLng, newPos.lat, newPos.lng)

      // Rotate the vector arrow icon immediately
      agentMarkerRef.current?.setIcon(getAgentIcon(currentHeading))

      // Update the target ref so we don't trigger this again for the same coordinates
      prevPosRef.current = newPos

      const startTime = performance.now()
      const duration = 2000

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Linear interpolation is often smoother for continuous GPS updates 
        // than ease-out, which can cause start/stop stuttering
        const currentLat = startLat + (newPos.lat - startLat) * progress
        const currentLng = startLng + (newPos.lng - startLng) * progress

        const framePos = { lat: currentLat, lng: currentLng }

        // Save physical position so if a new WS message arrives, we start from here
        currentPosRef.current = framePos

        // Reposition the physical marker
        agentMarkerRef.current?.setPosition(framePos)

        // Gently pan camera along with driver if user hasn't interrupted
        if (isFollowing) {
          googleMapRef.current?.panTo(framePos)
        }

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate)
        }
      }

      // Kill any old animation and start the new curve
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
  }, [agentLat, agentLng, isLoaded, isFollowing])


  const handleRecenter = () => {
    setIsFollowing(true)
    if (agentLat && agentLng) {
      googleMapRef.current?.panTo({ lat: agentLat, lng: agentLng })
      googleMapRef.current?.setZoom(16)
    }
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-3xl p-6 text-center space-y-2">
        <p className="text-slate-500 font-bold">{error}</p>
        <p className="text-slate-400 text-xs font-medium">Please check your internet connection or API key</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative group">
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm rounded-3xl space-y-3">
          <Loader2 className="w-8 h-8 text-[#101242] animate-spin" />
          <p className="text-[#101242] font-bold text-xs uppercase tracking-widest">Initializing Route...</p>
        </div>
      )}

      <div ref={mapRef} className="w-full h-full rounded-3xl overflow-hidden shadow-inner" />

      {/* AWAITING AGENT SIGNAL OVERLAY */}
      {isLoaded && (!agentLat || !agentLng) && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md px-6 py-4 rounded-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </div>
            <p className="text-[#101242] font-bold text-xs uppercase tracking-widest">Awaiting Expert GPS Signal...</p>
          </div>
        </div>
      )}

      {/* Recenter button appearing if user sweeps map away, styled to match screenshot */}
      {!isFollowing && isLoaded && (agentLat && agentLng) && (
        <button
          onClick={handleRecenter}
          className="absolute bottom-[70px] right-[9px] z-20 bg-[#101242] backdrop-blur-sm p-2.5 rounded-full shadow-lg shadow-black/10 text-white border border-white hover:scale-105 transition-all animate-in fade-in zoom-in"
          title="Recenter to Expert"
        >
          <LocateFixed className="w-6 h-6 stroke-[2]" />
        </button>
      )}
    </div>
  )
}
