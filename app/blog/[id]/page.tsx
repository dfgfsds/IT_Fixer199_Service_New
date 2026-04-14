'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Calendar, User, ArrowLeft, Clock, Share2, MessageCircle, Bookmark, Facebook, Twitter, Linkedin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const BLOG_POSTS = [
  {
    id: 1,
    title: '5 Tips for Maintaining Your AC During Summer',
    content: `
      <p>Summer is here, and your air conditioner is about to become your best friend. But is it ready for the heavy lifting? Neglecting AC maintenance can lead to poor cooling, higher energy bills, and even costly breakdowns.</p>
      
      <h2>1. Clean or Replace the Air Filter</h2>
      <p>The most important maintenance task is to routinely replace or clean its filters. Clogged, dirty filters block normal airflow and reduce a system's efficiency significantly.</p>
      
      <h2>2. Check the Condenser Coils</h2>
      <p>The outdoor condenser unit can collect dirt, leaves, and debris. Clean the area around the unit and gently wash the coils with a garden hose to ensure proper heat dissipation.</p>
      
      <h2>3. Inspect the Drain Line</h2>
      <p>A clogged condensate drain line can cause water damage and affect indoor humidity levels. Pass a stiff wire through the unit's drain channels to clear any obstructions.</p>
      
      <h2>4. Schedule a Professional Tune-up</h2>
      <p>While DIY maintenance is great, a professional technician can spot issues you might miss, such as refrigerant leaks or electrical problems.</p>
      
      <h2>5. Use a Programmable Thermostat</h2>
      <p>Save energy by setting your AC to a higher temperature when you're away and cooling things down just before you return home.</p>
    `,
    category: 'Maintenance',
    author: 'Admin',
    date: 'March 15, 2026',
    image: '/service-appliance.jpg',
    readTime: '5 min read',
  },
]

export default function BlogDetailPage() {
  const params = useParams()
  const post = BLOG_POSTS.find(p => p.id === Number(params.id)) || BLOG_POSTS[0]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Blog Hero */}
      <section className="relative h-[60vh] sm:h-[70vh] w-full flex items-end">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101242] via-[#101242]/40 to-transparent"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 pb-20 w-full text-left">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm tracking-widest uppercase mb-8 transition-all group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>

          <div className="space-y-6">
            <span className="px-4 py-2 rounded-full bg-[#101242] text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
              {post.category}
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 text-white/70 font-bold text-xs uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#101242]" />
                {post.date}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#101242]" />
                By {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#101242]" />
                {post.readTime}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Article Content */}
          <article className="lg:col-span-8 space-y-12">
            <div
              className="prose prose-lg max-w-none prose-headings:text-[#101242] prose-headings:font-black prose-p:text-slate-500 prose-p:leading-relaxed prose-strong:text-[#101242] prose-strong:font-black text-left"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-[#101242] font-bold text-sm hover:text-[#101242] transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  12 Comments
                </button>
                <button className="p-2 text-slate-400 hover:text-[#101242] transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Share:</span>
                <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-[#101242] hover:text-white transition-all shadow-sm">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-[#101242] hover:text-white transition-all shadow-sm">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-[#101242] hover:text-white transition-all shadow-sm">
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12 text-left">
            {/* Author Bio */}
            <div className="bg-slate-50 p-8 rounded-[40px] space-y-4">
              <h4 className="text-lg font-black text-[#101242]">About Author</h4>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image src="https://ui-avatars.com/api/?name=Admin&background=800000&color=fff" alt="Author" fill />
                </div>
                <div>
                  <p className="font-bold text-[#101242] uppercase tracking-tight">IT FIX Editorial</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Verified Expert</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Dedicated to providing the best home maintenance tips and professional insights for our customers.
              </p>
            </div>

            {/* Related Posts */}
            <div className="space-y-6">
              <h4 className="text-lg font-black text-[#101242]">Related Articles</h4>
              <div className="space-y-6">
                {[2, 3].map((id) => (
                  <Link key={id} href={`/blog/${id}`} className="group flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md flex-shrink-0 transition-transform group-hover:scale-105">
                      <Image src={id === 2 ? "/service-cleaning.jpg" : "/service-plumbing.jpg"} alt="Related" fill className="object-cover" />
                    </div>
                    <div>
                      <h5 className="font-black text-[#101242] group-hover:text-[#101242] transition-colors line-clamp-2 leading-tight">
                        {id === 2 ? 'Professional Cleaning vs. DIY: What to Choose?' : 'How to Identify Plumbing Leaks Early'}
                      </h5>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">March 2026</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  )
}
