'use client'

import { Star, Clock, Shield, CheckCircle } from 'lucide-react'
import Image from 'next/image'

const FEATURED_SERVICES = [
  {
    id: 1,
    name: 'Home Deep Cleaning',
    category: 'Cleaning',
    rating: 4.9,
    reviews: 2456,
    price: 499,
    discount: 20,
    time: '2-3 hours',
    image: '/service-cleaning.jpg',
    description: 'Professional deep cleaning service',
    verified: true,
  },
  {
    id: 2,
    name: 'Plumbing Repair',
    category: 'Plumbing',
    rating: 4.8,
    reviews: 1923,
    price: 299,
    discount: 15,
    time: '30 mins - 1 hour',
    image: '/service-plumbing.jpg',
    description: 'Expert plumbing solutions',
    verified: true,
  },
  {
    id: 3,
    name: 'Electrical Maintenance',
    category: 'Electrical',
    rating: 4.9,
    reviews: 1645,
    price: 399,
    discount: 10,
    time: '45 mins - 1.5 hours',
    image: '/service-electrical.jpg',
    description: 'Safety certified technicians',
    verified: true,
  },
  {
    id: 4,
    name: 'Interior Painting',
    category: 'Painting',
    rating: 4.7,
    reviews: 1234,
    price: 599,
    discount: 25,
    time: '1-2 days',
    image: '/service-painting.jpg',
    description: 'Premium paint finishes',
    verified: true,
  },
  {
    id: 5,
    name: 'AC Service & Cleaning',
    category: 'Maintenance',
    rating: 4.8,
    reviews: 2100,
    price: 349,
    discount: 18,
    time: '1-1.5 hours',
    image: '/service-appliance.jpg',
    description: 'Complete AC maintenance',
    verified: true,
  },
  {
    id: 6,
    name: 'Expert Appliance Repair',
    category: 'Repairs',
    rating: 4.6,
    reviews: 987,
    price: 349,
    discount: 12,
    time: '1-2 hours',
    image: '/service-appliance.jpg',
    description: 'All appliances covered',
    verified: true,
  },
]

export function FeaturedServices() {
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
              Browse our most popular and highly-rated services with instant booking
            </p>
          </div>

          {/* Services Grid - 2 per row on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {FEATURED_SERVICES.map((service) => (
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

                  {/* Rating & Details - Hidden on ultra-small */}
                  <div className="hidden xs:flex flex-col gap-2">
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
                        {service.discount > 0 && (
                          <span className="text-[8px] sm:text-sm text-muted-foreground line-through">
                            ₹{Math.round(service.price / (1 - service.discount / 100))}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-white px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl font-black transition-all hover:-translate-y-0.5 active:scale-95 text-[10px] sm:text-sm whitespace-nowrap shadow-lg hover:shadow-xl uppercase tracking-widest">
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
