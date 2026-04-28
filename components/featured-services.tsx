'use client'

import { Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLocation } from '@/context/location-context'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'
import { ServiceCard } from '@/components/service-card'
import { safeErrorLog } from '@/lib/error-handler'
import { extractErrorMessage } from '@/lib/error-utils'
import { toast } from 'sonner'

export function FeaturedServices() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { location } = useLocation()

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      // coordinates are required for pricing calculation
      if (!location?.lat || !location?.lng) {
        setLoading(false)
        return
      }

      setServices([])
      setLoading(true)
      try {
        const url = `${Api.services}/?include_categories=true&include_media=true&include_pricing=true&status=ACTIVE&lat=${location.lat}&lng=${location.lng}`
        const response = await axiosInstance.get(url)

        // The API returns either an array directly or an object with a 'services' key
        const servicesArray = Array.isArray(response.data) ? response.data : (response.data?.services || [])

        const activeServices = servicesArray
          .filter((s: any) => s.status === "ACTIVE")
          .slice(0, 6)
          .map((s: any) => {
            const sellingPrice = s.pricing_models?.find((p: any) => p.pricing_type_name === "Selling Price")?.price || 0
            const regularPrice = s.pricing_models?.find((p: any) => p.pricing_type_name === "Regular Price")?.price

            // Calculate discount percentage if both prices exist
            let discount = 0
            if (regularPrice && Number(regularPrice) > Number(sellingPrice)) {
              discount = Math.round(((Number(regularPrice) - Number(sellingPrice)) / Number(regularPrice)) * 100)
            }

            return {
              id: s.id,
              name: s.name,
              category: Array.isArray(s.categories) && s.categories.length > 0 ? (s.categories[0]?.name || 'Service') : 'Service',
              rating: s.rating || 4.8,
              reviews: s.reviews_count || 1500,
              price: Number(sellingPrice),
              originalPrice: regularPrice ? Number(regularPrice) : undefined,
              discount: discount,
              time: s.eta || '1-2 hours',
              image: s.media_files?.[0]?.image_url || '/placeholder-image.jpg',
              verified: true,
            }
          })

        setServices(activeServices)
      } catch (err: any) {
        safeErrorLog("Error fetching featured services", err)
        toast.error(extractErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedServices()
  }, [location?.lat, location?.lng])

  if (!loading && services.length === 0) return null

  return (
    <section className="py-10 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 ">
        <div className="space-y-12">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-[#101242] text-foreground leading-tight">
              Premium Services

            </h2>
            <p className="text-lg text-gary-700 text-muted-foreground">
              Browse our most popular and highly-rated services in {location?.city || 'your area'} with instant booking
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-muted-foreground font-bold uppercase tracking-widest animate-pulse">Finding best services near you...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
