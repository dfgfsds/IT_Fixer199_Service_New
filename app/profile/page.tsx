'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useState, useEffect } from 'react'
import { User, MapPin, Package, LogOut, ChevronRight, ClipboardList } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/context/auth-context'
import OrdersTab from '@/components/profile/OrdersTab'
import ProfileTab from '@/components/profile/ProfileTab'
import AddressesTab from '@/components/profile/AddressesTab'
import RequestTab from '@/components/profile/RequestTab'
import { toast } from 'sonner'
import { useRef } from 'react'

import { Suspense } from 'react'

function ProfileContent() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const searchParams = useSearchParams()

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    window.history.replaceState(null, '', `?tab=${tab}`)
  }

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab")

    if (savedTab) {
      setActiveTab(savedTab)
      setTimeout(() => localStorage.removeItem("activeTab"), 1000)
    }

    // if URL has action=add and tab=addresses, switch tab immediately
    const tabParam = searchParams.get('tab')
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // Redirect to login if NO session found
  const hasToasted = useRef(false)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token && !user) {
      if (!hasToasted.current) {
        toast.error('Please login to access your profile')
        hasToasted.current = true
      }
      router.push('/login')
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 py-12 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 text-center space-y-4">
              <div className="relative w-24 h-24 mx-auto group">
                <Image
                  src="/placeholder-user.jpg"
                  alt="Profile"
                  fill
                  className="rounded-full object-cover border-1 border-[#101242]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=800000&color=fff`;
                  }}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#101242]">{user?.name || user?.email || user?.mobile_number}</h2>
                <p className="text-slate-700 font-bold text-xs tracking-widest mt-1">{user?.email}</p>
              </div>
            </div>

            <nav className="bg-white p-4 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 divide-y divide-slate-50">
              <button
                onClick={() => handleTabChange('profile')}
                className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-300 group ${activeTab === 'profile' ? 'bg-[#101242]/5 text-[#101242]' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-4">
                  <User className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="font-bold tracking-tight">Personal Details</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'profile' ? 'translate-x-1' : ''}`} />
              </button>

              <button
                onClick={() => handleTabChange('addresses')}
                className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-300 group ${activeTab === 'addresses' ? 'bg-[#101242]/5 text-[#101242]' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="font-bold tracking-tight">Addresses</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'addresses' ? 'translate-x-1' : ''}`} />
              </button>

              <button
                onClick={() => handleTabChange('orders')}
                className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-300 group ${activeTab === 'orders' ? 'bg-[#101242]/5 text-[#101242]' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-4">
                  <Package className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="font-bold tracking-tight">Order History</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'orders' ? 'translate-x-1' : ''}`} />
              </button>

              <button
                onClick={() => handleTabChange('requests')}
                className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-300 group ${activeTab === 'requests' ? 'bg-[#101242]/5 text-[#101242]' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-4">
                  <ClipboardList className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="font-bold tracking-tight">My Requests</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'requests' ? 'translate-x-1' : ''}`} />
              </button>

              <button
                onClick={logout}
                className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-300 group text-[#101242] hover:bg-red-50`}
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
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'addresses' && <AddressesTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'requests' && <RequestTab />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center py-20 p-8 space-y-6">
            <div className="max-w-md w-full h-[500px] bg-white rounded-[40px] animate-pulse flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-sm">
              Loading Profile...
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  )
}
