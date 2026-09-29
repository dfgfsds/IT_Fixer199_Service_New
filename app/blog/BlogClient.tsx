'use client'

import { useState, useMemo, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Search, Calendar, User, ArrowRight, Clock, Heart, Sparkles, BookOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { BlogPost } from '@/types/blog'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'

interface BlogClientProps {
  initialBlogs: BlogPost[]
}

function calculateReadTime(content?: string): string {
  if (!content) return '4 min read'
  const text = content.replace(/<[^>]*>/g, '')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

function formatDate(dateString?: string): string {
  if (!dateString) return 'Recently published'
  try {
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return dateString
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

export default function BlogClient({ initialBlogs }: BlogClientProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs || [])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [apiLoading, setApiLoading] = useState(false)

  // Fetch blogs via axiosInstance on client so browser devtools Network and Console show the API call
  useEffect(() => {
    const loadBlogsFromApi = async () => {
      setApiLoading(true)
      try {
        console.log('📡 [Browser Blog API] Calling GET:', Api.blogs)
        const response = await axiosInstance.get(Api.blogs)
        console.log('✅ [Browser Blog API] Response:', response.data)

        let data = Array.isArray(response.data) ? response.data : (response.data?.data || [])
        setBlogs(data)
      } catch (error) {
        console.error('❌ [Browser Blog API] Request error:', error)
      } finally {
        setApiLoading(false)
      }
    }

    loadBlogsFromApi()
  }, [])

  // Extract unique categories from blogs
  const categories = useMemo(() => {
    const set = new Set<string>()
    blogs.forEach((b) => {
      if (b.category) set.add(b.category)
    })
    const list = Array.from(set)
    return list.length > 0 ? ['All', ...list] : ['All']
  }, [blogs])

  // Filter posts based on search query and selected category
  const filteredPosts = useMemo(() => {
    return blogs.filter((post) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        post.title?.toLowerCase().includes(q) ||
        post.subtitle?.toLowerCase().includes(q) ||
        post.description?.toLowerCase().includes(q) ||
        post.author?.toLowerCase().includes(q) ||
        post.meta_keywords?.toLowerCase().includes(q)

      const matchesCat =
        selectedCategory === 'All' || post.category === selectedCategory

      return matchesSearch && matchesCat
    })
  }, [blogs, searchQuery, selectedCategory])

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null
  const regularPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : []

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Header />

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-100 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#101242]/5 text-[#101242] text-xs font-black uppercase tracking-widest border border-[#101242]/10">
            <Sparkles className="w-3.5 h-3.5" />
            Knowledge Base & Updates
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-[#101242] tracking-tight leading-tight">
            ITFixer <span className="text-[#101242]">Insights & Blog</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Expert maintenance advice, tech repair tips, gadget tutorials, and electronics care insights from verified specialists.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto relative group pt-4">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#101242] w-5 h-5 transition-colors" />
            <input
              type="text"
              placeholder="Search guides, tips, troubleshooting..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 sm:py-5 bg-slate-50 border border-slate-200/60 rounded-3xl focus:bg-white focus:border-[#101242]/30 focus:ring-4 focus:ring-[#101242]/5 transition-all outline-none font-bold text-base text-[#101242] shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Category Pills (if more than 1 category) */}
      {categories.length > 1 && (
        <section className="bg-white border-b border-slate-100 py-4 sticky top-16 z-30 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-2.5">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${selectedCategory === category
                  ? 'bg-[#101242] text-white shadow-md shadow-[#101242]/20'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-[#101242]'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {filteredPosts.length > 0 ? (
          <div className="space-y-14">
            {/* Featured Hero Article */}
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.url_slug || featuredPost.id}`}
                className="group block bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className="grid lg:grid-cols-12 gap-0 items-center">
                  <div className="lg:col-span-7 relative h-72 sm:h-96 w-full bg-slate-100 overflow-hidden">
                    {featuredPost.banner_url ? (
                      <Image
                        src={featuredPost.banner_url}
                        alt={featuredPost.title}
                        fill
                        priority
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#101242] flex items-center justify-center p-8 text-white">
                        <span className="text-3xl font-black">IT FIX FEATURED</span>
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 rounded-full bg-[#101242] text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                        {featuredPost.category || 'Featured'}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-8 sm:p-12 space-y-5">
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(featuredPost.created_at)}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{calculateReadTime(featuredPost.content)}</span>
                      </div>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-[#101242] leading-tight group-hover:text-blue-600 transition-colors">
                      {featuredPost.title}
                    </h2>

                    <p className="text-slate-500 font-medium leading-relaxed line-clamp-3">
                      {featuredPost.subtitle || featuredPost.description || 'Click to read full article with detailed steps, tips, and insights.'}
                    </p>

                    <div className="pt-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">
                        By {featuredPost.author || 'ITFixer Team'}
                      </span>
                      <div className="inline-flex items-center gap-2 text-[#101242] font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                        Read Story
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid of Other Articles */}
            {regularPosts.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-[#101242] tracking-tight">
                  Recent Articles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => {
                    const postUrl = `/blog/${post.url_slug || post.id}`
                    return (
                      <Link
                        key={post.id}
                        href={postUrl}
                        className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col shadow-sm"
                      >
                        {/* Image */}
                        <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                          {post.banner_url ? (
                            <Image
                              src={post.banner_url}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#101242]/10 flex items-center justify-center text-[#101242] font-black text-lg">
                              IT FIX
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="px-3.5 py-1.5 rounded-full bg-[#101242]/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-sm shadow-md">
                              {post.category || 'Guide'}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 sm:p-7 flex flex-col flex-1 space-y-4">
                          <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(post.created_at)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {calculateReadTime(post.content)}
                            </span>
                          </div>

                          <h3 className="text-lg sm:text-xl font-black text-[#101242] group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </h3>

                          <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
                            {post.subtitle || post.description || 'Explore expert breakdown, troubleshooting guides, and tips.'}
                          </p>

                          <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400">
                              {post.author || 'ITFixer Team'}
                            </span>
                            <div className="flex items-center gap-1.5 text-[#101242] font-black text-xs uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                              Read
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty / Search Not Found State */
          <div className="bg-white rounded-3xl border border-slate-100 p-12 sm:p-20 text-center max-w-xl mx-auto space-y-6 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto">
              <BookOpen className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#101242]">
                {searchQuery ? 'No matching articles found' : 'No Blogs Found'}
              </h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                {searchQuery
                  ? `We couldn't find any articles matching "${searchQuery}". Try searching with different keywords.`
                  : 'Currently there are no blog articles published. Please check back later!'}
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                }}
                className="px-8 py-3.5 bg-[#101242] text-white rounded-2xl font-bold uppercase tracking-wider text-xs hover:bg-[#101242]/90 transition-all shadow-lg shadow-[#101242]/20"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </main>

      {/* Newsletter Section */}
      <section className="bg-[#101242] py-20 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-8 relative z-10 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Get Notified About New Tech Tips
            </h2>
            <p className="text-slate-300 font-medium text-base sm:text-lg max-w-xl mx-auto">
              Subscribe to the ITFixer @199 newsletter for exclusive repair advice, tech guides, and seasonal discounts.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              alert('Thank you for subscribing!')
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:bg-white focus:text-[#101242] outline-none font-bold text-sm transition-all"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-[#101242] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl active:scale-95"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
