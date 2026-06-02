import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Categories } from '@/components/categories'

import { FeaturedServices } from '@/components/featured-services'
import { WhyUs } from '@/components/why-us'
import { Testimonials } from '@/components/testimonials'
import { Footer } from '@/components/footer'
import AboutSection from '@/components/AboutSection'
import Brands from '@/components/Brands'
import type { Metadata } from "next";
import Script from 'next/script'

export const metadata: Metadata = {
  title: "ITFixer @199 – Laptop & Computer Service Center in Chennai",
  description:
    "ITFixer @199 offers expert laptop, computer, MacBook repair, chip-level service, and upgrades in Chennai. Fast delivery, genuine parts, doorstep support.",
  keywords: [
    "ITFixer 199",
    "laptop service center Chennai",
    "computer repair Chennai",
    "MacBook service Chennai",
    "desktop repair",
    "chip level service",
    "motherboard repair",
    "laptop upgrades",
    "SSD upgrade Chennai",
    "laptop display repair",
    "doorstep laptop service Chennai",
  ],
  robots: "index, follow",
  alternates: {
    canonical: "https://www.itfixer199.com/",
  },
  openGraph: {
    title: "ITFixer @199 – Laptop & Computer Service Center in Chennai",
    description:
      "Fast and professional laptop, computer & MacBook repair services in Chennai. Chip-level service, upgrades, and doorstep support.",
    url: "https://www.itfixer199.com/",
    siteName: "ITFixer @199",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ITFixer @199 – Laptop & Computer Service Center in Chennai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ITFixer @199 – Laptop & Computer Service Center in Chennai",
    description:
      "Expert laptop & computer repair in Chennai. Chip-level service, upgrades & fast delivery.",
    images: ["/logo.png"],
    site: "@itfixerat199",
  },
  other: {
    image_src: "/logo.png",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "ITFixer @199",
  url: "https://www.itfixer199.com/",
  image: "/logo.png",
  "@id": "https://www.itfixer199.com/#itfixer199",
  description:
    "ITFixer @199 provides laptop, computer, and MacBook repair services in Chennai with chip-level expertise, upgrades, fast delivery, and doorstep support.",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "No.91, Ground Floor, Kothari Nagar 2nd Main Road, Ramapuram",
    addressLocality: "Chennai",
    postalCode: "600089",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  telephone: "+91 9385939985",
  email: "info@itfixer199.com",
  sameAs: [
    "https://www.facebook.com/itfixerat199",
    "https://www.instagram.com/it.fixerat_199",
    "https://www.youtube.com/@ITFixeAt199",
    "https://www.linkedin.com/company/it-fixer-at199/about/",
    "https://x.com/itfixerat199",
  ],
  openingHours: "Mo-Su 09:00-21:00",
  geo: {
    "@type": "GeoCoordinates",
    latitude: "13.0358",
    longitude: "80.1867",
  },
  priceRange: "₹₹",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <Header />
      <Hero />
      <Categories />
      {/* <AllProducts /> */}
      <FeaturedServices />
      <AboutSection />
      <WhyUs />
      <Brands />
      <Testimonials />
      <Footer />
    </div>
  )
}
