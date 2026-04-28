'use client'

// Skeleton card
function AddressSkeleton() {
  return (
    <div className="p-6 rounded-[32px] bg-white border border-slate-100 space-y-3 relative overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-200/40 to-transparent z-10" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-slate-100 shrink-0" />
          <div className="h-5 w-32 bg-slate-100 rounded-full" />
        </div>
        {/* Active badge placeholder */}
        <div className="h-6 w-16 bg-slate-100 rounded-full" />
      </div>

      <div className="space-y-2 py-1">
        <div className="h-4 w-[90%] bg-slate-100 rounded-full" />
        <div className="h-3 w-[60%] bg-slate-100 rounded-full" />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <div className="h-4 w-10 bg-slate-100 rounded-full" />
        <div className="h-4 w-14 bg-slate-100 rounded-full" />
        <div className="h-8 w-24 bg-slate-100 rounded-xl ml-auto" />
      </div>
    </div>
  )
}

import { safeErrorLog } from '@/lib/error-handler'
import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, LogOut, Plus, Map, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'
import { useAuth } from '@/context/auth-context'
import { useLocation } from '@/context/location-context'
import { extractErrorMessage } from '@/lib/error-utils'

export default function AddressesTab() {
  const { user } = useAuth()
  const { location, setLocation } = useLocation()

  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [userAddresses, setUserAddresses] = useState<any[]>([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)

  // New address form state
  const [newAddress, setNewAddress] = useState({
    name: '',
    contact: '',
    full_address: '',
    pincode: '',
    district: '',
    state: '',
    selected_address: true,
    lat: "",
    lng: ""
  })

  const [showMap, setShowMap] = useState(false)
  const [mapLoading, setMapLoading] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  // Map initialization and helpers
  const loadGoogleMaps = useCallback(() => {
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
  }, []);

  const geocodeAddress = async (address: string) => {
    const google: any = await loadGoogleMaps();
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === "OK" && results[0]) {
          const loc = results[0].geometry.location;
          const lat = loc.lat().toString();
          const lng = loc.lng().toString();
          resolve({ lat, lng, formattedAddress: results[0].formatted_address });
        } else {
          reject("Address not found");
        }
      });
    });
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    const google: any = await loadGoogleMaps();
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
        if (status === "OK" && results[0]) {
          const components = results[0].address_components;
          const getComponent = (type: string) => components.find((c: any) => c.types.includes(type))?.long_name || "";

          resolve({
            full_address: results[0].formatted_address,
            pincode: getComponent("postal_code"),
            district: getComponent("locality") || getComponent("administrative_area_level_2"),
            state: getComponent("administrative_area_level_1"),
          });
        } else {
          reject("Location not found");
        }
      });
    });
  };

  const initMap = useCallback(async () => {
    if (!showMap || !mapRef.current) return;

    try {
      setMapLoading(true);
      const google: any = await loadGoogleMaps();

      // Ensure the ref still exists after the async call (e.g. if map was closed during load)
      if (!mapRef.current) {
        setMapLoading(false);
        return;
      }

      const parsedLat = parseFloat(newAddress.lat);
      const parsedLng = parseFloat(newAddress.lng);

      const currentLat = isNaN(parsedLat) ? 13.0827 : parsedLat;
      const currentLng = isNaN(parsedLng) ? 80.2707 : parsedLng;

      const mapOptions = {
        center: { lat: currentLat, lng: currentLng },
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      };

      // Cleanup existing map if re-initializing
      if (googleMapRef.current) {
        google.maps.event.clearInstanceListeners(googleMapRef.current);
      }

      googleMapRef.current = new google.maps.Map(mapRef.current, mapOptions);
      markerRef.current = new google.maps.Marker({
        position: { lat: currentLat, lng: currentLng },
        map: googleMapRef.current,
        draggable: true,
        animation: google.maps.Animation.DROP,
      });

      googleMapRef.current.addListener("click", (e: any) => {
        const clickedLat = e.latLng.lat();
        const clickedLng = e.latLng.lng();
        markerRef.current.setPosition({ lat: clickedLat, lng: clickedLng });
        handleMarkerUpdate(clickedLat, clickedLng);
      });

      markerRef.current.addListener("dragend", (e: any) => {
        const draggedLat = e.latLng.lat();
        const draggedLng = e.latLng.lng();
        handleMarkerUpdate(draggedLat, draggedLng);
      });

      setTimeout(() => {
        google.maps.event.trigger(googleMapRef.current, 'resize');
      }, 300);

    } catch (error) {
      safeErrorLog("Map initialization failed", error);
      toast.error("Failed to load Map. Please check your connection.");
    } finally {
      setMapLoading(false);
    }
  }, [showMap, loadGoogleMaps]);

  const handleMarkerUpdate = async (lat: number, lng: number) => {
    try {
      const details: any = await reverseGeocode(lat, lng);
      setNewAddress(prev => ({
        ...prev,
        ...details,
        lat: lat.toString(),
        lng: lng.toString()
      }));
    } catch (error) {
      safeErrorLog("Marker update failed", error);
    }
  };

  const handleLocateOnMap = async () => {
    const searchString = [newAddress.full_address, newAddress.district, newAddress.state, newAddress.pincode].filter(Boolean).join(', ');

    if (!searchString || !newAddress.full_address) {
      toast.error("Please enter your address details first");
      return;
    }
    setMapLoading(true);
    try {
      const result: any = await geocodeAddress(searchString);
      const latNum = parseFloat(result.lat);
      const lngNum = parseFloat(result.lng);

      // Extract full details from the new coordinates
      const details: any = await reverseGeocode(latNum, lngNum);

      setNewAddress(prev => ({
        ...prev,
        ...details,
        lat: result.lat,
        lng: result.lng
      }));

      if (!showMap) setShowMap(true);
      setTimeout(() => {
        if (googleMapRef.current) {
          googleMapRef.current.setCenter({ lat: latNum, lng: lngNum });
          if (markerRef.current) {
            markerRef.current.setPosition({ lat: latNum, lng: lngNum });
          }
        }
      }, 500);
    } catch (error) {
      toast.error("Could not find address on map. Please check your details.");
    } finally {
      setMapLoading(false);
    }
  };

  const toggleMap = async () => {
    const nextShowMap = !showMap;
    setShowMap(nextShowMap);

    if (nextShowMap) {
      // Attempt to get current location
      if (navigator.geolocation) {
        setMapLoading(true);
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const details: any = await reverseGeocode(latitude, longitude);
              setNewAddress(prev => ({
                ...prev,
                ...details,
                lat: latitude.toString(),
                lng: longitude.toString()
              }));

              // Center map if it's already initialized
              if (googleMapRef.current) {
                googleMapRef.current.setCenter({ lat: latitude, lng: longitude });
                markerRef.current.setPosition({ lat: latitude, lng: longitude });
              }
            } catch (error) {
              safeErrorLog("Reverse geocoding failed", error);
            } finally {
              setMapLoading(false);
            }
          },
          (error: any) => {
            const errorMessage = error.message || String(error);
            console.warn("Geolocation error:", errorMessage);
            setMapLoading(false);
            setShowMap(false);

            if (error.code === 1 || errorMessage.toLowerCase().includes("denied")) {
              toast.error("Location access blocked. Please enter your address manually and use 'Locate on Map'.", { duration: 5000 });
            } else {
              toast.error("Could not access current location. Please enter your address manually.");
            }
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      }
    }
  };

  useEffect(() => {
    if (showMap) {
      initMap();
    }
    return () => {
      if (googleMapRef.current) {
        googleMapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [showMap, initMap]);


  const openAddModal = () => {
    if (userAddresses.length >= 5) {
      toast.error("Maximum limit of 5 addresses reached. Please remove an existing address to add a new one.", {
        duration: 4000,
      });
      return;
    }
    setEditingAddressId(null)
    setNewAddress({
      name: user?.name || '',
      contact: user?.mobile_number || '',
      full_address: '',
      pincode: '',
      district: '',
      state: '',
      selected_address: true,
      lat: "",
      lng: ""
    })
    setShowAddModal(true)
    setShowMap(false)
  }

  // Handle auto-open address form from query params
  useEffect(() => {
    const action = searchParams.get('action')
    if (action === 'add') {
      const timer = setTimeout(() => {
        openAddModal()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [searchParams, user])

  // Fetch addresses when tab changes
  const fetchAddresses = async () => {
    setLoadingAddresses(true)
    try {
      const response = await axiosInstance.get(Api.myAddress)
      const rawData = response.data?.data || response.data
      const data = Array.isArray(rawData) ? rawData : []

      // Sort by selected status first, then latest update
      const sortedData = [...data].sort((a: any, b: any) => {
        if (a.selected_address && !b.selected_address) return -1
        if (!a.selected_address && b.selected_address) return 1
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      })

      setUserAddresses(sortedData)

      if (sortedData.length > 0 && !sortedData.some((a: any) => a.selected_address)) {
        const topAddr = sortedData[0]
        try {
          await axiosInstance.patch(`${Api.addressFlags}/${topAddr.id}`, {
            ...topAddr,
            selected_address: true,
            is_primary: true
          })

          const finalRes = await axiosInstance.get(Api.myAddress)
          const finalData = Array.isArray(finalRes.data?.data || finalRes.data) ? (finalRes.data?.data || finalRes.data) : []
          const finalSorted = [...finalData].sort((a: any, b: any) => {
            if (a.selected_address && !b.selected_address) return -1
            if (!a.selected_address && b.selected_address) return 1
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          })
          setUserAddresses(finalSorted)

          setLocation({
            lat: Number(topAddr.lat),
            lng: Number(topAddr.lng),
            city: topAddr.district || topAddr.city || "Unknown",
            address: topAddr.full_address || topAddr.address || "",
            pincode: topAddr.pincode,
            state: topAddr.state
          });
        } catch (err: any) {
          safeErrorLog("Auto-selection failed", err)
          toast.error(extractErrorMessage(err))
        }
      }
    } catch (error: any) {
      safeErrorLog('Error fetching addresses', error)
      toast.error(extractErrorMessage(error))
    } finally {
      setLoadingAddresses(false)
    }
  }

  const confirmDelete = (addressId: string) => {
    setAddressToDelete(addressId)
    setShowDeleteModal(true)
  }

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return

    setLoading(true)
    try {
      await axiosInstance.delete(`${Api.address}/${addressToDelete}`)
      toast.success('Address removed successfully')

      if (userAddresses.length <= 1) {
        window.location.reload()
        return
      }

      await fetchAddresses()
      setShowDeleteModal(false)
      setAddressToDelete(null)
    } catch (error: any) {
      toast.error(extractErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const handleSetPrimary = async (addr: any) => {
    if (addr.selected_address) return;
    setLoading(true);
    try {
      await axiosInstance.patch(`${Api.addressFlags}/${addr.id}`, {
        ...addr,
        selected_address: true,
        is_primary: true
      });

      setLocation({
        lat: Number(addr.lat),
        lng: Number(addr.lng),
        city: addr.district || addr.city || "Unknown",
        address: addr.full_address || addr.address || "",
        pincode: addr.pincode,
        state: addr.state
      });

      await fetchAddresses();
      toast.success('Active address updated successfully');
    } catch (error: any) {
      toast.error(extractErrorMessage(error))
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (addr: any) => {
    setEditingAddressId(addr.id)
    setNewAddress({
      name: addr.name || '',
      contact: addr.contact || '',
      full_address: addr.full_address || '',
      pincode: addr.pincode || '',
      district: addr.district || '',
      state: addr.state || '',
      selected_address: true,
      lat: addr.lat?.toString() || "",
      lng: addr.lng?.toString() || ""
    })
    setShowAddModal(true)
    setShowMap(false)
  }

  const handleSubmitAddress = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newAddress.contact.replace(/\D/g, '').length !== 10) {
      toast.error('Contact number must be exactly 10 digits')
      return
    }

    setLoading(true)
    try {
      let finalLat = newAddress.lat;
      let finalLng = newAddress.lng;

      const searchString = [newAddress.full_address, newAddress.district, newAddress.state, newAddress.pincode].filter(Boolean).join(', ');

      if (searchString && (newAddress.full_address || newAddress.district)) {
        try {
          const result: any = await geocodeAddress(searchString);
          finalLat = result.lat.toString();
          finalLng = result.lng.toString();

          // AUTO-FILL: If district/state/pincode are missing, fetch them now
          if (!newAddress.district || !newAddress.state || !newAddress.pincode) {
            try {
              const details: any = await reverseGeocode(parseFloat(finalLat), parseFloat(finalLng));
              setNewAddress(prev => ({ ...prev, ...details }));
              // Update local variables for immediate payload use
              newAddress.district = details.district || newAddress.district;
              newAddress.state = details.state || newAddress.state;
              newAddress.pincode = details.pincode || newAddress.pincode;
            } catch (revErr) {
              console.warn("Auto-fill during save failed", revErr);
            }
          }
        } catch (err) {
          if (!finalLat || !finalLng || (finalLat === "13.0827" && finalLng === "80.2707")) {
            toast.error("Could not find precise address on map. Please verify or pin manually.");
            setLoading(false);
            return;
          }
        }
      } else if (!finalLat || !finalLng) {
        toast.error("Please provide your address and search on map");
        setLoading(false);
        return;
      }

      const payload = {
        ...newAddress,
        is_primary: true,
        google_address: newAddress.full_address,
        lat: finalLat,
        lng: finalLng
      }

      const url = editingAddressId ? `${Api.address}/${editingAddressId}` : Api.address;
      const method = editingAddressId ? 'put' : 'post';

      await axiosInstance[method](url, payload)
      toast.success(editingAddressId ? 'Address updated successfully' : 'Address added successfully')

      await fetchAddresses()

      setLocation({
        lat: Number(finalLat),
        lng: Number(finalLng),
        city: newAddress.district || "Unknown",
        address: newAddress.full_address,
        pincode: newAddress.pincode,
        state: newAddress.state
      });

      setShowAddModal(false)
      setEditingAddressId(null)
      fetchAddresses() // Refresh list
    } catch (error: any) {
      toast.error(extractErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [user?.id])

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-black text-[#101242]">Addresses</h3>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-[#101242] text-white rounded-2xl font-bold shadow-none hover:-translate-y-0.5 transition-all text-sm"
          >
            <Plus className="w-5 h-5" />
            Add New
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {loadingAddresses ? (
            <>
              <AddressSkeleton />
              <AddressSkeleton />
              <AddressSkeleton />
              <AddressSkeleton />
            </>
          ) : userAddresses.length === 0 ? (
            <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] text-center space-y-3">
              <p className="text-slate-500 font-bold">No saved addresses found</p>
              <p className="text-slate-400 text-sm">Add an address to start booking services</p>
            </div>
          ) : (
            userAddresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-6 rounded-[32px] border ${addr.selected_address ? 'border-[#101242] bg-red-50/40 shadow-lg shadow-[#101242]/10' : 'bg-white border-slate-100'} space-y-3 relative group transition-all hover:shadow-xl`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-5 h-5 ${addr.selected_address ? 'text-[#101242]' : 'text-slate-400'}`} />
                    <span className="font-bold text-[#101242]">{addr.name || 'Saved Address'}</span>
                  </div>
                  {addr.selected_address && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#101242] bg-white border border-red-100 shadow-sm px-3 py-1.5 rounded-full">Active</span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">{addr.full_address}</p>
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-tight">
                    {addr.district}, {addr.state} - {addr.pincode}
                  </p>
                </div>
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => openEditModal(addr)}
                    className="text-xs font-bold text-[#101242] tracking-widest uppercase hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(addr.id)}
                    className="text-xs font-bold text-slate-400 tracking-widest uppercase hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                  {!addr.selected_address && (
                    <button
                      onClick={() => handleSetPrimary(addr)}
                      disabled={loading}
                      className="text-xs font-black text-white bg-[#101242] hover:bg-[#800000] px-4 py-2 rounded-xl tracking-widest uppercase transition-all ml-auto disabled:opacity-50 shadow-md"
                    >
                      Set Active
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white max-w-sm w-full rounded-[40px] p-8 shadow-2xl shadow-slate-900/20 border border-slate-100 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
              <LogOut className="w-8 h-8 text-red-500 rotate-180" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-[#101242]">Remove Address?</h3>
              <p className="text-slate-500 font-medium text-sm">Are you sure you want to remove this saved address from your profile?</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteAddress}
                disabled={loading}
                className="w-full py-4 bg-[#101242] text-white rounded-2xl font-bold hover:bg-[#600000] transition-all disabled:opacity-70"
              >
                {loading ? 'Removing...' : 'Remove'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setAddressToDelete(null)
                }}
                disabled={loading}
                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all disabled:opacity-70"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 animate-in fade-in duration-300">
          <div className="bg-white max-w-2xl w-full rounded-[20px] p-6 lg:p-8 shadow-2xl shadow-slate-900/20 border border-slate-100 max-h-[75vh] md:max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-[#101242]">
                {editingAddressId ? 'Edit Service Address' : 'New Service Address'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingAddressId(null)
                }}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                disabled={loading}
              >
                <Plus className="w-6 h-6 text-[#101242] rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmitAddress} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Contact Name</label>
                  <input
                    required
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    placeholder="Your Name or Recipient Name"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#101242] focus:bg-white focus:border-[#101242]/30 outline-none placeholder:font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Contact Number</label>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    value={newAddress.contact}
                    onChange={(e) => setNewAddress({ ...newAddress, contact: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="10-digit number"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#101242] focus:bg-white focus:border-[#101242]/30 outline-none placeholder:font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Address Details</label>
                <textarea
                  required
                  rows={2}
                  value={newAddress.full_address}
                  onChange={(e) => setNewAddress({ ...newAddress, full_address: e.target.value })}
                  placeholder="Flat No, Wing, Building Name, Area"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#101242] focus:bg-white focus:border-[#101242]/30 outline-none resize-none placeholder:font-medium"
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleLocateOnMap}
                  disabled={mapLoading}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 text-[#101242] rounded-xl font-bold hover:bg-slate-200 transition-all text-sm"
                >
                  {mapLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                  Locate on Map
                </button>

                <button
                  type="button"
                  onClick={toggleMap}
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
                >
                  <Map className="w-4 h-4" />
                  {showMap ? 'Hide Map' : 'Pick Your Current Location'}
                </button>

                {showMap && (
                  <div className="relative w-full h-[300px] rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                    <div ref={mapRef} className="w-full h-full" />
                    {mapLoading && (
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-[#101242] animate-spin" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">District</label>
                  <input
                    readOnly
                    value={newAddress.district}
                    placeholder="Auto-filled"
                    className="w-full p-4 bg-slate-100 border border-slate-100 rounded-2xl font-bold text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">State</label>
                  <input
                    readOnly
                    value={newAddress.state}
                    placeholder="Auto-filled"
                    className="w-full p-4 bg-slate-100 border border-slate-100 rounded-2xl font-bold text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>
                <div className="col-span-2 md:col-span-1 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Pincode</label>
                  <input
                    readOnly
                    value={newAddress.pincode}
                    placeholder="Auto-filled"
                    className="w-full p-4 bg-slate-100 border border-slate-100 rounded-2xl font-bold text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#101242] text-white rounded-[24px] font-bold shadow-xl shadow-[#101242]/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-70 mt-4"
              >
                {loading ? 'Saving Address...' : 'Save Address Details'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
