'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Trash2, Plus, Minus, MapPin, Zap, Calendar, CreditCard, Wallet, Smartphone, CheckCircle, Clock, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

const INITIAL_CART = [
  {
    id: 1,
    name: 'Home Deep Cleaning',
    category: 'Service',
    price: 999,
    quantity: 4,
    image: '/service-cleaning.jpg',
  },
  {
    id: 2,
    name: 'AC Service & Repair',
    category: 'Service',
    price: 599,
    quantity: 1,
    image: '/ac-service.png',
  },
  {
    id: 3,
    name: 'Premium Microfiber Cloth Set (8 pcs)',
    category: 'Product',
    price: 199,
    quantity: 1,
    image: '/microfiber-cloths.png',
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(INITIAL_CART)
  const [selectedAddress, setSelectedAddress] = useState(1)
  const [selectedSlot, setSelectedSlot] = useState('instant')
  const [selectedPayment, setSelectedPayment] = useState('upi')

  const updateQuantity = (id: number, change: number) => {
    setCartItems(
      cartItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const serviceCharge = 49
  const gst = Math.round(subtotal * 0.05)
  const total = subtotal + serviceCharge + gst

  const addresses = [
    { id: 1, text: 'Flat 4B, Sunrise Apartments, Andheri West, Mumbai' },
    { id: 2, text: '301, Green Park Colony, Koramangala, Bengaluru' },
  ]

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-6 bg-white p-12 rounded-3xl shadow-xl max-w-lg w-full">
            <div className="flex items-center  justify-center">
              <ShoppingCart className="w-24 h-24 text-[#800000] animate-bounce" />
            </div>
            <h2 className="text-3xl font-black text-[#1a1c2e]">Your cart is empty</h2>
            <p className="text-slate-500 text-lg">
              Start adding services to get professional help at your doorstep
            </p>
            <a
              href="/"
              className="inline-block bg-[#800000] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-[#600000] transition-all transform active:scale-95 shadow-lg shadow-red-900/20"
            >
              Browse Services
            </a>
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
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-[#1a1c2e] truncate">{item.name}</h3>
                      <p className="text-sm text-slate-400 font-medium mb-2">{item.category}</p>
                      <p className="text-xl font-black text-[#1a1c2e]">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm hover:text-[#800000] transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-black text-[#1a1c2e] w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm hover:text-[#800000] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Address Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 ml-1">
                <MapPin className="w-5 h-5" />
                Service Address
              </h2>
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${selectedAddress === addr.id
                      ? 'border-[#800000] bg-red-50/30'
                      : 'border-white bg-white shadow-sm hover:border-slate-100'
                      }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddress === addr.id ? 'border-[#800000]' : 'border-slate-300'
                      }`}>
                      {selectedAddress === addr.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#800000]" />
                      )}
                    </div>
                    <span className={`text-[15px] font-medium ${selectedAddress === addr.id ? 'text-[#1a1c2e]' : 'text-slate-600'
                      }`}>
                      {addr.text}
                    </span>
                  </button>
                ))}
                <button className="flex items-center gap-2 text-emerald-600 font-bold ml-2 text-sm hover:underline">
                  <Zap className="w-4 h-4" />
                  Use Current Location
                </button>
              </div>
            </div>

            {/* Service Slot Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 ml-1">
                <Calendar className="w-5 h-5" />
                Service Slot
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedSlot('instant')}
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
            </div>

            {/* Payment Method Section */}
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
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm font-medium">
                      <span className="text-slate-500">
                        {item.name} ×{item.quantity}
                      </span>
                      <span className="text-[#1a1c2e]">₹{item.price * item.quantity}</span>
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
                      <p className="font-bold text-[#1a1c2e]">Delivering to</p>
                      <p className="text-slate-500 line-clamp-1">
                        {addresses.find(a => a.id === selectedAddress)?.text}
                      </p>
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
                  <button className="w-full bg-[#800000] hover:bg-[#600000] text-white py-5 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-xl shadow-red-900/20">
                    <CheckCircle className="w-5 h-5" />
                    Confirm Booking
                  </button>
                  <p className="text-[10px] text-center text-slate-400 font-medium px-4 leading-normal">
                    You'll be asked to login before confirming
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
