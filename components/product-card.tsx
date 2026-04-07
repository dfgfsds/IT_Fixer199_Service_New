'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, ShoppingCart } from 'lucide-react'
import type { Product } from '@/lib/products'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Props = {
  product: Product
  basePath?: string
}

export function ProductCard({ product, basePath = 'products' }: Props) {
  const router = useRouter()
  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <Link href={`/${basePath}/${product.id}`} className="group bg-white rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 block">
      {/* Image Section */}
      <div className="relative h-32 sm:h-56 overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badge Overlays */}
        {discountPct && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-primary text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-[8px] sm:text-sm font-bold shadow-lg">
            Save {discountPct}%
          </div>
        )}
        {product.badge && !discountPct && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-primary text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-[8px] sm:text-sm font-bold shadow-lg">
            {product.badge}
          </div>
        )}

        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm text-accent px-1.5 py-1 sm:px-3 sm:py-2 rounded-full flex items-center gap-1 shadow-lg">
          <CheckCircle className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
          <span className="text-[8px] sm:text-xs font-semibold">Verified</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-6 space-y-2 sm:space-y-4">
        <div>
          <p className="text-[8px] sm:text-xs font-semibold text-accent uppercase tracking-wide mb-0.5 sm:mb-1">
            {product.category}
          </p>
          <h3 className="text-sm sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        {/* Price and CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 sm:pt-4 border-t border-border/50 gap-2 sm:gap-0">
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-[8px] sm:text-xs text-muted-foreground">Starting from</p>
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-lg sm:text-2xl font-bold text-primary">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-[8px] sm:text-sm text-muted-foreground line-through">
                  ₹{product.originalPrice}
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
                toast.error('Please login to book a product')
                router.push('/login')
              } else {
                router.push(`/${basePath}/${product.id}`)
              }
            }}
            className="flex justify-center items-center gap-1.5 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl font-bold transition-all duration-300 text-[10px] sm:text-sm whitespace-nowrap shadow-md hover:shadow-lg active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            Book
          </button>

        </div>
      </div>
    </Link>

  )
}
