'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '../../components/product-card'
import { type Product } from '@/lib/products'
import { Search, Sparkles, Loader2, MapPin, Navigation } from 'lucide-react'
import { ServiceCard } from '@/components/service-card'
import { useState, useEffect, useMemo } from 'react'
import { useLocation } from '@/context/location-context'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'
import { safeErrorLog } from '@/lib/error-handler'
import { extractErrorMessage } from '@/lib/error-utils'
import { toast } from 'sonner'

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { location, setShowLocationModal } = useLocation()

  useEffect(() => {
    const fetchServices = async () => {
      if (!location?.lat || !location?.lng) {
        return
      }
      setServices([])
      setLoading(true)
      setError(null)
      try {
        const url = `${Api.services}/?include_categories=true&include_media=true&include_pricing=true&status=ACTIVE&lat=${location.lat}&lng=${location.lng}`
        const response = await axiosInstance.get(url)
        console.log("API Response:", response.data)

        // The API returns either an array directly or an object with a 'services' key
        const servicesArray = Array.isArray(response.data) ? response.data : (response.data?.services || [])

        if (Array.isArray(servicesArray)) {
          const mappedServices = servicesArray
            .filter((s: any) => s.status === "ACTIVE")
            .map((s: any) => {
              const sellingPrice = s.pricing_models?.find((p: any) => p.pricing_type_name === "Selling Price")?.price || 0
              const regularPrice = s.pricing_models?.find((p: any) => p.pricing_type_name === "Regular Price")?.price

              return {
                id: s.id,
                name: s.name,
                category: Array.isArray(s.categories) && s.categories.length > 0 ? (s.categories[0]?.name || 'Service') : 'Service',
                price: Number(sellingPrice),
                originalPrice: regularPrice ? Number(regularPrice) : undefined,
                image: s.media_files?.[0]?.image_url || '/placeholder-image.jpg',
                inStock: s.status === "ACTIVE",
                rating: s.rating || 4.5,
                reviews: s.reviews_count || 100,
                badge: s.badge || 'Service'
              }
            })
          setServices(mappedServices)
        }
      } catch (err: any) {
        safeErrorLog("Error fetching services", err)
        const msg = extractErrorMessage(err)
        setError(msg)
        toast.error(msg)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [location?.lat, location?.lng])

  const categories = useMemo(() => {
    const apiCategories = Array.from(new Set(services.map(s => s.category)))
    return ['All', ...apiCategories]
  }, [services])

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="bg-white py-10 md:py-20 px-4 border-b border-slate-100">
          <div className="max-w-7xl mx-auto text-center space-y-8">
            <h1 className="text-3xl sm:text-5xl font-black text-[#101242] tracking-tight leading-tight">
              All Services
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              Find the right expert for your home needs in {location?.city || 'your area'}. Verified, reliable, and affordable.
            </p>

            {/* Search Bar */}
            {/* <div className="max-w-2xl mx-auto relative group pt-4">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#101242] w-6 h-6 transition-colors" />
              <input
                type="text"
                placeholder="Search for services (e.g., Cleaning, Plumbing)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-transparent rounded-[32px] focus:bg-white focus:border-[#101242]/20 focus:ring-4 focus:ring-[#101242]/5 transition-all outline-none font-bold text-lg text-[#101242] shadow-lg shadow-slate-100/50"
              />
            </div> */}
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-b md:pb-16 space-y-12">
          {!location?.lat || !location?.lng ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20 p-8 space-y-8 bg-white rounded-[40px] border border-dashed border-slate-200 shadow-sm">
              <div className="relative">
                <div className="w-24 h-24 bg-[#101242]/5 text-[#101242] rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-10 h-10" />
                </div>
                <div className="absolute inset-0 blur-xl bg-[#101242]/5 rounded-full"></div>
              </div>
              <div className="text-center space-y-3 max-w-sm mx-auto">
                <h3 className="text-2xl font-black text-[#101242] uppercase tracking-tight">Location Required</h3>
                <p className="text-slate-500 font-medium">To show you available services and accurate pricing, please select your city.</p>
              </div>
              <button
                onClick={() => setShowLocationModal(true)}
                className="px-10 py-4 bg-[#101242] text-white rounded-2xl font-black tracking-widest uppercase shadow-xl shadow-[#101242]/20 hover:bg-[#101242]/90 transition-all active:scale-95 flex items-center gap-3"
              >
                <Navigation className="w-5 h-5 text-white/50" />
                Select Your Location
              </button>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-40 p-8 space-y-6">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-[#101242] animate-spin" />
                <div className="absolute inset-0 blur-xl bg-[#101242]/10 rounded-full animate-pulse"></div>
              </div>
              <p className="text-slate-500 font-black uppercase tracking-[0.2em] animate-pulse ml-2 text-sm text-center">
                Finding best services near you...
              </p>
            </div>
          ) : (
            <>
              {/* Category Tabs */}
              {/* <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-8 py-3.5 rounded-2xl text-sm font-black tracking-widest uppercase transition-all whitespace-nowrap border-2 ${selectedCategory === cat
                      ? 'bg-[#101242] border-[#101242] text-white shadow-xl shadow-[#101242]/20 scale-105'
                      : 'bg-white border-white text-slate-500 hover:border-slate-100 hover:bg-slate-50'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div> */}

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Found {filteredServices.length} Results
                </h2>
              </div>

              {/* Services Grid */}
              {filteredServices.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
                  {filteredServices.map((service) => (
                    <div key={service.id}>
                      <ServiceCard service={service} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 space-y-8 bg-white rounded-[40px] border border-dashed border-slate-200 shadow-inner">
                  <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-[#101242]">
                      {error || "No services match your search"}
                    </h3>
                    <p className="text-slate-400 font-medium">
                      {error ? "Please try a different location" : "Try adjusting your filters or search keywords"}
                    </p>
                  </div>
                  {/*
                  <button
                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                    className="px-10 py-4 bg-[#101242] text-white rounded-2xl font-black tracking-widest uppercase shadow-xl hover:bg-[#101242]/90 transition-all active:scale-95"
                  >
                    Clear all filters
                  </button>
                  */}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
