'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import { ArrowRight, Search, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      setCategories([])
      setLoading(true)
      try {
        const response = await axiosInstance.get(Api.categories)

        const categoriesData = response.data?.data || []

        const mappedCategories = categoriesData.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          image: cat.media?.[0]?.url || '/placeholder-category.jpg',
          count: cat.services_count || 'Explore'
        }))

        setCategories(mappedCategories)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const filteredCategories = useMemo(() => {
    return categories.filter(cat =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [categories, searchQuery])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-white py-20 px-4 border-b border-slate-100">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h1 className="text-5xl sm:text-6xl font-black text-[#1a1c2e] tracking-tight leading-tight">
            Explore All <span className="text-[#800000]">Categories</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            Discover our wide range of professional services, curated for your specific needs
          </p>

          <div className="max-w-xl mx-auto relative group pt-4">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#800000] w-6 h-6 transition-colors" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-transparent rounded-[32px] focus:bg-white focus:border-[#800000]/20 focus:ring-4 focus:ring-[#800000]/5 transition-all outline-none font-bold text-lg text-[#1a1c2e] shadow-lg shadow-slate-100/50"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-12 h-12 text-[#800000] animate-spin" />
            <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Fetching Categories...</p>
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
            {filteredCategories.map((category) => (
              <Link
                href={`/categories/${category.id}`}
                key={category.id}
                className="group bg-white rounded-[30px] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col shadow-sm"
              >
                {/* Image Section */}
                <div className="relative h-40 sm:h-64 overflow-hidden flex-shrink-0">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Services Badge */}
                  {/*
                  <div className="absolute top-5 left-5">
                    <span className="px-4 py-2 rounded-full bg-[#800000] text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                      {category.count} {typeof category.count === 'number' ? 'Services' : ''}
                    </span>
                  </div>
                  */}
                </div>

                {/* Content Area */}
                <div className="p-4 sm:p-8 flex flex-col flex-1 justify-between gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-2xl font-black text-[#1a1c2e] leading-tight group-hover:text-[#800000] transition-colors duration-300 capitalize">
                      {category.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-slate-400 text-[10px] sm:text-sm font-medium">Browse</span>
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-[#800000] group-hover:text-white flex items-center justify-center transition-all duration-500 group-hover:rotate-[-45deg]">
                      <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-6">
            <div className="w-24 h-24 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-[#1a1c2e]">No categories found</h3>
            <p className="text-slate-500 font-medium">Clear search to see all categories</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-8 py-3 bg-[#800000] text-white rounded-2xl font-bold shadow-lg shadow-[#800000]/20 transition-all hover:-translate-y-0.5"
            >
              Reset Search
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
