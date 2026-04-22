'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Plus, Minus, Loader2 } from 'lucide-react'
import { formatPrice } from '@/lib/format-price'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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
  basePath?: string
}

export function ServiceCard({ service, basePath = 'services' }: Props) {
  const router = useRouter()
  const originalPrice = service.discount > 0
    ? Math.round(service.price / (1 - service.discount / 100))
    : 0

  return (
    <Link href={`/${basePath}/${service.id}`} className="group bg-white rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl hover:border-[#101242]/30 transition-all shadow-[0px_8px_16px_rgba(27,30,36,0.1)] duration-300 block">
      {/* Image Section */}
      <div className="relative h-32 sm:h-56 overflow-hidden bg-white">
        {service.image.length <= 4 ? (
          <div className="w-full h-full flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-700 bg-gradient-to-br from-slate-50 to-slate-100">
            {service.image}
          </div>
        ) : (
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Overlay gradient */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" /> */}

        {/* Badge Overlays */}
        {service.discount > 0 && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-[#101242] text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-[8px] sm:text-sm font-bold shadow-lg">
            Save {service.discount}%
          </div>
        )}

        {/* <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm text-[#101242] px-1.5 py-1 sm:px-3 sm:py-2 rounded-full flex items-center gap-1 shadow-lg">
          <CheckCircle className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-[#101242]" />
          <span className="text-[8px] sm:text-xs font-semibold">Verified</span>
        </div> */}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-6 space-y-2 sm:space-y-4">
        <div>
          <p className="text-[8px] sm:text-xs font-semibold text-gray-800 uppercase tracking-wide mb-0.5 sm:mb-1">
            {service.category}
          </p>
          <h3 className="text-sm sm:text-xl font-bold text-foreground group-hover:text-[#101242] transition-colors line-clamp-1">
            {service.name}
          </h3>
        </div>

        {/* Price and CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 sm:pt-4 border-t border-border/50 gap-2 sm:gap-0">
          <div className="space-y-0.5 sm:space-y-1">

            <div className="flex items-center gap-3">
              <span className="text-lg sm:text-2xl font-bold text-[#101242]">₹{formatPrice(service.price)}</span>
              {originalPrice > service.price && (
                <span className="text-sm font-medium text-slate-400 line-through decoration-[#101242]/30 underline-offset-2">
                  ₹{formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
              if (!token) {
                toast.error('Please login to book a service')
                router.push('/login')
              } else {
                router.push(`/${basePath}/${service.id}`)
              }
            }}
            className="flex justify-center items-center bg-[#101242] hover:from-[#101242]/90 hover:to-[#101242] text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl font-bold transition-all duration-300 text-[10px] sm:text-sm whitespace-nowrap shadow-md hover:shadow-lg active:scale-95"
          >
            Book
          </button>

        </div>
      </div>
    </Link>
  )
}
