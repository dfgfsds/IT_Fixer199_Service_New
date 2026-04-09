'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Trash2, Plus, Minus, MapPin, Zap, Calendar, CreditCard, Wallet, Smartphone, CheckCircle, Clock, ShoppingCart, Loader2, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axiosInstance from '@/configs/axios-middleware'
import Api from '@/api-endpoints/ApiUrls'
import { useCartItem } from '@/context/CartItemContext'
import { useLocation } from '@/context/location-context'
import { formatPrice } from '@/lib/format-price'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'

export default function CartPage() {
  const { cartItem, rawCartData, fetchCart, isLoading } = useCartItem()
  const { location, setLocation, zoneData } = useLocation()
  const { user } = useAuth()
  const router = useRouter()

  const [scheduleType, setScheduleType] = useState<"instant" | "later">("instant")
  const [selectedTime, setSelectedTime] = useState<string | number>("")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [selectedPayment, setSelectedPayment] = useState('upi')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  // Generate next 7 days
  {/*
  const DATES = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      value: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-IN", { weekday: "short" }),
      day: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    }
  })
  */}

  const DATES = [
    {
      value: new Date().toISOString().split("T")[0],
      label: "TODAY",
      day: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    }
  ]

  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [appData, setAppData] = useState<any>('')
  const [successModal, setSuccessModal] = useState(false)

  // Slots & Instant from Zone
  const slots = zoneData?.slots || []
  const instant = zoneData?.instant_availability

  // Sync with Cart Status
  useEffect(() => {
    if (!rawCartData) return
    const cart = rawCartData?.data || rawCartData
    if (cart.is_instant_slot) {
      setScheduleType("instant")
      setSelectedTime("")
    } else if (cart.slot_id) {
      setScheduleType("later")
      setSelectedTime(cart.slot_id)
      if (cart.scheduled_date) setSelectedDate(cart.scheduled_date)
    }
  }, [rawCartData])

  const handleSlotSelect = async (slot: any) => {
    setSelectedTime(slot.id)
    setScheduleType("later")
    toast.success(`Slot selected: ${slot.name}`)

    try {
      await axiosInstance.patch(`${Api.cartApi}/update/`, {
        slot_id: slot.id,
        zone_id: zoneData?.id,
        is_instant_slot: false,
        scheduled_date: selectedDate
      })
    } catch (err) {
      console.error("Failed to sync slot to cart:", err)
    }
  }

  const handleInstantSelect = async () => {
    setScheduleType("instant")
    setSelectedTime("instant")
    toast.success("Instant arrival selected")

    try {
      await axiosInstance.patch(`${Api.cartApi}/update/`, {
        slot_id: instant?.id,
        zone_id: zoneData?.id,
        is_instant_slot: true,
        scheduled_date: new Date().toISOString().split('T')[0]
      })
    } catch (err) {
      console.error("Failed to sync instant slot to cart:", err)
    }
  }

  // Fetch saved addresses and app settings
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axiosInstance.get(Api.myAddress)
        // Adjust parsing based on DRF response shape
        const rawData = res.data?.data || res.data
        const addrList = Array.isArray(rawData) ? rawData : []

        // Sort: selected_address true comes first
        const sorted = [...addrList].sort((a: any, b: any) => {
          if (a.selected_address && !b.selected_address) return -1
          if (!a.selected_address && b.selected_address) return 1
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        })

        setAddresses(sorted)
        if (sorted.length > 0) {
          const selected = sorted.find((a: any) => a.selected_address) || sorted[0]
          setSelectedAddressId(selected.id)
        }
      } catch (err) {
        console.error("Error fetching addresses:", err instanceof Error ? err.message : String(err))
      }
    }

    const FetchAppSetting = async () => {
      try {
        const updatedApi = await axiosInstance.get(Api?.appSettings)
        if (updatedApi) {
          setAppData(updatedApi?.data?.data);
        }
      } catch (error) { }
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      fetchAddresses()
    }
    FetchAppSetting()
  }, [])

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const updateQuantity = async (item: any, newQty: number) => {
    const currentQty = item.quantity || 1
    if (newQty < 1) {
      await removeItem(item)
      return
    }
    setUpdatingId(item.id)
    try {
      if (newQty > currentQty) {
        // INCREASE
        const itemType = item.type || item.item_type || (item.product ? 'PRODUCT' : 'SERVICE')
        const payload: any = {
          type: itemType,
          quantity: 1,
        }
        if (itemType === 'SERVICE' || itemType === 'service') {
          payload.service_id = item.service?.id || item.service_id
        } else {
          payload.product_id = item.product?.id || item.product_id
        }
        await axiosInstance.post(`${Api.cartApi}/add/`, payload)
      } else {
        // DECREASE
        const itemType = item.type || item.item_type || (item.product ? 'PRODUCT' : 'SERVICE')
        const payload: any = {
          type: itemType,
          quantity: currentQty - 1,
        }
        if (itemType === 'SERVICE' || itemType === 'service') {
          payload.service_id = item.service?.id || item.service_id
        } else {
          payload.product_id = item.product?.id || item.product_id
        }
        await axiosInstance.post(`${Api.cartApi}/item/${item.id}/decrease/`, payload)
      }
      await fetchCart()
    } catch (error: any) {
      console.error('Update quantity error:', error?.response?.data, error instanceof Error ? error.message : String(error))
      toast.error('Failed to update quantity')
    } finally {
      setUpdatingId(null)
    }
  }

  const removeItem = async (item: any) => {
    setRemovingId(item.id)
    const itemType = item.type || item.item_type || (item.product ? 'PRODUCT' : 'SERVICE')
    const serviceId = item.service?.id || item.service_id
    const productId = item.product?.id || item.product_id

    const attempts = [
      // 1. Decrease to 0
      () => axiosInstance.post(`${Api.cartApi}/item/${item.id}/decrease/`, {
        type: itemType, quantity: 0,
        ...(serviceId ? { service_id: serviceId } : {}),
        ...(productId ? { product_id: productId } : {}),
      }),
      // 2. PATCH update quantity to 0
      () => axiosInstance.patch(`${Api.cartApi}/item/${item.id}/update/`, {
        type: itemType, quantity: 0,
        ...(serviceId ? { service_id: serviceId } : {}),
        ...(productId ? { product_id: productId } : {}),
      }),
      // 3. DELETE /item/{id}/
      () => axiosInstance.delete(`${Api.cartApi}/item/${item.id}/`),
      // 4. DELETE /items/{id}/
      () => axiosInstance.delete(`${Api.cartApi}/items/${item.id}/`),
      // 5. POST /remove/ with item_id in body
      () => axiosInstance.post(`${Api.cartApi}/remove/`, { item_id: item.id }),
      // 6. DELETE /{cart_item_id}/ directly
      () => axiosInstance.delete(`${Api.cartApi}/${item.id}/`),
    ]

    for (let i = 0; i < attempts.length; i++) {
      try {
        const res = await attempts[i]()
        console.log(`Remove attempt ${i + 1} succeeded:`, res?.data)
        await fetchCart()
        toast.success('Item removed from cart')
        setRemovingId(null)
        return
      } catch (err: any) {
        console.error(`Remove attempt ${i + 1} failed:`, err?.response?.status, err?.response?.data)
      }
    }

    toast.error('Failed to remove item — check console for details')
    setRemovingId(null)
  }

  const getItemName = (item: any) => item.service?.name || item.product?.name || item.service_name || item.product_name || item.name || 'Item'
  const getItemImage = (item: any) => item.service?.image || item.product?.image || item.service?.media?.[0]?.url || item.product?.media?.[0]?.url || item.service_image || item.product_image || item.image || '/logo.png'
  const getItemPrice = (item: any) => item.selling_price || item.price || item.unit_price || item.service?.selling_price || item.product?.selling_price || 0
  const getItemCategory = (item: any) => item.item_type || item.type || 'Service'

  const cartItems: any[] = Array.isArray(cartItem) ? cartItem : []
  const subtotal = cartItems.reduce((sum, item) => sum + (getItemPrice(item) * (item.quantity || 1)), 0)
  const serviceCharge = 49
  const gst = Math.round(subtotal * 0.05)
  const total = subtotal + serviceCharge + gst

  const handleCheckout = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      toast.error('Please login to proceed')
      router.push('/login')
      return
    }

    setIsCheckoutLoading(true)
    try {
      if (!selectedAddressId) {
        toast.error("Please select a delivery address")
        setIsCheckoutLoading(false)
        return
      }

      if (!scheduleType || !selectedTime) {
        toast.error("Please select a service time")
        setIsCheckoutLoading(false)
        return
      }

      if (scheduleType === 'instant' && !instant?.available) {
        toast.error("Instant service is currently unavailable")
        setIsCheckoutLoading(false)
        return
      }

      if (cartItems.length === 0) {
        toast.error("Your cart is empty")
        setIsCheckoutLoading(false)
        return
      }

      const razorpayLoaded = await loadRazorpay()

      if (!razorpayLoaded) {
        toast.error("Payment gateway blocked. Try Chrome / disable adblock.")
        setIsCheckoutLoading(false)
        return
      }

      const addr = addresses.find((a) => a.id === selectedAddressId)

      const payload: any = {
        address_id: selectedAddressId,
        payment_method: selectedPayment.toUpperCase(),
        service_slot: scheduleType.toUpperCase(),
        // Backend required fields from Swagger
        customer_name: user?.name || "",
        customer_number: user?.mobile_number || "",
        customer_email: user?.email || "",
        address: addr?.full_address || addr?.address || "",
        google_address: addr?.google_address || addr?.full_address || "",
        latitude: addr?.lat ? Number(addr.lat) : 0,
        longitude: addr?.lng ? Number(addr.lng) : 0,
      }

      // Scheduling data
      if (scheduleType === 'later') {
        const slot = slots.find((s: any) => s.id === selectedTime)
        payload.slot_id = selectedTime
        payload.scheduled_date = selectedDate
        if (slot) {
          payload.slot_time = `${slot.start_time} - ${slot.end_time}`
          payload.slot_name = slot.name
        }
      } else if (scheduleType === 'instant' && instant?.id) {
        payload.slot_id = instant.id
        payload.scheduled_date = new Date().toISOString().split('T')[0]
        payload.slot_time = `${instant.eta_start_time} - ${instant.eta_end_time}`
        payload.slot_name = "Instant"
      }
      const res = await axiosInstance.post(Api.orderCheckout, payload)
      if (!res?.data) throw new Error("Payment init failed")

      const checkoutData = res.data?.checkout || res.data;

      // Make sure the cart gets empty locally
      const completeCheckout = () => {
        setSuccessModal(true)
        setIsCheckoutLoading(false)
        fetchCart()
        setTimeout(() => {
          router.push('/profile?tab=orders')
        }, 2000)
      }

      if (selectedPayment.toLowerCase() === 'cash' || !checkoutData?.razorpay_order_id) {
        completeCheckout()
        return
      }

      // RAZORPAY SCRIPT GUARD
      if (!(window as any).Razorpay) {
        toast.error("Payment system failed to load. Please check your internet connection.")
        setIsCheckoutLoading(false)
        return
      }

      const { razorpay_order_id, amount, order_id } = checkoutData

      const options = {
        key: appData?.pg_api_key,
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "ITFixer@199",
        description: "Order Payment",
        order_id: razorpay_order_id,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.mobile_number || ""
        },

        handler: function (response: any) {
          completeCheckout()
        },

        modal: {
          ondismiss: function () {
            setIsCheckoutLoading(false)
            toast.error("Payment cancelled.")
          },
        },

        theme: {
          color: "#800000",
        },
      }

      const razorpay = new (window as any).Razorpay(options)

      razorpay.on("payment.failed", function (response: any) {
        toast.error(response?.error?.description || "Payment failed")
        setIsCheckoutLoading(false)
      })

      razorpay.open()

    } catch (err: any) {
      console.warn("Checkout validation failed:", err?.response?.data, err instanceof Error ? err.message : String(err))
      toast.error(err?.response?.data?.message || err?.response?.data?.error || 'Checkout failed. Please try again.')
      setIsCheckoutLoading(false)
    }
  }

  // Handle address select with server sync
  const handleAddressSelectSync = async (addr: any) => {
    setSelectedAddressId(addr.id)
    try {
      await axiosInstance.patch(`${Api.addressFlags}/${addr.id}`, {
        ...addr,
        selected_address: true,
        is_primary: true
      })

      // Sync global navbar immediately
      setLocation({
        city: addr.district || addr.city || "Unknown",
        address: addr.full_address || addr.address || "",
        lat: Number(addr.lat),
        lng: Number(addr.lng),
        pincode: addr.pincode,
        state: addr.state
      })

      // Re-fetch and re-sort local list to move the new selection to the top
      const res = await axiosInstance.get(Api.myAddress)
      const rawData = res.data?.data || res.data
      const addrList = Array.isArray(rawData) ? rawData : []
      const sorted = [...addrList].sort((a: any, b: any) => {
        if (a.selected_address && !b.selected_address) return -1
        if (!a.selected_address && b.selected_address) return 1
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      })
      setAddresses(sorted)

    } catch (err) {
      console.error("Failed to sync selection to backend:", err instanceof Error ? err.message : String(err))
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-[#800000] animate-spin mx-auto" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Empty cart
  if (!isLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-6 bg-white p-12 rounded-3xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-center">
              <ShoppingCart className="w-24 h-24 text-[#800000] animate-bounce" />
            </div>
            <h2 className="text-3xl font-black text-[#1a1c2e]">Your cart is empty</h2>
            <p className="text-slate-500 text-lg">
              Start adding services or products to get professional help at your doorstep
            </p>
            <Link
              href="/services"
              className="inline-block bg-[#800000] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-[#600000] transition-all transform active:scale-95 shadow-lg shadow-red-900/20"
            >
              Browse Services
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-black text-[#1a1c2e] mb-10">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Items Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-500 uppercase tracking-wider ml-1">
                Items ({cartItems.length})
              </h2>
              <div className="space-y-4">
                {cartItems.map((item: any) => {
                  const isUpdating = updatingId === item.id
                  const isRemoving = removingId === item.id
                  const itemPrice = getItemPrice(item)
                  const itemQty = item.quantity || 1
                  const isInactive = item.is_active === false

                  return (
                    <div
                      key={item.id}
                      className={`relative bg-white p-5 rounded-3xl border transition-all duration-300 flex items-center gap-6 group ${isInactive
                        ? 'border-red-100 bg-slate-50 opacity-80 desaturate-[0.5]'
                        : 'border-slate-100 shadow-sm hover:shadow-md'
                        } ${isRemoving ? 'opacity-50' : ''}`}
                    >
                      {/* Image */}
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 bg-slate-100">
                        <Image
                          src={getItemImage(item)}
                          alt={getItemName(item)}
                          fill
                          className={`transition-transform duration-500 group-hover:scale-110 ${isInactive ? '' : 'group-hover:scale-110'
                            } ${getItemImage(item) === '/logo.png' ? 'object-contain p-2' : 'object-cover'}`}
                          onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png' }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-[#1a1c2e] truncate">{getItemName(item)}</h3>
                        <p className="text-sm text-slate-400 font-medium mb-1 capitalize">{getItemCategory(item).toLowerCase()}</p>
                        <p className={`text-xl font-black mt-1 ${isInactive ? 'text-slate-400' : 'text-[#1a1c2e]'}`}>₹{formatPrice(itemPrice)}</p>
                      </div>

                      {/* Right Side Actions */}
                      <div className="flex items-center gap-2">
                        {isInactive ? (
                          <div className="px-4 py-2 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-red-100 flex items-center gap-2 whitespace-nowrap animate-in fade-in zoom-in duration-300">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Unavailable at this Address
                          </div>
                        ) : (
                          /* Quantity Controls */
                          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                            <button
                              onClick={() => updateQuantity(item, itemQty - 1)}
                              disabled={isUpdating || isRemoving}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm hover:text-[#800000] transition-colors disabled:opacity-50"
                            >
                              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Minus className="w-4 h-4" />}
                            </button>
                            <span className="text-lg font-black text-[#1a1c2e] w-6 text-center">
                              {itemQty}
                            </span>
                            <button
                              onClick={() => updateQuantity(item, itemQty + 1)}
                              disabled={isUpdating || isRemoving}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm hover:text-[#800000] transition-colors disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item)}
                          disabled={isRemoving}
                          className="p-3 text-slate-600 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                          {isRemoving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Service Address */}
            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                <h2 className="text-lg font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Service Location
                </h2>
                <button
                  onClick={() => {
                    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                    if (!token) {
                      toast.error("Please login to add a new address");
                      setTimeout(() => {
                        router.push('/login');
                      }, 1200);
                    } else {
                      router.push('/profile?tab=addresses&action=add');
                    }
                  }}
                  className="px-6 py-2.5 bg-[#800000] text-white text-sm font-black rounded-2xl shadow-lg shadow-red-900/20 hover:bg-[#600000] transition-all active:scale-95 whitespace-nowrap"
                >
                  Add New
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.length > 0 ? (
                  <>
                    {addresses.slice(0, 4).map((addr) => (
                      <label
                        key={addr.id}
                        className={`cursor-pointer bg-white p-5 rounded-3xl border-2 transition-all flex items-start gap-4 ${selectedAddressId === addr.id
                          ? 'border-[#800000] shadow-md bg-red-50/10'
                          : 'border-slate-100 hover:border-slate-200 shadow-sm'
                          }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          className="mt-1 w-4 h-4 text-[#800000] focus:ring-[#800000] border-gray-300"
                          checked={selectedAddressId === addr.id}
                          onChange={() => handleAddressSelectSync(addr)}
                        />
                        <div className="flex-1">
                          <p className="font-bold text-[#1a1c2e] flex items-center gap-2">
                            {addr.name || (addr.address_type === 'home' ? 'Home' : addr.address_type === 'work' ? 'Work' : 'Saved Address')}
                            {addr.selected_address && <span className="text-[10px] bg-red-100 text-[#800000] px-2 py-0.5 rounded-full uppercase tracking-wider font-black">Active</span>}
                          </p>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                            {addr.full_address || [addr.door_no, addr.street, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </label>
                    ))}
                    {addresses.length > 4 && (
                      <Link
                        href="/profile?tab=addresses"
                        className="sm:col-span-2 w-full flex items-center justify-center rounded-2xl py-3 text-sm font-bold text-[#800000] bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        {/* See all {addresses.length} addresses */}
                        See all addresses
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="sm:col-span-2 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-[#1a1c2e] font-bold">No saved addresses</p>
                        <p className="text-sm text-slate-500">Please add an address to continue checkout</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Service Slot */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 ml-1">
                <Calendar className="w-5 h-5" />
                Schedule
              </h2>

              {/* Toggle */}
              <div className="flex rounded-2xl border border-slate-100 bg-white p-1.5 shadow-sm">
                <button
                  onClick={() => setScheduleType("instant")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${scheduleType === "instant"
                    ? "bg-[#800000] text-white shadow-lg shadow-red-900/20"
                    : "text-slate-500 hover:bg-slate-50"
                    }`}
                >
                  <Zap className={`w-4 h-4 ${scheduleType === "instant" ? "animate-pulse" : ""}`} />
                  Instant Service
                </button>

                <button
                  onClick={() => setScheduleType("later")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${scheduleType === "later"
                    ? "bg-[#800000] text-white shadow-lg shadow-red-900/20"
                    : "text-slate-500 hover:bg-slate-50"
                    }`}
                >
                  <Calendar className="w-4 h-4" />
                  Schedule for Later
                </button>
              </div>

              {/* Instant View */}
              {(scheduleType === "instant" || !scheduleType) && (
                <div className="animate-in slide-in-from-top-2">
                  {!zoneData ? (
                    /* SKELETON LOADING STATE */
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                          <div className="h-3 bg-slate-100 rounded-full w-3/4" />
                        </div>
                      </div>
                    </div>
                  ) : instant?.available ? (
                    <button
                      onClick={handleInstantSelect}
                      className={`w-full bg-white p-5 rounded-3xl border-2 transition-all shadow-sm relative overflow-hidden group ${selectedTime === "instant"
                        ? 'border-[#800000] bg-red-50/30'
                        : 'border-slate-100 hover:border-slate-200'
                        }`}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${selectedTime === "instant" ? 'bg-[#800000] text-white' : 'bg-green-50 text-green-600'}`}>
                          <Clock className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className={`font-bold transition-colors ${selectedTime === "instant" ? 'text-[#800000]' : 'text-[#1a1c2e]'}`}>Technician Available Now</p>
                          <p className="text-sm text-slate-500">Estimated Arrival: <span className="text-green-600 font-bold">{instant?.eta_start_time} - {instant?.eta_end_time}</span></p>
                        </div>
                      </div>

                      {selectedTime === "instant" && (
                        <div className="absolute right-5 top-1/2 -translate-y-1/2">
                          <CheckCircle className="w-6 h-6 text-[#800000]" />
                        </div>
                      )}
                    </button>
                  ) : (
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-4 text-amber-600 bg-amber-50/50 p-4 rounded-2xl">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-bold leading-tight">Instant service currently unavailable for this location. Please schedule for later.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Slots & Date Selection View */}
              {scheduleType === "later" && (
                <div className="space-y-6 animate-in slide-in-from-top-2">
                  {/* Date Picker */}
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                    {DATES.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => { setSelectedDate(d.value); setSelectedTime(""); }}
                        className={`flex flex-col items-center min-w-[70px] p-3 rounded-2xl border-2 transition-all ${selectedDate === d.value
                          ? "border-[#800000] bg-red-50/20 shadow-sm"
                          : "border-slate-50 bg-white hover:border-slate-200"
                          }`}
                      >
                        <span className={`text-[10px] font-black uppercase tracking-widest ${selectedDate === d.value ? "text-[#800000]" : "text-slate-400"}`}>
                          {d.label}
                        </span>
                        <span className={`text-sm font-black mt-1 ${selectedDate === d.value ? "text-[#800000]" : "text-[#1a1c2e]"}`}>
                          {d.day}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Time Slots */}
                  <div className="grid grid-cols-2 gap-3">
                    {slots.length > 0 ? slots.map((slot: any) => (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotSelect(slot)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${selectedTime === slot.id
                          ? 'border-[#800000] bg-red-50/30'
                          : 'border-white bg-white shadow-sm hover:border-slate-100'
                          }`}
                      >
                        <div className="relative z-10">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">{slot.name}</p>
                          <p className={`font-bold ${selectedTime === slot.id ? 'text-[#800000]' : 'text-[#1a1c2e]'}`}>
                            {slot.start_time} - {slot.end_time}
                          </p>
                        </div>
                        {selectedTime === slot.id && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <CheckCircle className="w-5 h-5 text-[#800000]" />
                          </div>
                        )}
                      </button>
                    )) : (
                      <div className="col-span-2 flex flex-col items-center justify-center p-8 bg-amber-50/50 rounded-3xl border border-amber-100/50 text-center text-amber-600 gap-3">
                        <AlertTriangle className="w-8 h-8 opacity-80" />
                        <p className="text-sm font-bold leading-relaxed">
                          No available slots remaining for today.<br />
                          <span className="text-amber-600/70 font-medium">Please check back tomorrow for new timings.</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-4 pb-12">
              <h2 className="text-lg font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 ml-1">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'upi', name: 'UPI / Online', icon: Smartphone },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setSelectedPayment(pm.id)}
                    className={`p-5 rounded-2xl border-2 transition-all flex items-center gap-4 font-bold ${selectedPayment === pm.id
                      ? 'border-[#800000] bg-red-50/30 text-[#800000]'
                      : 'border-white bg-white shadow-sm text-slate-500 hover:border-slate-100'
                      }`}
                  >
                    <pm.icon className="w-5 h-5" />
                    {pm.name}
                  </button>
                ))}
              </div>
            </div>
          </div>          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            {(() => {
              const hasInactiveItems = cartItems.some(item => item.is_active === false)

              return (
                <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 sticky top-12 space-y-8">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#1a1c2e]">₹{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Service Charge</span>
                      <span className="font-bold text-emerald-600">₹{formatPrice(serviceCharge)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>GST (5%)</span>
                      <span className="font-bold text-[#1a1c2e]">₹{formatPrice(gst)}</span>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <div className="flex justify-between items-end mb-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest pb-1">Total Amount</p>
                        <p className="text-3xl font-black text-[#1a1c2e]">₹{formatPrice(total)}</p>
                      </div>

                      {hasInactiveItems && (
                        <div className="p-4 mt-4 bg-red-50 rounded-2xl border border-red-100 flex gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                          <AlertTriangle className="w-5 h-5 shrink-0" />
                          <p className="text-[11px] font-bold leading-tight">
                            Some items are not available at this address. Please remove them or change address to proceed.
                          </p>
                        </div>
                      )}

                      <button
                        onClick={handleCheckout}
                        disabled={isCheckoutLoading || hasInactiveItems || !selectedAddressId || !selectedTime}
                        className={`w-full mt-5 py-4 rounded-2xl font-black text-lg transition-all transform active:scale-95 shadow-none flex items-center justify-center gap-3 ${hasInactiveItems
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                          : 'bg-[#800000] text-white hover:bg-[#600000] shadow-none'
                          }`}
                      >
                        {isCheckoutLoading ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <>
                            {hasInactiveItems ? 'Unavailable Items' : 'Place Order'}
                            <Zap className="w-5 h-5 fill-current" />
                          </>
                        )}
                      </button>

                      <p className="text-center mt-4 text-xs text-slate-400 font-medium">
                        By placing this order, you agree to ITFixer's Terms & Conditions
                      </p>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </main>

      <Footer />
      {successModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-8 text-center shadow-xl animate-in zoom-in-95">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-[#1a1c2e]">Payment Successful!</h2>
            <p className="text-sm text-slate-500">
              Your order has been placed successfully
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Redirecting to order page
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
