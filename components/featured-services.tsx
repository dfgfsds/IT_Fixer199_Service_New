'use client'

import { Star, Clock, CheckCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useLocation } from '@/context/location-context'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'
import Link from 'next/link'

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
        const url = `${Api.services}/?include_categories=true&include_media=true&include_pricing=true&lat=${location.lat}&lng=${location.lng}`
        const response = await axiosInstance.get(url)
        
        const servicesArray = response.data?.services || []
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
              category: s.categories?.[0]?.name || 'Service',
              rating: s.rating || 4.8,
              reviews: s.reviews_count || 1500,
              price: Number(sellingPrice),
              originalPrice: regularPrice ? Number(regularPrice) : undefined,
              discount: discount,
              time: s.eta || '1-2 hours',
              image: s.media_files?.[0]?.image_url || '/placeholder-service.jpg',
              verified: true,
            }
          })
        
        setServices(activeServices)
      } catch (error) {
        console.error("Error fetching featured services:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedServices()
  }, [location?.lat, location?.lng])

  if (!loading && services.length === 0) return null

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              Top Trending
              <span className="block text-primary">Services Today</span>
            </h2>
            <p className="text-lg text-muted-foreground">
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
                <div
                  key={service.id}
                  className="group bg-white rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col"
                >
                  {/* Image Section */}
                  <div className="relative h-32 sm:h-56 overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                    {/* Badge Overlays */}
                    {service.discount > 0 && (
                      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-primary text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-[8px] sm:text-sm font-bold shadow-lg">
                        Save {service.discount}%
                      </div>
                    )}

                    {service.verified && (
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm text-accent px-1.5 py-1 sm:px-3 sm:py-2 rounded-full flex items-center gap-1 shadow-lg">
                        <CheckCircle className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                        <span className="text-[8px] sm:text-xs font-semibold">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-3 sm:p-6 space-y-2 sm:space-y-4 flex flex-col flex-1">
                    <div>
                      <p className="text-[8px] sm:text-xs font-semibold text-accent uppercase tracking-wide mb-0.5 sm:mb-1">
                        {service.category}
                      </p>
                      <h3 className="text-sm sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {service.name}
                      </h3>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-0.5 rounded-md">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-xs">{service.rating}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {service.reviews.toLocaleString()} reviews
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        <Clock className="w-3 h-3 text-primary/50" />
                        <span>{service.time}</span>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 sm:pt-4 border-t border-border/50 mt-auto gap-2 sm:gap-0">
                      <div className="space-y-0.5 sm:space-y-1">
                        <p className="text-[8px] sm:text-xs text-muted-foreground whitespace-nowrap">Starting from</p>
                        <div className="flex items-baseline gap-1 sm:gap-2">
                          <span className="text-lg sm:text-2xl font-bold text-primary">₹{service.price}</span>
                          {service.originalPrice && (
                            <span className="text-[8px] sm:text-sm text-muted-foreground line-through">
                              ₹{service.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/services/${service.id}`}
                        className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-white px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl font-black transition-all hover:-translate-y-0.5 active:scale-95 text-[10px] sm:text-sm whitespace-nowrap shadow-lg hover:shadow-xl uppercase tracking-widest text-center"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
