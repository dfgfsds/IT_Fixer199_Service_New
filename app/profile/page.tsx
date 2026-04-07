'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useState, useEffect, useRef, useCallback } from 'react'
import { User, MapPin, Package, Settings, LogOut, ChevronRight, Edit2, Plus, Clock, CheckCircle, Map, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/context/auth-context'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'
import { toast } from 'sonner'
import { useLocation } from '@/context/location-context'

const BOOKINGS = [
  {
    id: 'BK-001',
    service: 'AC Service & Repair',
    date: 'March 25, 2026',
    time: '10:00 AM',
    status: 'Scheduled',
    price: 599,
  },
  {
    id: 'BK-782',
    service: 'Home Deep Cleaning',
    date: 'March 20, 2026',
    status: 'Completed',
    price: 499,
  },
]


export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, refreshUserData } = useAuth()
  const { location, setLocation }: any = useLocation()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
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
          const location = results[0].geometry.location;
          const lat = location.lat().toString();
          const lng = location.lng().toString();
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
      const currentLat = parseFloat(newAddress.lat) || 13.0827;
      const currentLng = parseFloat(newAddress.lng) || 80.2707;

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

      // Ensure map resizes correctly
      setTimeout(() => {
        google.maps.event.trigger(googleMapRef.current, 'resize');
      }, 300);

    } catch (error) {
      console.error("Map initialization failed:", error);
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
      console.error(error);
    }
  };

  const handleLocateOnMap = async () => {
    // Combine all fields for a perfect map search
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

      setNewAddress(prev => ({ ...prev, lat: result.lat, lng: result.lng }));

      if (!showMap) setShowMap(true);
      setTimeout(() => {
        if (googleMapRef.current) {
          googleMapRef.current.setCenter({ lat: latNum, lng: lngNum });
          markerRef.current.setPosition({ lat: latNum, lng: lngNum });
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
              console.error("Reverse geocoding failed:", error);
            } finally {
              setMapLoading(false);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setMapLoading(false);
            toast.error("Could not access current location. Showing default.");
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
        // Simple cleanup
        googleMapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [showMap, initMap]);

  // Initialize edit states when entering edit mode
  const startEditing = () => {
    setEditName(user?.name || '')
    setEditEmail(user?.email || '')
    setEditPhone(user?.mobile_number || '')
    setIsEditing(true)
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const payload = {
        name: editName,
        email: editEmail,
        mobile_number: editPhone
      }

      await axiosInstance.put(`${Api.updateUser}${user.id}`, payload)
      toast.success('Profile updated successfully!')
      await refreshUserData()
      setIsEditing(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  // Background refresh on load
  useEffect(() => {
    if (user?.id) {
      refreshUserData()
    }
  }, [user?.id, refreshUserData])

  // Redirect to login if NO session found
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token && !user) {
      router.push('/login')
    }
  }, [user, router])

  // Fetch addresses when tab changes
  const fetchAddresses = async () => {
    setLoadingAddresses(true)
    try {
      const response = await axiosInstance.get(Api.myAddress)
      const rawData = response.data?.data || response.data
      const data = Array.isArray(rawData) ? rawData : []

      // Sort by latest update to ensure the most recent is at the top
      const sortedData = data.sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )

      setUserAddresses(sortedData)

      // 🔥 AUTO-SELECTION LOGIC:
      // If we have addresses but NONE are currently selected (e.g., after deleting the primary one),
      // we automatically promote the next most recent address to "Selected" status.
      if (sortedData.length > 0 && !sortedData.some((a: any) => a.selected_address)) {
        const topAddr = sortedData[0]
        try {
          await axiosInstance.put(`${Api.address}/${topAddr.id}`, {
            ...topAddr,
            selected_address: true,
            is_primary: true
          })
          // Re-fetch once to get the updated status from server
          const finalRes = await axiosInstance.get(Api.myAddress)
          const finalData = Array.isArray(finalRes.data?.data || finalRes.data) ? (finalRes.data?.data || finalRes.data) : []
          setUserAddresses(finalData.sort((a: any, b: any) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          ))

          // 🔥 SYNC GLOBAL NAV BAR (On Deletion Promotion)
          setLocation({
            lat: Number(topAddr.lat),
            lng: Number(topAddr.lng),
            city: topAddr.district || topAddr.city || "Unknown",
            address: topAddr.full_address || topAddr.address || "",
            pincode: topAddr.pincode,
            state: topAddr.state
          });
        } catch (err) {
          console.error("Auto-selection failed:", err)
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
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

      // If we just deleted our ONLY address, reload to clear all states (Navbar, Context, etc.)
      if (userAddresses.length <= 1) {
        window.location.reload()
        return
      }

      await fetchAddresses()
      setShowDeleteModal(false)
      setAddressToDelete(null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove address')
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
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

      // 🔥 AUTOMATIC HIGH-PRECISION GEOCODING ON SAVE:
      // We combine ALL fields to ensure we have valid and highly accurate coordinates.
      const searchString = [newAddress.full_address, newAddress.district, newAddress.state, newAddress.pincode].filter(Boolean).join(', ');

      if (searchString && (newAddress.full_address || newAddress.district)) {
        try {
          const result: any = await geocodeAddress(searchString);
          finalLat = result.lat.toString();
          finalLng = result.lng.toString();
        } catch (err) {
          // If geocoding fails, and we haven't manually pinned anything yet, we must stop.
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

      // 🔥 SYNC GLOBAL NAV BAR (On Create/Edit)
      // We pass the new address data to the global context so the navbar and modal update instantly
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save address')
    } finally {
      setLoading(false)
    }
  }


  // 🔥 DEEP LINKING EFFECT - Keep after openAddModal is defined
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab")
    const shouldOpenAdd = localStorage.getItem("openAddModal")

    if (savedTab) {
      setActiveTab(savedTab)
      setTimeout(() => localStorage.removeItem("activeTab"), 1000)
    }

    if (shouldOpenAdd === "true") {
      setActiveTab("addresses")
      setTimeout(() => {
        if (typeof openAddModal === 'function') openAddModal()
        localStorage.removeItem("openAddModal")
      }, 200)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses()
    }
  }, [activeTab, location])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 py-12 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 text-center space-y-4">
              <div className="relative w-24 h-24 mx-auto group">
                <Image
                  src="/placeholder-user.jpg"
                  alt="Profile"
                  fill
                  className="rounded-full object-cover border-4 border-slate-50"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=800000&color=fff`;
                  }}
                />
                <button className="absolute bottom-0 right-0 p-2 bg-[#800000] text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1a1c2e]">{user?.name || user?.email || user?.mobile_number}</h2>
                <p className="text-slate-700 font-bold text-xs tracking-widest mt-1">{user?.email}</p>
              </div>
            </div>

            <nav className="bg-white p-4 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 divide-y divide-slate-50">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-300 group ${activeTab === 'profile' ? 'bg-[#800000]/5 text-[#800000]' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-4">
                  <User className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="font-bold tracking-tight">Personal Details</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'profile' ? 'translate-x-1' : ''}`} />
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-300 group ${activeTab === 'addresses' ? 'bg-[#800000]/5 text-[#800000]' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="font-bold tracking-tight">Addresses</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'addresses' ? 'translate-x-1' : ''}`} />
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-300 group ${activeTab === 'bookings' ? 'bg-[#800000]/5 text-[#800000]' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-4">
                  <Package className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="font-bold tracking-tight">Booking History</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'bookings' ? 'translate-x-1' : ''}`} />
              </button>

              <button
                onClick={logout}
                className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-300 group text-[#800000] hover:bg-red-50`}
              >
                <div className="flex items-center gap-4">
                  <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="font-bold tracking-tight">Logout</span>
                </div>
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-8">
            {activeTab === 'profile' && (
              <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-[#1a1c2e]">Personal Information</h3>
                  {!isEditing && (
                    <button
                      onClick={startEditing}
                      className="flex items-center gap-2 text-[#800000] font-bold text-sm tracking-widest uppercase hover:underline"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-x-10 gap-y-8">
                  <div className="space-y-2 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="block w-full p-4 bg-slate-50 border border-[#800000]/10 rounded-2xl focus:bg-white focus:border-[#800000]/30 outline-none font-bold text-[#1a1c2e]"
                        placeholder="Full Name"
                      />
                    ) : (
                      <div className="p-4 bg-slate-50 text-[#1a1c2e] font-bold rounded-2xl border border-transparent">
                        {user?.name}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="block w-full p-4 bg-slate-50 border border-[#800000]/10 rounded-2xl focus:bg-white focus:border-[#800000]/30 outline-none font-bold text-[#1a1c2e]"
                        placeholder="Email Address"
                      />
                    ) : (
                      <div className="p-4 bg-slate-50 text-[#1a1c2e] font-bold rounded-2xl border border-transparent">
                        {user?.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Phone Number</p>
                    {isEditing ? (
                      <div className="space-y-1">
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          disabled={user?.mobile_number?.toString().length >= 10}
                          className="block w-full p-4 bg-slate-50 border border-[#800000]/10 rounded-2xl focus:bg-white focus:border-[#800000]/30 outline-none font-bold text-[#1a1c2e] disabled:opacity-60 disabled:cursor-not-allowed"
                          placeholder="Phone Number"
                        />
                        {user?.mobile_number?.toString().length >= 10 && (
                          <p className="text-[9px] text-[#800000] font-bold uppercase tracking-tighter ml-1">Verified phone number cannot be changed</p>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 text-[#1a1c2e] font-bold rounded-2xl border border-transparent">
                        {user?.mobile_number}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="flex-1 py-4 bg-[#800000] text-white rounded-2xl font-bold shadow-lg shadow-[#800000]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm disabled:opacity-75"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                        className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all text-sm disabled:opacity-75"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-[#1a1c2e]">Addresses</h3>
                  <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-6 py-3 bg-[#800000] text-white rounded-2xl font-bold shadow-lg shadow-[#800000]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
                  >
                    <Plus className="w-5 h-5" />
                    Add New
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {loadingAddresses ? (
                    <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">
                      Loading addresses...
                    </div>
                  ) : userAddresses.length === 0 ? (
                    <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] text-center space-y-3">
                      <p className="text-slate-500 font-bold">No saved addresses found</p>
                      <p className="text-slate-400 text-sm">Add an address to start booking services</p>
                    </div>
                  ) : (
                    userAddresses.map((addr) => (
                      <div key={addr.id} className={`p-6 bg-white rounded-[32px] border ${addr.selected_address ? 'border-[#800000]/50 shadow-lg shadow-[#800000]/5' : 'border-slate-100'} space-y-3 relative group transition-all hover:shadow-xl`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <MapPin className={`w-5 h-5 ${addr.selected_address ? 'text-[#800000]' : 'text-slate-400'}`} />
                            <span className="font-bold text-[#1a1c2e]">{addr.name || 'Saved Address'}</span>
                          </div>
                          {addr.selected_address && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#800000] bg-[#800000]/5 px-2 py-1 rounded-md">Selected</span>
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
                            className="text-xs font-bold text-[#800000] tracking-widest uppercase hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(addr.id)}
                            className="text-xs font-bold text-slate-400 tracking-widest uppercase hover:text-red-500 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-black text-[#1a1c2e]">Recent Bookings</h3>
                <div className="space-y-5 text-left">
                  {BOOKINGS.map((booking) => (
                    <div key={booking.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-xl hover:border-[#800000]/20">
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${booking.status === 'Completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-[#800000]/5 text-[#800000]'}`}>
                          {booking.status === 'Completed' ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">{booking.id}</p>
                          <h4 className="font-bold text-[#1a1c2e] text-lg">{booking.service}</h4>
                          <p className="text-slate-500 text-sm font-medium">{booking.date} {booking.time && `at ${booking.time}`}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-10">
                        <div className="text-right">
                          <p className="text-2xl font-black text-[#800000]">₹{booking.price}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${booking.status === 'Completed' ? 'text-emerald-500' : 'text-blue-500'}`}>{booking.status}</p>
                        </div>
                        <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-[#800000] hover:text-white transition-all">
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white max-w-sm w-full rounded-[40px] p-8 shadow-2xl shadow-slate-900/20 border border-slate-100 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
              <LogOut className="w-8 h-8 text-red-500 rotate-180" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-[#1a1c2e]">Remove Address?</h3>
              <p className="text-slate-500 font-medium text-sm">Are you sure you want to remove this saved address from your profile?</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteAddress}
                disabled={loading}
                className="w-full py-4 bg-[#800000] text-white rounded-2xl font-bold hover:bg-[#600000] transition-all disabled:opacity-70"
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
          <div className="bg-white max-w-2xl w-full rounded-[20px] p-6 lg:p-8 shadow-2xl shadow-slate-900/20 border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-[#1a1c2e]">
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
                <Plus className="w-6 h-6 text-slate-400 rotate-45" />
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
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#1a1c2e] focus:bg-white focus:border-[#800000]/30 outline-none placeholder:font-medium"
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
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#1a1c2e] focus:bg-white focus:border-[#800000]/30 outline-none placeholder:font-medium"
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
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#1a1c2e] focus:bg-white focus:border-[#800000]/30 outline-none resize-none placeholder:font-medium"
                />
              </div>

              {/* <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Latitude</label>
                  <input readOnly value={newAddress.lat} className="w-full p-3 bg-slate-100 border border-transparent rounded-xl font-bold text-slate-500 cursor-not-allowed outline-none text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Longitude</label>
                  <input readOnly value={newAddress.lng} className="w-full p-3 bg-slate-100 border border-transparent rounded-xl font-bold text-slate-500 cursor-not-allowed outline-none text-sm" />
                </div>
              </div> */}

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleLocateOnMap}
                  disabled={mapLoading}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 text-[#1a1c2e] rounded-xl font-bold hover:bg-slate-200 transition-all text-sm"
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
                  {showMap ? 'Hide Map' : 'Pick Location from Map'}
                </button>

                {showMap && (
                  <div className="relative w-full h-[300px] rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                    <div ref={mapRef} className="w-full h-full" />
                    {mapLoading && (
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-[#800000] animate-spin" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">District</label>
                  <input
                    required
                    value={newAddress.district}
                    onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                    placeholder="City/District"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#1a1c2e] focus:bg-white focus:border-[#800000]/30 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">State</label>
                  <input
                    required
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    placeholder="State"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#1a1c2e] focus:bg-white focus:border-[#800000]/30 outline-none"
                  />
                </div>
                <div className="col-span-2 md:col-span-1 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Pincode</label>
                  <input
                    required
                    maxLength={6}
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    placeholder="6 digits"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#1a1c2e] focus:bg-white focus:border-[#800000]/30 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#800000] text-white rounded-[24px] font-bold shadow-xl shadow-[#800000]/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-70 mt-4"
              >
                {loading ? 'Saving Address...' : 'Save Address Details'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
