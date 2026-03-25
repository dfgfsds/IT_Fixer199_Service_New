'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, Clock, Shield, CheckCircle } from 'lucide-react'

export type Service = {
  id: number
  name: string
  category: string
  rating: number
  reviews: number
  price: number
  discount: number
  time: string
  image: string
  description: string
  expert: string
  verified: boolean
}

type Props = {
  service: Service
}

export function ServiceCard({ service }: Props) {
  const originalPrice = service.discount > 0 
    ? Math.round(service.price / (1 - service.discount / 100))
    : null

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-[#800000]/20 transition-all duration-500 flex flex-col shadow-sm">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden bg-slate-50">
        {/* Placeholder if image is emoji based on services data, or actual image */}
        {service.image.length <= 4 ? (
          <div className="w-full h-full flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-700 bg-gradient-to-br from-slate-50 to-slate-100">
            {service.image}
          </div>
        ) : (
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c2e]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge Overlays */}
        {service.discount > 0 && (
          <div className="absolute top-5 left-5 bg-[#800000] text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
            Save {service.discount}%
          </div>
        )}

        <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm text-[#1a1c2e] px-3 py-2 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20">
          <CheckCircle className="w-4 h-4 text-[#800000]" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Verified</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 space-y-5 flex flex-col flex-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#800000] uppercase tracking-widest bg-[#800000]/5 px-3 py-1 rounded-lg">
              {service.category}
            </span>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{service.time}</span>
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#1a1c2e] group-hover:text-[#800000] transition-colors leading-tight">
            {service.name}
          </h3>
          <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-2">
            Professional service by <span className="text-[#1a1c2e] font-bold">{service.expert}</span>. Reliable and high-quality results guaranteed.
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-yellow-400 text-white px-3 py-1 rounded-lg shadow-sm shadow-yellow-400/20">
            <Star className="w-4 h-4 fill-white text-white" />
            <span className="font-black text-sm">{service.rating}</span>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {service.reviews.toLocaleString()} Reviews
          </span>
        </div>

        {/* Price and CTA */}
        <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Starting from</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#1a1c2e]">₹{service.price}</span>
              {originalPrice && (
                <span className="text-sm font-bold text-slate-300 line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>
          </div>
          <Link 
            href={`/service/${service.id}`}
            className="bg-[#800000] hover:bg-[#600000] text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all duration-300 shadow-xl shadow-[#800000]/20 hover:shadow-[#800000]/30 hover:-translate-y-0.5"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}
