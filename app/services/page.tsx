'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '../../components/product-card'
import { type Product } from '@/lib/products'
import { Search, Sparkles } from 'lucide-react'
import { useState } from 'react'

const SERVICES: Product[] = [
  {
    id: 101, // Different IDs to avoid collision if needed
    name: 'Home Deep Cleaning',
    category: 'Cleaning',
    rating: 4.9,
    reviews: 2456,
    price: 499,
    originalPrice: 599,
    image: '/service-cleaning.jpg',
    badge: 'Service',
    inStock: true,
  },
  {
    id: 102,
    name: 'Plumbing Repair',
    category: 'Plumbing',
    rating: 4.8,
    reviews: 1923,
    price: 299,
    originalPrice: 349,
    image: '/service-plumbing.jpg',
    badge: 'Service',
    inStock: true,
  },
  {
    id: 103,
    name: 'Electrical Maintenance',
    category: 'Electrical',
    rating: 4.9,
    reviews: 1645,
    price: 399,
    originalPrice: 449,
    image: '/service-electrical.jpg',
    badge: 'Service',
    inStock: true,
  },
  {
    id: 104,
    name: 'Interior Painting',
    category: 'Painting',
    rating: 4.7,
    reviews: 1234,
    price: 599,
    originalPrice: 799,
    image: '/service-painting.jpg',
    badge: 'Service',
    inStock: true,
  },
  {
    id: 105,
    name: 'AC Service & Cleaning',
    category: 'Maintenance',
    rating: 4.8,
    reviews: 2100,
    price: 349,
    originalPrice: 429,
    image: '/service-appliance.jpg',
    badge: 'Service',
    inStock: true,
  },
  {
    id: 106,
    name: 'Appliance Repair',
    category: 'Repairs',
    rating: 4.6,
    reviews: 987,
    price: 349,
    originalPrice: 399,
    image: '/venum.png',
    badge: 'Service',
    inStock: true,
  },
]

const CATEGORIES = ['All', 'Cleaning', 'Plumbing', 'Electrical', 'Painting', 'Maintenance', 'Repairs']

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredServices = SERVICES.filter((service) => {
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
              Professional Experts at your Doorstep
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-[#1a1c2e] tracking-tight leading-tight">
              All Professional <span className="text-[#800000]">Services</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              Find the right expert for your home needs. Verified, reliable, and affordable.
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
          {/* Category Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3.5 rounded-2xl text-sm font-black tracking-widest uppercase transition-all whitespace-nowrap border-2 ${
                  selectedCategory === cat
                    ? 'bg-[#800000] border-[#800000] text-white shadow-xl shadow-[#800000]/20 scale-105'
                    : 'bg-white border-white text-slate-500 hover:border-slate-100 hover:bg-slate-50 text-slate-400'
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

          {/* Services Grid - 2 per row on mobile */}
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
        </div>
      </main>

      <Footer />
    </div>
  )
}
