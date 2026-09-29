import type { Metadata } from 'next'
import BlogClient from './BlogClient'
import { fetchBlogs } from '@/lib/blog-service'

export const metadata: Metadata = {
  title: 'ITFixer @199 Blog | Tech Insights, Maintenance Guides & Repair Tips',
  description:
    'Explore helpful technology repair guides, home appliance maintenance tips, gadget troubleshooting tutorials, and electronics care insights from ITFixer @199.',
  keywords: [
    'ITFixer 199 blog',
    'laptop repair tips',
    'computer repair Chennai',
    'home appliance maintenance',
    'tech guides',
    'electronics repair blog',
    'AC service tips',
  ],
  robots: {
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
  alternates: {
    canonical: 'https://www.itfixer199.com/blog',
  },
  openGraph: {
    title: 'ITFixer @199 Blog | Tech Insights & Maintenance Guides',
    description:
      'Explore helpful technology repair guides, home appliance maintenance tips, and gadget troubleshooting from ITFixer @199.',
    url: 'https://www.itfixer199.com/blog',
    siteName: 'ITFixer @199',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'ITFixer @199 Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ITFixer @199 Blog | Tech Insights & Maintenance Guides',
    description:
      'Explore tech guides, appliance troubleshooting, and gadget maintenance tips from ITFixer @199.',
    images: ['/logo.png'],
    site: '@itfixerat199',
  },
  other: {
    image_src: '/logo.png',
  },
}

const blogCollectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'ITFixer @199 Blog',
  url: 'https://www.itfixer199.com/blog',
  description:
    'Discover guides, articles, and expert repair tips for laptops, desktops, home appliances, and electronic gadgets from ITFixer @199.',
  publisher: {
    '@type': 'Organization',
    name: 'ITFixer @199',
    url: 'https://www.itfixer199.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.itfixer199.com/logo.png',
    },
  },
}

export default async function BlogPage() {
  const blogs = await fetchBlogs()

  console.log(blogs)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogCollectionSchema),
        }}
      />
      <BlogClient initialBlogs={blogs} />
    </>
  )
}
