'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ServiceCard } from '@/components/service-card'
import { ProductCard } from '@/components/product-card'
import { Search, Loader2 } from 'lucide-react'
import { Suspense, useState, useEffect } from 'react'
import { useLocation } from '@/context/location-context'
import { useSearchParams } from 'next/navigation'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'
import { safeErrorLog } from '@/lib/error-handler'

function SearchContent() {
  const searchParams = useSearchParams()
  const currentQuery = searchParams.get('q') || ''

  const [services, setServices] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { location } = useLocation()

  useEffect(() => {
    const fetchResults = async () => {
      if (!location?.lat || !location?.lng) {
        return
      }
      setLoading(true)
      setError(null)

      try {
        const queryLower = currentQuery.toLowerCase()

        // Fetch services
        const servicesPromise = axiosInstance.get(Api.services, {
          params: {
            include_categories: true,
            include_media: true,
            include_pricing: true,
            status: 'ACTIVE',
            lat: location.lat,
            lng: location.lng,
            size: 10000
          }
        }).catch(e => ({ data: [] }))

        // Fetch products
        const productsPromise = axiosInstance.get(Api.products, {
          params: {
            include_pricing: true,
            include_media: true,
            include_category: true,
            status: 'ACTIVE',
            lat: location.lat,
            lng: location.lng,
            size: 10000,
            include_attribute: true
          }
        }).catch(e => ({ data: [] }))

        const [servicesRes, productsRes] = await Promise.all([servicesPromise, productsPromise])

        // Process Services
        const rawServices = servicesRes.data?.data || servicesRes.data?.services || servicesRes.data
        const servicesArray = Array.isArray(rawServices) ? rawServices : []

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

        // Process Products
        const rawProducts = productsRes.data?.data || productsRes.data?.products || productsRes.data
        const productsArray = Array.isArray(rawProducts) ? rawProducts : []

        const mappedProducts = productsArray.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.categories?.[0]?.name || p.category_name || p.category?.name || 'Uncategorized',
          price: Number(p.pricing?.[0]?.price || 0),
          originalPrice: p.pricing?.[0]?.regular_price ? Number(p.pricing?.[0]?.regular_price) : undefined,
          image: p.media?.[0]?.url || p.media_files?.[0]?.image_url || '/placeholder-image.jpg',
          inStock: p.status === 'ACTIVE',
          rating: p.rating || 4.5,
          reviews: p.reviews_count || 50,
          badge: p.badge || 'New'
        }))

        // Filter based on query client side
        const searchedServices = mappedServices.filter((s: any) =>
          s.name.toLowerCase().includes(queryLower) || s.category.toLowerCase().includes(queryLower)
        )
        const searchedProducts = mappedProducts.filter((p: any) =>
          p.name.toLowerCase().includes(queryLower) || p.category.toLowerCase().includes(queryLower)
        )

        setServices(searchedServices)
        setProducts(searchedProducts)

      } catch (err: any) {
        safeErrorLog("Search error", err)
        setError('An error occurred during search.')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [location?.lat, location?.lng, currentQuery])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 pb-24">
        {/* Search Header */}
        <section className="bg-white py-12 px-4 border-b border-slate-100">
          <div className="max-w-7xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black text-[#101242] tracking-tight">
              Search Results for <span className="text-[#101242]">"{currentQuery}"</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Found {services.length} services and {products.length} products
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 p-8 space-y-6">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-[#101242] animate-spin" />
                <div className="absolute inset-0 blur-xl bg-[#101242]/10 rounded-full animate-pulse"></div>
              </div>
              <p className="text-slate-500 font-black uppercase tracking-[0.2em] animate-pulse text-sm">
                Searching...
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="text-center text-red-500 py-8 font-semibold">{error}</div>
              )}

              {/* Services Section */}
              {services.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#101242]">Services</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
                    {services.map((service) => (
                      <div key={service.id}>
                        <ServiceCard service={service} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Section */}
              {products.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-[#101242]">Products</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {products.map((product) => (
                      <div key={product.id}>
                        <ProductCard product={product} basePath="products" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && services.length === 0 && products.length === 0 && (
                <div className="text-center py-20 space-y-6 bg-white rounded-3xl border border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-[#101242]">
                    No matches found
                  </h3>
                  <p className="text-slate-400 font-medium">
                    Try different keywords to find what you need.
                  </p>
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

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center py-20 p-8 space-y-6">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-[#101242] animate-spin" />
              <div className="absolute inset-0 blur-xl bg-[#101242]/10 rounded-full animate-pulse"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
