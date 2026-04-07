'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Star, Check, ArrowRight, Share2, CheckCircle, Heart, Loader2, Minus, Plus, ShoppingCart, AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useMemo, use } from 'react'
import { useRouter } from 'next/navigation'
import { useLocation } from '@/context/location-context'
import { useCartItem } from '@/context/CartItemContext'
import axiosInstance from '@/configs/axios-middleware'
import Api from '@/api-endpoints/ApiUrls'
import { toast } from 'sonner'

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [service, setService] = useState<any>(null)
  const [relatedServices, setRelatedServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { location } = useLocation()
  const { cartItem, fetchCart } = useCartItem()
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)

  const attributeGroups = useMemo(() => {
    if (!service?.attributes || service.attributes.length === 0) return null
    const groups: Record<string, any[]> = {}
    service.attributes.forEach((attr: any) => {
      if (!groups[attr.attribute_name]) groups[attr.attribute_name] = []
      if (!groups[attr.attribute_name].find((v: any) => v.value_id === attr.value_id)) {
        groups[attr.attribute_name].push(attr)
      }
    })
    return groups
  }, [service])

  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!location?.lat || !location?.lng) {
        return
      }

      setLoading(true)
      setError(null)
      try {
        // 1. Fetch Single Service Detail
        const url = `${Api.services}/${id}/?include_categories=true&include_media=true&include_pricing=true&lat=${location.lat}&lng=${location.lng}`
        const response = await axiosInstance.get(url)
        const serviceData = response.data?.service || response.data
        setService(serviceData)

        // 2. Fetch Related Services in same category
        if (serviceData?.categories?.[0]?.id) {
          // Use the 'category' field for filtering if 'category_id' doesn't work directly with the junction object ID
          const categoryId = serviceData.categories[0].category || serviceData.categories[0].id
          const relatedUrl = `${Api.services}/?category_id=${categoryId}&lat=${location.lat}&lng=${location.lng}&size=3`
          const relatedRes = await axiosInstance.get(relatedUrl)
          const rs = Array.isArray(relatedRes.data) ? relatedRes.data : (relatedRes.data?.services || [])
          setRelatedServices(rs.filter((s: any) => s.id !== id))
        }
      } catch (err: any) {
        if (err.response?.status !== 400) {
          console.error("Error fetching service details:", err)
        }
        setError(err.response?.data?.message || 'Service details not available at your location.')
      } finally {
        setLoading(false)
      }
    }

    fetchServiceDetails()
  }, [location?.lat, location?.lng, id])

  // Clear service data only when switching to a different ID
  useEffect(() => {
    setService(null)
    setRelatedServices([])
  }, [id])

  const currentCartItem = useMemo(() => {
    return cartItem?.find((item: any) => String(item.service_id) === String(id) || String(item.service?.id) === String(id))
  }, [cartItem, id])
  const addToCartApi = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      toast.error('Please login to book this service')
      router.push('/login')
      return
    }

    if (attributeGroups) {
      const allSelected = Object.keys(attributeGroups).every(g => !!selectedAttributes[g])
      if (!allSelected) {
        toast.error('Please select all required options before booking.')
        return
      }
    }

    setIsAdding(true)
    try {
      const attributesToSend = attributeGroups
        ? Object.keys(attributeGroups).map(groupName => {
          const valueId = selectedAttributes[groupName]
          const attr = attributeGroups[groupName].find((v: any) => v.value_id === valueId)
          return { attribute_id: attr.attribute_id, value_id: attr.value_id }
        })
        : []

      const payload: any = {
        type: "SERVICE",
        service_id: id,
        quantity: 1,
      }
      if (attributesToSend.length > 0) payload.attributes = attributesToSend

      await axiosInstance.post(`${Api.cartApi}/add/`, payload)
      await fetchCart()
      toast.success("Service added to cart!")
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.error('Please login to book this service')
        router.push('/login')
      } else {
        console.error("Add to cart error:", error)
        toast.error("Failed to add to cart. Please try again.")
      }
    } finally {
      setIsAdding(false)
    }
  }

  const increaseQty = async () => {
    if (!currentCartItem) return
    try {
      const payload = {
        type: "SERVICE",
        service_id: id,
        quantity: currentCartItem.quantity + 1
      }
      await axiosInstance.patch(`${Api.cartApi}/item/${currentCartItem.id}/update/`, payload)
      await fetchCart()
    } catch (error) {
      console.error("Increase qty error:", error)
    }
  }

  const decreaseQty = async () => {
    if (!currentCartItem) return
    try {
      const payload = {
        type: "SERVICE",
        service_id: id,
        quantity: currentCartItem.quantity - 1
      }
      await axiosInstance.post(`${Api.cartApi}/item/${currentCartItem.id}/decrease/`, payload)
      await fetchCart()
    } catch (error) {
      console.error("Decrease qty error:", error)
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-40 p-8 space-y-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-[#800000] animate-spin" />
            <div className="absolute inset-0 blur-xl bg-[#800000]/10 rounded-full animate-pulse"></div>
          </div>
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] animate-pulse ml-2 text-sm">
            Loading service details...
          </p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-32 p-8 text-center space-y-8">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
            <Star className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-[#1a1c2e]">{error || "Service Not Found"}</h2>
          <p className="text-slate-500 max-w-sm font-medium">
            {error ? "Please try a different location" : "We couldn't find the service you're looking for. It might not be available in your area or coordinates are missing."}
          </p>
          <Link href="/services" className="px-10 py-4 bg-[#800000] text-white rounded-2xl font-black tracking-widest uppercase shadow-xl transition-all active:scale-95">
            View All Services
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const sellingPrice = service.pricing_models?.find((p: any) => p.pricing_type_name === "Selling Price")?.price || 0
  const regularPrice = service.pricing_models?.find((p: any) => p.pricing_type_name === "Regular Price")?.price
  const serviceImage = service.media_files?.[0]?.image_url || '/placeholder-service.jpg'
  const serviceCategory = service.categories?.[0]?.category_name || service.categories?.[0]?.name || 'Service'

  // Default includes if not provided by API
  const includes = service.whats_included?.length > 0 ? service.whats_included : [
    'Professional equipment usage',
    'Verified expert service',
    'Post-service cleanup',
    '90-day service guarantee',
    'Support via call/chat',
    'All taxes included'
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {error && service && (
        <div className="bg-amber-50 border-y border-amber-100 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-amber-800 text-sm font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Left: Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group border border-slate-100 bg-slate-50">
            <Image
              src={serviceImage}
              alt={service.name}
              width={800}
              height={600}
              className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-6 right-6 flex gap-3">
              <button className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all active:scale-90">
                <Heart className="w-5 h-5 text-slate-600" />
              </button>
              <button className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all active:scale-90">
                <Share2 className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-8 py-4">
            <div className="space-y-4">
              <span className="inline-flex px-4 py-1.5 rounded-full bg-[#800000]/5 text-[#800000] text-xs font-black uppercase tracking-widest border border-[#800000]/10">
                {serviceCategory}
              </span>
              <h1 className="text-5xl font-extrabold text-[#1a1c2e] tracking-tight">
                {service.name}
              </h1>
              <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
                {service.description || "Expert professional services for your home needs. Verified, reliable, and high-quality results guaranteed."}
              </p>
            </div>

            {/* Rating & Verified */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-[#ffbb00] text-[#ffbb00]" />
                <span className="text-xl font-bold text-[#1a1c2e]">{service.rating || 4.5}</span>
                <span className="text-slate-400 font-medium">({service.reviews_count || 120} reviews)</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700">Verified Professionals</span>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">Starting from</p>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-black text-[#1a1c2e]">₹{sellingPrice}</span>
                {regularPrice && (
                  <span className="text-lg font-bold text-slate-300 line-through decoration-[#800000]/30">₹{regularPrice}</span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">Inclusive of all taxes & service charges</p>
            </div>

            {/* What's Included */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#1a1c2e] uppercase tracking-widest">What's Included</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                {includes.map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100 transition-all group-hover:bg-emerald-500 group-hover:border-emerald-500">
                      <Check className="w-4 h-4 text-emerald-600 transition-colors group-hover:text-white stroke-[3px]" />
                    </div>
                    <span className="text-[15px] font-bold text-slate-600 leading-tight group-hover:text-[#1a1c2e] transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attribute Selection */}
            {attributeGroups && Object.keys(attributeGroups).length > 0 && (
              <div className="space-y-6 pt-4 border-t border-slate-100">
                {Object.keys(attributeGroups).map((groupName) => (
                  <div key={groupName} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase">{groupName}</h3>
                      {!selectedAttributes[groupName] && (
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">Required</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {attributeGroups[groupName].map((attr: any) => {
                        const isSelected = selectedAttributes[groupName] === attr.value_id
                        return (
                          <button
                            key={attr.value_id}
                            onClick={() => setSelectedAttributes(prev => ({ ...prev, [groupName]: attr.value_id }))}
                            className={`relative flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 transition-all duration-300 font-bold text-sm overflow-hidden ${isSelected
                                ? 'border-[#800000] bg-white text-[#1a1c2e] shadow-md scale-[1.02]'
                                : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100 hover:text-[#1a1c2e]'
                              }`}
                          >
                            {isSelected && <span className="absolute inset-0 bg-[#800000]/5" />}
                            {isSelected && <Check className="w-4 h-4 text-[#800000] relative z-10" />}
                            <span className="relative z-10">{attr.value}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4">
              {currentCartItem ? (
                <button
                  onClick={() => router.push('/cart')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-xl shadow-green-600/20 uppercase tracking-widest"
                >
                  <CheckCircle className="w-6 h-6" />
                  <span>Added — View Cart</span>
                </button>
              ) : (
                <button
                  onClick={addToCartApi}
                  disabled={loading || !!error || isAdding}
                  className="w-full bg-[#800000] hover:bg-[#600000] text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-2xl shadow-[#800000]/20 uppercase tracking-widest disabled:bg-slate-300 disabled:text-black disabled:shadow-none disabled:transform-none"
                >
                  {isAdding ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <ShoppingCart className="w-6 h-6" />
                  )}
                  <span>{error ? "Unavailable in this location" : isAdding ? "Adding..." : `Book Now — ₹${sellingPrice}`}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Related Services Section */}
        {relatedServices.length > 0 && (
          <div className="space-y-10 py-24 border-t border-slate-100">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-[#1a1c2e] tracking-tight">Related Services</h2>
                <p className="text-slate-500 font-medium">Popular services frequently booked by our customers in your area</p>
              </div>
              <Link
                href="/services"
                className="flex items-center gap-2 text-[#800000] font-bold hover:gap-3 transition-all group p-2"
              >
                <span className="uppercase tracking-widest text-sm">See All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
              {relatedServices.map((rs: any) => {
                const rsPrice = rs.pricing_models?.find((p: any) => p.pricing_type_name === "Selling Price")?.price || 0
                const rsImage = rs.media_files?.[0]?.image_url || '/placeholder-service.jpg'

                return (
                  <div
                    key={rs.id}
                    className="group bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:border-[#800000]/10 hover:shadow-2xl transition-all duration-500 flex flex-col"
                  >
                    <div className="relative h-64 overflow-hidden bg-slate-50">
                      <Image
                        src={rsImage}
                        alt={rs.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-5 right-5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1.5 shadow-lg border border-white/20">
                        <Star className="w-3.5 h-3.5 fill-[#ffbb00] text-[#ffbb00]" />
                        <span className="text-xs font-black text-[#1a1c2e]">{rs.rating || 4.5}</span>
                      </div>
                    </div>
                    <div className="p-8 space-y-6 flex flex-col flex-1">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-[#800000] uppercase tracking-widest bg-[#800000]/5 px-3 py-1 rounded-lg">
                          {rs.categories?.[0]?.category_name || rs.categories?.[0]?.name || 'Service'}
                        </span>
                        <h3 className="text-xl font-bold text-[#1a1c2e] line-clamp-1 group-hover:text-[#800000] transition-colors">
                          {rs.name}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                        <div>
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Starting at</p>
                          <p className="text-2xl font-black text-[#1a1c2e]">₹{rsPrice}</p>
                        </div>
                        <Link href={`/services/${rs.id}`} className="p-4 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-[#800000] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:scale-105">
                          <ArrowRight className="w-5 h-5 stroke-[2.5px]" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
