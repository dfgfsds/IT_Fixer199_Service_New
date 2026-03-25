'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const BLOG_POSTS = [
  {
    id: 1,
    title: '5 Tips for Maintaining Your AC During Summer',
    excerpt: 'Is your AC not cooling enough? Follow these simple maintenance tips to keep your air conditioner running efficiently all summer long...',
    category: 'Maintenance',
    author: 'Admin',
    date: 'March 15, 2026',
    image: '/service-appliance.jpg',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Professional Cleaning vs. DIY: What to Choose?',
    excerpt: 'Should you hire a pro or do it yourself? We compare the pros and cons of professional deep cleaning services for your home...',
    category: 'Cleaning',
    author: 'Sarah Johnson',
    date: 'March 10, 2026',
    image: '/service-cleaning.jpg',
    readTime: '8 min read',
  },
  {
    id: 3,
    title: 'How to Identify Plumbing Leaks Early',
    excerpt: 'Drip, drip, drip. Hidden leaks can cause major damage. Learn the warning signs of plumbing leaks and how to spot them before it is too late...',
    category: 'Plumbing',
    author: 'Mike Wilson',
    date: 'March 5, 2026',
    image: '/service-plumbing.jpg',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Modern Interior Painting Trends for 2026',
    excerpt: 'From earthy tones to bold accent walls, explore the latest interior design and painting trends that will transform your home this year...',
    category: 'Painting',
    author: 'Emily Davis',
    date: 'February 28, 2026',
    image: '/service-painting.jpg',
    readTime: '10 min read',
  },
  {
    id: 5,
    title: 'Electrical Safety Checklist for Homeowners',
    excerpt: 'Don’t take risks with electricity. Use our comprehensive electrical safety checklist to ensure your home is protected from hazards...',
    category: 'Electrical',
    author: 'Admin',
    date: 'February 24, 2026',
    image: '/service-electrical.jpg',
    readTime: '4 min read',
  },
  {
    id: 6,
    title: 'The Ultimate Guide to Kitchen Appliance Care',
    excerpt: 'Extend the lifespan of your refrigerator, oven, and dishwasher with these expert care and troubleshooting tips for every kitchen...',
    category: 'Repairs',
    author: 'David Chen',
    date: 'February 20, 2026',
    image: '/service-appliance.jpg',
    readTime: '7 min read',
  },
]

const CATEGORIES = ['All', 'Maintenance', 'Cleaning', 'Plumbing', 'Electrical', 'Painting', 'Repairs']

export default function BlogListPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* Blog Hero Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-black text-[#1a1c2e] tracking-tight leading-tight">
            IT FIX <span className="text-[#800000]">Insights & Blogs</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            Expert tips, home maintenance guides, and the latest trends from our professional service masters
          </p>

          <div className="max-w-xl mx-auto relative group pt-4">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#800000] w-6 h-6 transition-colors" />
            <input
              type="text"
              placeholder="Search articles, tips, techniques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-transparent rounded-[32px] focus:bg-white focus:border-[#800000]/20 focus:ring-4 focus:ring-[#800000]/5 transition-all outline-none font-bold text-lg text-[#1a1c2e] shadow-lg shadow-slate-100/50"
            />
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-10 border-y border-slate-100 bg-white sticky top-20 z-40 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${activeCategory === category ? 'bg-[#800000] text-white shadow-lg shadow-[#800000]/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-[#1a1c2e]'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Blogs Grid */}
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post) => (
              <Link
                href={`/blog/${post.id}`}
                key={post.id}
                className="group bg-white rounded-[15px] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col shadow-sm"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-5 left-5">
                    <span className="px-4 py-2 rounded-full bg-[#800000] text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-5 flex flex-col flex-1">
                  <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5" />
                      {post.author}
                    </div>
                  </div>

                  <h2 className="text-2xl font-black text-[#1a1c2e] leading-tight group-hover:text-[#800000] transition-colors duration-300">
                    {post.title}
                  </h2>

                  <p className="text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="pt-6 mt-auto border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{post.readTime}</span>
                    <div className="flex items-center gap-2 text-[#800000] font-bold text-sm tracking-widest uppercase group/btn">
                      Read More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
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
            <h3 className="text-2xl font-black text-[#1a1c2e]">No articles found</h3>
            <p className="text-slate-500 font-medium">Clear search or categories to see all blogs</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="px-8 py-3 bg-[#800000] text-white rounded-2xl font-bold shadow-lg shadow-[#800000]/20 transition-all hover:-translate-y-0.5"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Newsletter Section */}
      <section className="bg-[#1a1c2e] py-24 px-4 overflow-hidden relative">
        <div className="max-w-4xl mx-auto space-y-10 relative z-10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Get Notified about <span className="text-[#800000]">New Tips</span>
            </h2>
            <p className="text-lg text-slate-400 font-medium">Subscribe to our newsletter for the latest expert insights and exclusive offers</p>
          </div>
          <form className="flex flex-col sm:flex-row gap-4 p-4 bg-white/5 backdrop-blur-md rounded-[32px] border border-white/10" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/10 border border-transparent rounded-2xl px-8 py-5 text-white placeholder-slate-400 focus:bg-white focus:text-[#1a1c2e] focus:border-[#800000]/20 transition-all outline-none font-bold"
              required
            />
            <button className="px-10 py-5 bg-[#800000] text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#600000] transition-all shadow-xl shadow-[#800000]/20">
              Subscribe Now
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
