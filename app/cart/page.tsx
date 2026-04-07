'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import {
  Trash2, Plus, Minus, MapPin, Zap, Calendar, CreditCard, Wallet,
  Smartphone, CheckCircle, Clock, ShoppingCart, Loader2, AlertTriangle
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axiosInstance from '@/configs/axios-middleware'
import Api from '@/api-endpoints/ApiUrls'
import { useCartItem } from '@/context/CartItemContext'
import { useLocation } from '@/context/location-context'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { cartItem, fetchCart, isLoading } = useCartItem()
  const { location } = useLocation()
  const router = useRouter()

  const [selectedSlot, setSelectedSlot] = useState('instant')
  const [scheduledDate, setScheduledDate] = useState('')
  const [selectedPayment, setSelectedPayment] = useState('cash')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axiosInstance.get(Api.myAddress)
        // Adjust parsing based on DRF response shape
        const addrList = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.results || [])
        setAddresses(addrList)
        if (addrList.length > 0) {
          const defaultAddr = addrList.find((a: any) => a.is_default) || addrList[0]
          setSelectedAddressId(defaultAddr.id)
        }
      } catch (err) {
        console.error("Error fetching addresses:", err)
      }
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) fetchAddresses()
  }, [])

  const updateQuantity = async (item: any, newQty: number) => {
    const currentQty = item.quantity || 1
    if (newQty < 1) {
      await removeItem(item)
      return
    }
    setUpdatingId(item.id)
    try {
      if (newQty > currentQty) {
        // INCREASE — use the /add/ endpoint (same as service detail page)
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
        // DECREASE — use the /decrease/ endpoint (same as service detail page)
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
      console.error('Update quantity error:', error?.response?.data, error)
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

    if (!selectedAddressId && addresses.length > 0) {
      toast.error('Please select a service address')
      return
    } else if (addresses.length === 0) {
      toast.error('Please add an address in your profile first')
      router.push('/profile')
      return
    }

    if (selectedSlot === 'later' && !scheduledDate) {
      toast.error('Please select a date and time for scheduled service')
      return
    }

    setIsCheckoutLoading(true)
    try {
      const payload = {
        address_id: selectedAddressId,
        payment_method: selectedPayment.toUpperCase(),
        service_slot: selectedSlot.toUpperCase(),
        ...(selectedSlot === 'later' ? { scheduled_date: scheduledDate } : {})
      }
      await axiosInstance.post(Api.orderCheckout, payload)
      
      // Clear cart locally or fetch to verify it's empty
      await fetchCart()
      toast.success('Booking Confirmed Successfully! 🎉')
      router.push('/profile/orders') // Adjust if order page is different
    } catch (err: any) {
      console.error("Checkout validation failed:", err?.response?.data, err)
      toast.error(err?.response?.data?.message || err?.response?.data?.error || 'Checkout failed. Please try again.')
    } finally {
      setIsCheckoutLoading(false)
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

                  return (
                    <div
                      key={item.id}
                      className={`bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all duration-300 ${isRemoving ? 'opacity-50' : ''}`}
                    >
                      {/* Image */}
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 bg-slate-50">
                        <Image
                          src={getItemImage(item)}
                          alt={getItemName(item)}
                          fill
                          className={`transition-transform duration-500 group-hover:scale-110 ${getItemImage(item) === '/logo.png' ? 'object-contain p-2' : 'object-cover'}`}
                          onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png' }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-[#1a1c2e] truncate">{getItemName(item)}</h3>
                        <p className="text-sm text-slate-400 font-medium mb-1 capitalize">{getItemCategory(item).toLowerCase()}</p>
                        <p className="text-xl font-black text-[#1a1c2e] mt-1">₹{itemPrice}</p>
                      </div>

                      {/* Quantity Controls */}
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

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item)}
                        disabled={isRemoving}
                        className="p-3 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        {isRemoving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                      </button>
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
                <Link href="/profile" className="text-sm font-bold text-[#800000] hover:underline">
                  + Add New
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.length > 0 ? addresses.map((addr) => (
                  <label 
                    key={addr.id} 
                    className={`cursor-pointer bg-white p-5 rounded-3xl border-2 transition-all flex items-start gap-4 ${
                      selectedAddressId === addr.id 
                        ? 'border-[#800000] shadow-md bg-red-50/10' 
                        : 'border-slate-100 hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="address" 
                      className="mt-1 w-4 h-4 text-[#800000] focus:ring-[#800000] border-gray-300" 
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-[#1a1c2e] flex items-center gap-2">
                        {addr.address_type === 'home' ? 'Home' : addr.address_type === 'work' ? 'Work' : 'Other'}
                        {addr.is_default && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider">Default</span>}
                      </p>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {addr.door_no}, {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                  </label>
                )) : (
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
                    <Link href="/profile" className="px-4 py-2 bg-[#800000] text-white text-sm font-bold rounded-xl whitespace-nowrap hidden sm:block">
                      Add Address
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Service Slot */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 ml-1">
                <Calendar className="w-5 h-5" />
                Service Slot
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setSelectedSlot('instant'); setScheduledDate(''); }}
                  className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-bold ${selectedSlot === 'instant'
                    ? 'border-[#800000] bg-red-50/30 text-[#800000]'
                    : 'border-white bg-white shadow-sm text-slate-500 hover:border-slate-100'
                    }`}
                >
                  <Zap className="w-5 h-5" />
                  Instant Service
                </button>
                <button
                  onClick={() => setSelectedSlot('later')}
                  className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-bold ${selectedSlot === 'later'
                    ? 'border-[#800000] bg-red-50/30 text-[#800000]'
                    : 'border-white bg-white shadow-sm text-slate-500 hover:border-slate-100'
                    }`}
                >
                  <Calendar className="w-5 h-5" />
                  Schedule for Later
                </button>
              </div>

              {selectedSlot === 'later' && (
                <div className="mt-4 bg-white p-5 rounded-2xl border-2 border-[#800000]/20 flex flex-col gap-2 animate-in slide-in-from-top-2">
                  <label className="text-sm font-bold text-[#1a1c2e]">Select Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#1a1c2e] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-colors"
                  />
                  <p className="text-xs text-slate-400 mt-1">Please select an available slot</p>
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
                  { id: 'cash', name: 'Cash on Service', icon: Smartphone },
                  { id: 'upi', name: 'UPI', icon: Smartphone },
                  { id: 'card', name: 'Card', icon: CreditCard },
                  { id: 'wallet', name: 'Wallet', icon: Wallet },
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
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[40px] border border-slate-100 p-8 space-y-8 sticky top-24 shadow-2xl shadow-slate-200/50">
              <h2 className="text-2xl font-black text-[#1a1c2e]">Order Summary</h2>

              <div className="space-y-6">
                <div className="space-y-3">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm font-medium">
                      <span className="text-slate-500 truncate max-w-[150px]">
                        {getItemName(item)} ×{item.quantity || 1}
                      </span>
                      <span className="text-[#1a1c2e]">₹{getItemPrice(item) * (item.quantity || 1)}</span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-slate-100 w-full" />

                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Service Charge</span>
                    <span>₹{serviceCharge}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>GST (5%)</span>
                    <span>₹{gst}</span>
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                <div className="flex justify-between items-baseline">
                  <span className="text-xl font-black text-[#1a1c2e]">Total</span>
                  <span className="text-3xl font-black text-[#800000]">₹{total}</span>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-50 p-4 rounded-2xl flex gap-3 text-xs">
                    <MapPin className="w-4 h-4 text-[#800000] flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="font-bold text-[#1a1c2e]">Service Location</p>
                      <p className="text-slate-500">{location?.city || 'Not selected'}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl flex gap-3 text-xs">
                    <Clock className="w-4 h-4 text-[#800000] flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="font-bold text-[#1a1c2e]">Slot</p>
                      <p className="text-slate-500 capitalize">{selectedSlot} Service</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckoutLoading}
                    className="w-full bg-[#800000] hover:bg-[#600000] text-white py-5 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-xl shadow-red-900/20 disabled:opacity-50 disabled:active:scale-100"
                  >
                    {isCheckoutLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    {isCheckoutLoading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 font-medium px-4 leading-normal">
                    Inclusive of all taxes and service charges
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
