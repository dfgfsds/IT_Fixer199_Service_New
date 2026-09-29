import type { Metadata, ResolvingMetadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Calendar, User, ArrowLeft, Clock, Sparkles, ChevronRight, BookOpen, Share2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchBlogByIdOrSlug, fetchBlogs } from '@/lib/blog-service'
import { BlogShareButtons } from '@/components/blog/blog-share-buttons'
import { BlogLikeButton } from '@/components/blog/blog-like-button'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

function calculateReadTime(content?: string): string {
  if (!content) return '3 min read'
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
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

/**
 * Server-Side Rendered Metadata for SEO
 * Search engines crawl these dynamic tags directly from the server response.
 */
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params
  const blog = await fetchBlogByIdOrSlug(id)

  if (!blog) {
    return {
      title: 'Blog Not Found | ITFixer @199',
      description: 'The requested blog article could not be found.',
      robots: { index: false, follow: true },
    }
  }

  const title = blog.meta_title || blog.title || 'ITFixer @199 Insights & Blogs'
  const description =
    blog.meta_description ||
    blog.description ||
    blog.subtitle ||
    'Read expert home maintenance guides, computer repair tips, and electronics care insights from ITFixer @199.'

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.itfixer199.com'
  const canonicalUrl = blog.canonical_tag || `${siteUrl}/blog/${blog.url_slug || blog.id}`
  const banner = blog.banner_url || blog.image_src_tags || '/logo.png'
  const keywords = blog.meta_keywords
    ? blog.meta_keywords.split(',').map((k) => k.trim()).filter(Boolean)
    : ['ITFixer 199', 'tech blog', 'repair guides', 'appliance maintenance', 'electronics repair']

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: blog.robots_tag || {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: blog.og_tags || blog.meta_title || blog.title,
      description,
      url: canonicalUrl,
      siteName: 'ITFixer @199',
      type: 'article',
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at || blog.created_at,
      authors: blog.author ? [blog.author] : ['ITFixer @199 Team'],
      images: [
        {
          url: banner,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.twitter_tags || blog.meta_title || blog.title,
      description,
      images: [banner],
      site: '@itfixerat199',
      creator: '@itfixerat199',
    },
    other: {
      ...(blog.image_src_tags ? { image_src: blog.image_src_tags } : {}),
      ...(blog.url_description ? { 'url-description': blog.url_description } : {}),
      ...(blog.meta_tags ? { 'custom-meta': blog.meta_tags } : {}),
    },
  }
}

/**
 * Server Component: Server-Side Rendered (SSR) Single Blog Page
 */
export default async function BlogDetailPage({ params }: PageProps) {
  const { id } = await params
  const [blog, allBlogs] = await Promise.all([
    fetchBlogByIdOrSlug(id),
    fetchBlogs(),
  ])

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-32 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
            <BookOpen className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-[#101242] mb-3">Blog Not Found</h1>
          <p className="text-slate-500 font-medium mb-8 max-w-md">
            The blog article you are looking for does not exist or has not been published yet.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#101242] text-white rounded-2xl font-bold uppercase tracking-wider text-xs hover:bg-[#101242]/90 transition-all shadow-xl shadow-[#101242]/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Blogs
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.itfixer199.com'
  const currentUrl = blog.canonical_tag || `${siteUrl}/blog/${blog.url_slug || blog.id}`
  const readTime = calculateReadTime(blog.content)
  const publishedDate = formatDate(blog.created_at)

  // Filter other blogs for related articles sidebar
  const relatedPosts = allBlogs
    .filter((b) => b.id !== blog.id && b.url_slug !== blog.url_slug)
    .slice(0, 3)

  // Standard JSON-LD Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.meta_description || blog.description || blog.subtitle,
    image: blog.banner_url || `${siteUrl}/logo.png`,
    author: {
      '@type': 'Person',
      name: blog.author || 'ITFixer Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ITFixer @199',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
  }

  // Parse schema safely if provided by backend API
  let customSchemaString: string | null = null
  if (blog.schema && typeof blog.schema === 'string' && blog.schema.trim().length > 0) {
    try {
      if (blog.schema.trim().startsWith('{') || blog.schema.trim().startsWith('[')) {
        customSchemaString = blog.schema
      }
    } catch {
      customSchemaString = null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      {/* Search Engine Server-Side Rendered JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: customSchemaString || JSON.stringify(articleSchema),
        }}
      />

      <Header />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-100 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider overflow-x-auto whitespace-nowrap py-1">
            <Link href="/" className="hover:text-[#101242] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <Link href="/blog" className="hover:text-[#101242] transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-[#101242] truncate max-w-xs sm:max-w-md">
              {blog.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Article Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Article Column */}
          <article className="lg:col-span-8 flex flex-col space-y-10">
            {/* Header / Meta Header */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-[#101242]/5 text-[#101242] text-xs font-black uppercase tracking-wider border border-[#101242]/10">
                  {blog.category || 'Tech Guide'}
                </span>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{readTime}</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-[#101242] tracking-tight leading-[1.2]">
                {blog.title}
              </h1>

              {blog.subtitle && (
                <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed">
                  {blog.subtitle}
                </p>
              )}

              {/* Author & Date Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-2xl bg-[#101242]/5 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                    <User className="w-6 h-6 text-[#101242]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#101242]">
                      {blog.author || 'ITFixer Editorial Team'}
                    </p>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {publishedDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BlogLikeButton initialLikes={blog.likes || 0} blogId={blog.id} />
                </div>
              </div>
            </div>

            {/* Featured Banner Image */}
            {blog.banner_url ? (
              <div className="relative w-full h-[280px] sm:h-[450px] rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-slate-100">
                <Image
                  src={blog.banner_url}
                  alt={blog.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-48 rounded-3xl bg-gradient-to-br from-[#101242] to-[#1c2269] flex items-center justify-center p-8 text-white/90 shadow-lg">
                <div className="text-center space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-amber-300 opacity-80" />
                  <p className="text-lg font-bold">ITFixer @199 Knowledge Base</p>
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-100 shadow-sm">
              {blog.content ? (
                <div
                  className="prose prose-lg max-w-none text-slate-700 leading-relaxed
                    prose-headings:text-[#101242] prose-headings:font-black prose-headings:tracking-tight
                    prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
                    prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-slate-600 prose-p:leading-8 prose-p:my-4
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 prose-li:my-1.5 prose-li:text-slate-600
                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
                    prose-strong:text-[#101242] prose-strong:font-bold
                    prose-blockquote:border-l-4 prose-blockquote:border-[#101242] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-700
                    prose-img:rounded-2xl prose-img:shadow-md prose-img:my-8
                    prose-a:text-[#101242] prose-a:underline hover:prose-a:text-blue-700"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              ) : blog.description ? (
                <p className="text-slate-600 text-lg leading-relaxed">{blog.description}</p>
              ) : (
                <p className="text-slate-400 italic">No content available for this post.</p>
              )}

              {/* Bottom Article Actions & Share */}
              <div className="mt-14 pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <BlogShareButtons title={blog.title} url={currentUrl} />
                <BlogLikeButton initialLikes={blog.likes || 0} blogId={blog.id} />
              </div>
            </div>

            {/* Back to Blog Navigation */}
            <div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2.5 text-sm font-bold text-[#101242] hover:text-[#101242]/80 transition-all uppercase tracking-wider group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to all blog articles
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* About Author Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                About The Author
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#101242] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                  {blog.author ? blog.author.charAt(0).toUpperCase() : 'IT'}
                </div>
                <div>
                  <h4 className="font-black text-[#101242] text-base">
                    {blog.author || 'ITFixer Editorial'}
                  </h4>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
                    Verified Technical Specialist
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Dedicated to providing expert home maintenance, electronics troubleshooting, and computer repair advice.
              </p>
            </div>

            {/* Social Share Box */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Share This Article
              </h3>
              <BlogShareButtons title={blog.title} url={currentUrl} />
            </div>

            {/* Related Articles Card */}
            {relatedPosts.length > 0 && (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Related Articles
                </h3>
                <div className="space-y-5">
                  {relatedPosts.map((related) => {
                    const relatedHref = `/blog/${related.url_slug || related.id}`
                    return (
                      <Link
                        key={related.id}
                        href={relatedHref}
                        className="group flex gap-4 items-start"
                      >
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                          {related.banner_url ? (
                            <Image
                              src={related.banner_url}
                              alt={related.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#101242]/10 flex items-center justify-center text-[#101242] font-black text-xs">
                              IT FIX
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {formatDate(related.created_at)}
                          </span>
                          <h4 className="font-bold text-sm text-[#101242] group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mt-1">
                            {related.title}
                          </h4>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Promotional Booking CTA */}
            <div className="bg-gradient-to-br from-[#101242] to-[#1c2269] p-8 rounded-3xl text-white shadow-xl shadow-[#101242]/10 space-y-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-2xl"></div>
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-white text-[11px] font-black uppercase tracking-wider inline-block">
                Doorstep Service
              </span>
              <div className="space-y-2">
                <h3 className="text-2xl font-black leading-tight">
                  Need Help With Your Device or Appliance?
                </h3>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  Book certified service professionals in Chennai starting at just ₹199. Quick, transparent, and trusted!
                </p>
              </div>
              <Link
                href="/services"
                className="block text-center w-full py-4 bg-white text-[#101242] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-lg active:scale-95"
              >
                Book Service Now
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
