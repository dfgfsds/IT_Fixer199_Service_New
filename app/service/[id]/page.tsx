'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Star, Check, ArrowRight, Share2, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const SERVICE_DETAILS = {
  id: 1,
  name: 'AC Service & Repair',
  category: 'Appliances',
  rating: 4.7,
  reviews: 985,
  price: 599,
  image: '/ac-service.png',
  description:
    'Expert AC servicing, deep cleaning, gas refilling, and repairs for all brands. Keep your AC running efficiently year-round.',
  includes: [
    'Filter cleaning & replacement',
    'Refrigerant gas refilling',
    'Coil cleaning',
    'Thermostat calibration',
    'All brands supported',
    '90-day service warranty',
  ],
  verified: true,
}

const RELATED_SERVICES = [
  {
    id: 101,
    name: 'Refrigerator Repair',
    price: 499,
    image: '/service-appliance.jpg',
    rating: 4.8,
  },
  {
    id: 102,
    name: 'Washing Machine Service',
    price: 399,
    image: '/service-appliance.jpg',
    rating: 4.6,
  },
  {
    id: 103,
    name: 'Microwave Repair',
    price: 299,
    image: '/service-appliance.jpg',
    rating: 4.7,
  },
]

export default function ServiceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Left: Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group border border-slate-100">
            <Image
              src={SERVICE_DETAILS.image}
              alt={SERVICE_DETAILS.name}
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
              <h1 className="text-5xl font-extrabold text-[#1a1c2e] tracking-tight">
                {SERVICE_DETAILS.name}
              </h1>
              <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
                {SERVICE_DETAILS.description}
              </p>
            </div>

            {/* Rating & Verified */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-[#ffbb00] text-[#ffbb00]" />
                <span className="text-xl font-bold text-[#1a1c2e]">{SERVICE_DETAILS.rating}</span>
                <span className="text-slate-400 font-medium">({SERVICE_DETAILS.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700">Verified Professionals</span>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <p className="text-slate-500 font-medium mb-1">Starting from</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black text-[#1a1c2e]">₹{SERVICE_DETAILS.price}</span>
              </div>
              <p className="text-sm text-slate-400">Inclusive of all taxes</p>
            </div>

            {/* What's Included */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#1a1c2e]">What's Included</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                {SERVICE_DETAILS.includes.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 transition-colors group-hover:bg-emerald-100">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />
                    </div>
                    <span className="text-[15px] font-medium text-slate-600 leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full bg-[#800000] hover:bg-[#600000] text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-xl shadow-red-900/10">
              <span>Book Now — ₹{SERVICE_DETAILS.price}</span>
            </button>
          </div>
        </div>

        {/* Related Services Section */}
        <div className="space-y-10 py-16 border-t border-slate-100">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-[#1a1c2e]">Related Services</h2>
              <p className="text-slate-500">Popular services frequently booked by our customers</p>
            </div>
            <Link
              href="/all-products"
              className="flex items-center gap-2 text-[#800000] font-bold hover:gap-3 transition-all group"
            >
              <span>See All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {RELATED_SERVICES.map((service) => (
              <div
                key={service.id}
                className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:border-[#800000]/20 hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1.5 shadow-lg">
                    <Star className="w-3.5 h-3.5 fill-[#ffbb00] text-[#ffbb00]" />
                    <span className="text-xs font-bold text-[#1a1c2e]">{service.rating}</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-[#1a1c2e] line-clamp-1">
                    {service.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-0.5">Starting at</p>
                      <p className="text-2xl font-black text-[#800000]">₹{service.price}</p>
                    </div>
                    <button className="p-3 rounded-full bg-slate-50 text-slate-400 group-hover:bg-[#800000] group-hover:text-white transition-all duration-300">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
