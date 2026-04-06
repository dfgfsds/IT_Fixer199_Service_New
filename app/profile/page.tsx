'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { User, MapPin, Package, Settings, LogOut, ChevronRight, Edit2, Plus, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/context/auth-context'

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

const ADDRESSES = [
  {
    id: 1,
    type: 'Home',
    address: 'Flat 4B, Sunrise Apartments, Andheri West, Mumbai',
    isDefault: true,
  },
  {
    id: 2,
    type: 'Office',
    address: '301, Green Park Colony, Koramangala, Bengaluru',
    isDefault: false,
  },
]

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

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
                <h2 className="text-xl font-bold text-[#1a1c2e]">{user?.name || 'User'}</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Premium Member</p>
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
                  <span className="font-bold tracking-tight">Saved Addresses</span>
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
                  <button className="flex items-center gap-2 text-[#800000] font-bold text-sm tracking-widest uppercase hover:underline">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</p>
                    <div className="p-4 bg-slate-50 text-[#1a1c2e] font-bold rounded-2xl border border-transparent">{user?.name || 'N/A'}</div>
                  </div>
                  <div className="space-y-2 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</p>
                    <div className="p-4 bg-slate-50 text-[#1a1c2e] font-bold rounded-2xl border border-transparent">{user?.email || 'N/A'}</div>
                  </div>
                  <div className="space-y-2 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Phone Number</p>
                    <div className="p-4 bg-slate-50 text-[#1a1c2e] font-bold rounded-2xl border border-transparent">{user?.mobile_number || 'N/A'}</div>
                  </div>
                  <div className="space-y-2 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Language</p>
                    <div className="p-4 bg-slate-50 text-[#1a1c2e] font-bold rounded-2xl border border-transparent">English / Hindi</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-[#1a1c2e]">Saved Addresses</h3>
                  <button className="flex items-center gap-2 px-6 py-3 bg-[#800000] text-white rounded-2xl font-bold shadow-lg shadow-[#800000]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm">
                    <Plus className="w-5 h-5" />
                    Add New
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {ADDRESSES.map((addr) => (
                    <div key={addr.id} className={`p-6 bg-white rounded-[32px] border ${addr.isDefault ? 'border-[#800000]/50 shadow-lg shadow-[#800000]/5' : 'border-slate-100'} space-y-3 relative group transition-all hover:shadow-xl`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MapPin className={`w-5 h-5 ${addr.isDefault ? 'text-[#800000]' : 'text-slate-400'}`} />
                          <span className="font-bold text-[#1a1c2e]">{addr.type}</span>
                        </div>
                        {addr.isDefault && <span className="text-[10px] font-bold uppercase tracking-widest text-[#800000] bg-[#800000]/5 px-2 py-1 rounded-md">Default</span>}
                      </div>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">{addr.address}</p>
                      <div className="flex gap-4 pt-2">
                        <button className="text-xs font-bold text-[#800000] tracking-widest uppercase hover:underline">Edit</button>
                        <button className="text-xs font-bold text-slate-400 tracking-widest uppercase hover:text-red-500">Remove</button>
                      </div>
                    </div>
                  ))}
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
    </div>
  )
}
