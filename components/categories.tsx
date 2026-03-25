'use client'

import Image from 'next/image'
import { ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'

export function Categories() {
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
          count: cat.services_count || 'Multiple'
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

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          <div className="space-y-4 max-w-2xl text-left">
            <h2 className="text-4xl sm:text-5xl font-black text-[#1a1c2e] tracking-tight leading-tight">
              Shop by <span className="text-[#800000]">Category</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium">
              Explore our wide range of professional services, curated for your specific needs
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-12 h-12 text-[#800000] animate-spin" />
              <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Loading Categories...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
              {categories.map((category) => (
                <Link
                  href={`/categories/${category.id}`}
                  key={category.id}
                  className="group bg-white rounded-[30px] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col shadow-sm"
                >
                  {/* Image Container */}
                  <div className="relative h-40 sm:h-64 overflow-hidden flex-shrink-0">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Services Badge */}
                    {/* 
                    <div className="absolute top-3 left-3 sm:top-5 sm:left-5">
                      <span className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold bg-[#800000] text-white uppercase tracking-widest shadow-lg">
                        {category.count} Services
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
          )}
        </div>
      </div>
    </section>
  )
}
