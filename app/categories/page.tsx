'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import { ArrowRight, Search, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'
import { extractErrorMessage } from '@/lib/error-utils'
import { toast } from 'sonner'

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'ALL' | 'PRODUCT' | 'SERVICE'>('ALL')

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
          image: cat.media?.[0]?.url || '/placeholder-image.jpg',
          count: cat.services_count || 'Explore',
          type: cat.type || 'ALL'
        }))

        setCategories(mappedCategories)
      } catch (err: any) {
        toast.error(extractErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTab = activeTab === 'ALL' || cat.type === activeTab
      return matchesSearch && matchesTab
    })
  }, [categories, searchQuery, activeTab])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-white py-10 md:py-15 px-4 border-b border-slate-100">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-black text-[#101242] tracking-tight leading-tight">
            All Categories
          </h1>
          <p className="text-xl text-slate-700 font-medium max-w-2xl mx-auto">
            Discover our wide range of professional services, curated for your specific needs
          </p>

          {/* <div className="max-w-xl mx-auto relative group pt-4">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#101242] w-6 h-6 transition-colors" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-transparent rounded-[32px] focus:bg-white focus:border-[#101242]/20 focus:ring-4 focus:ring-[#101242]/5 transition-all outline-none font-bold text-lg text-[#101242] shadow-lg shadow-slate-100/50"
            />
          </div> */}
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-10 md:py-20 px-4  max-w-7xl mx-auto w-full">
        {/* Tabs */}
        {!loading && categories.length > 0 && (
          <div className="flex justify-center mb-10 overflow-x-auto no-scrollbar">
            <div className="inline-flex bg-slate-50 border border-slate-100 p-1.5 rounded-2xl gap-1 whitespace-nowrap shadow-sm">
              {['ALL', 'PRODUCT', 'SERVICE'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 sm:px-8 py-3 rounded-xl text-sm font-black tracking-wide transition-all duration-300 ${activeTab === tab
                    ? 'bg-white text-[#101242] shadow-sm transform scale-[1.02] border border-slate-100'
                    : 'text-slate-500 hover:text-[#101242] hover:bg-slate-100/50'
                    }`}
                >
                  {tab === 'ALL' ? 'All Categories' : tab === 'PRODUCT' ? 'Products' : 'Services'}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-12 h-12 text-[#101242] animate-spin" />
            <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Fetching Categories...</p>
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
            {filteredCategories.map((category) => (
              <Link
                href={`/categories/${category.id}`}
                key={category.id}
                className="group bg-white rounded-[12px] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col shadow-sm"
              >
                {/* Image Section */}
                <div className="relative h-40 sm:h-64 overflow-hidden flex-shrink-0 bg-white">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-contain w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Services Badge */}
                  {/*
                  <div className="absolute top-5 left-5">
                    <span className="px-4 py-2 rounded-full bg-[#101242] text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                      {category.count} {typeof category.count === 'number' ? 'Services' : ''}
                    </span>
                  </div>
                  */}
                </div>

                {/* Content Area */}
                <div className="p-4 sm:p-8 flex flex-col flex-1 justify-between gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-2xl font-black text-[#101242] leading-tight group-hover:text-[#101242] transition-colors duration-300 capitalize">
                      {category.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-gray-700 text-[10px] sm:text-base font-medium">View More</span>
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-50 text-gray-700 group-hover:bg-[#101242] group-hover:text-white flex items-center justify-center transition-all ">
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
            <h3 className="text-2xl font-black text-[#101242]">No categories found</h3>
            <p className="text-slate-500 font-medium">Clear search to see all categories</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-8 py-3 bg-[#101242] text-white rounded-2xl font-bold shadow-lg shadow-[#101242]/20 transition-all hover:-translate-y-0.5"
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
