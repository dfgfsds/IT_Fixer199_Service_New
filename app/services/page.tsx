'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '../../components/product-card'
import { type Product } from '@/lib/products'
import { Search, Sparkles, Loader2 } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { useLocation } from '@/context/location-context'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [services, setServices] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { location } = useLocation()

  useEffect(() => {
    const fetchServices = async () => {
      if (!location?.lat || !location?.lng) {
        return
      }
      setServices([])
      setLoading(true)
      try {
        const url = `${Api.services}/?include_categories=true&include_media=true&include_pricing=true&lat=${location.lat}&lng=${location.lng}`
        const response = await axiosInstance.get(url)
        console.log("API Response:", response.data)

        const servicesArray = response.data?.services || []

        if (Array.isArray(servicesArray)) {
          const mappedServices: Product[] = servicesArray
            .filter((s: any) => s.status === "ACTIVE")
            .map((s: any) => {
              const sellingPrice = s.pricing_models?.find((p: any) => p.pricing_type_name === "Selling Price")?.price || 0
              const regularPrice = s.pricing_models?.find((p: any) => p.pricing_type_name === "Regular Price")?.price

              return {
                id: s.id,
                name: s.name,
                category: s.categories?.[0]?.name || 'Service',
                price: Number(sellingPrice),
                originalPrice: regularPrice ? Number(regularPrice) : undefined,
                image: s.media_files?.[0]?.image_url || '/placeholder-service.jpg',
                inStock: s.status === "ACTIVE",
                rating: s.rating || 4.5,
                reviews: s.reviews_count || 100,
                badge: s.badge || 'Service'
              }
            })
          setServices(mappedServices)
        }
      } catch (error) {
        console.error("Error fetching services:", error)
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="bg-white py-20 px-4 border-b border-slate-100">
          <div className="max-w-7xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#800000]/5 text-[#800000] text-xs font-black uppercase tracking-widest shadow-sm">
              <Sparkles className="w-4 h-4" />
              Professional Experts in {location?.city || 'your city'}
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-[#1a1c2e] tracking-tight leading-tight">
              All Professional <span className="text-[#800000]">Services</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              Find the right expert for your home needs in {location?.city || 'your area'}. Verified, reliable, and affordable.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative group pt-4">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#800000] w-6 h-6 transition-colors" />
              <input
                type="text"
                placeholder="Search for services (e.g., Cleaning, Plumbing)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-transparent rounded-[32px] focus:bg-white focus:border-[#800000]/20 focus:ring-4 focus:ring-[#800000]/5 transition-all outline-none font-bold text-lg text-[#1a1c2e] shadow-lg shadow-slate-100/50"
              />
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-12 h-12 text-[#800000] animate-spin" />
              <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse ml-2">Finding best services near you...</p>
            </div>
          ) : (
            <>
              {/* Category Tabs */}
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-8 py-3.5 rounded-2xl text-sm font-black tracking-widest uppercase transition-all whitespace-nowrap border-2 ${selectedCategory === cat
                      ? 'bg-[#800000] border-[#800000] text-white shadow-xl shadow-[#800000]/20 scale-105'
                      : 'bg-white border-white text-slate-500 hover:border-slate-100 hover:bg-slate-50'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

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
                      <ProductCard product={service} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 space-y-8 bg-white rounded-[40px] border border-dashed border-slate-200 shadow-inner">
                  <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-[#1a1c2e]">No services match your search</h3>
                    <p className="text-slate-400 font-medium">Try adjusting your filters or search keywords</p>
                  </div>
                  <button
                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                    className="px-10 py-4 bg-[#1a1c2e] text-white rounded-2xl font-black tracking-widest uppercase shadow-xl hover:bg-[#1a1c2e]/90 transition-all active:scale-95"
                  >
                    Clear all filters
                  </button>
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
