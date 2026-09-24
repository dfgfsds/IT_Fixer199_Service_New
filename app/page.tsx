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
import { Faq } from '@/components/faq'

export const metadata: Metadata = {
  title: "Best PC Repair Service in Chennai for All Brands | IT Fixer @199",
  description:
    "Book doorstep laptop, desktop and gaming PC repair service in Chennai from ₹199 with fast diagnosis, genuine spares, upgrades and same-day support.",
  keywords: [
    "laptop repair services in Chennai",
    "Laptop service in Chennai",
    "computer service in Chennai",
    "best PC repair service in Chennai",
    "on-site PC repair in Chennai",
    "doorstep laptop repair Chennai",
    "desktop computer repair",
    "personal computer repair",
    "gaming PC repair",
    "workstation repair",
    "motherboard repair",
    "SSD upgrade",
    "RAM replacement",
    "computer technician Chennai",
    "genuine spare parts",
    "transparent pricing",
    "same-day computer repair"
  ],
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: {
    canonical: "https://www.itfixer199.com/",
  },
  openGraph: {
    type: "website",
    title: "Best PC Repair Service in Chennai for All Brands | IT Fixer @199",
    description:
      "Doorstep laptop, desktop and gaming PC repair service in Chennai from ₹199 with fast diagnosis, genuine spare parts and same-day support.",
    url: "https://www.itfixer199.com/",
    siteName: "IT Fixer @199",
    locale: "en_IN",
    images: [
      {
        url: "/logo.png",
        alt: "IT Fixer @199 doorstep laptop and computer repair service in Chennai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best PC Repair Service in Chennai for All Brands | IT Fixer @199",
    description:
      "Book doorstep laptop, desktop and gaming PC repair service in Chennai from ₹199 with genuine spares, upgrades and same-day support.",
    images: ["/logo.png",],
    site: "@itfixerat199",
  },
  other: {
    image_src: "/logo.png",
    "twitter:image:alt": "IT Fixer @199 laptop, desktop and gaming PC repair service in Chennai",
    "geo.region": "IN-TN",
    "geo.placename": "Ramapuram, Chennai, Tamil Nadu, India",
    "geo.country": "IN",
    "coverage": "Chennai, Tamil Nadu, India",
    "distribution": "local",
    "target": "Laptop repair customers, PC repair customers, gaming PC users, home users and office users in Chennai",
    "locality": "Ramapuram",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "country": "India",
    "service-area": "Ramapuram, Porur, Guindy, Ashok Nagar, Saidapet, KK Nagar, Ekkatuthangal, Chennai",
    "answer-engine-topic": "Doorstep laptop repair, PC repair, gaming computer service and computer maintenance in Chennai",
    "service-type": "On-site computer repair, laptop diagnosis, hardware troubleshooting, software troubleshooting, SSD upgrade, RAM upgrade",
    "business-type": "Computer repair service and doorstep IT support provider",
    "local-service-area": "Ramapuram, Porur, Guindy, Ashok Nagar, Saidapet, KK Nagar, Ekkatuthangal, Chennai"
  },
};

// 1. Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.itfixer199.com/#organization",
  "name": "IT Fixer @199",
  "url": "https://www.itfixer199.com/",
  "logo": "https://www.itfixer199.com/logo.png",
  "image": "https://www.itfixer199.com/og-image.jpg",
  "description": "IT Fixer @199 is a customer-first technology service platform offering doorstep laptop repair, desktop repair, on-site computer service, workstation repair, upgrades and PC repair service in Chennai.",
  "telephone": "+91 9385939985",
  "email": "info@itfixer199.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "46, 1st floor, Giri Rd, Satyamurthy Nagar, T. Nagar",
    "addressLocality": "Chennai",
    "addressRegion": "Tamil Nadu",
    "postalCode": "600017",
    "addressCountry": "IN"
  },
  "sameAs": [
    "https://www.facebook.com/itfixerat199",
    "https://www.instagram.com/it.fixerat_199",
    "https://www.youtube.com/@ITFixeAt199",
    "https://www.linkedin.com/company/it-fixer-at199/about/",
    "https://x.com/itfixerat199"
  ]
};

// 2. Service Schema
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.itfixer199.com/#service",
  "name": "Laptop Repair, Computer Service and PC Repair service in Chennai",
  "serviceType": "Laptop repair, desktop repair, gaming PC repair, workstation repair, on-site PC repair and computer maintenance",
  "description": "IT Fixer @199 provides laptop repair services in Chennai, computer service in Chennai, best PC repair service in Chennai, on-site PC repair in Chennai, hardware diagnosis, software troubleshooting, SSD upgrades, RAM replacement, virus removal and genuine spare part replacement.",
  "provider": {
    "@id": "https://www.itfixer199.com/#organization"
  },
  "areaServed": [
    "Ramapuram",
    "Porur",
    "Guindy",
    "Ashok Nagar",
    "Saidapet",
    "KK Nagar",
    "Ekkatuthangal",
    "Chennai"
  ],
  "offers": {
    "@type": "Offer",
    "url": "https://www.itfixer199.com/",
    "price": "199",
    "priceCurrency": "INR",
    "description": "Service visit starts from ₹199. Hardware parts are billed separately with transparent pricing.",
    "availability": "https://schema.org/InStock"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "IT Fixer @199 Computer Repair Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Laptop Repair Services"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Desktop Computer Repair"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Gaming PC Repair"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "On-Site PC Repair"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "SSD Upgrade and RAM Replacement"
        }
      }
    ]
  }
};

// 3. Breadcrumb Schema
export const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": "https://www.itfixer199.com/#breadcrumb",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.itfixer199.com/"
    }
  ]
};

// 4. WebPage Schema
export const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.itfixer199.com/#webpage",
  "url": "https://www.itfixer199.com/",
  "name": "Best PC Repair Service in Chennai for All Brands | IT Fixer @199",
  "headline": "Best PC, Laptop Repair & On-Site Computer Services in Chennai",
  "description": "Book doorstep laptop, desktop and gaming PC repair in Chennai from ₹199 with fast diagnosis, genuine spares, upgrades and same-day support.",
  "inLanguage": "en-IN",
  "isPartOf": {
    "@type": "WebSite",
    "@id": "https://www.itfixer199.com/#website",
    "name": "IT Fixer @199",
    "url": "https://www.itfixer199.com/"
  },
  "about": {
    "@id": "https://www.itfixer199.com/#organization"
  },
  "primaryImageOfPage": {
    "@type": "ImageObject",
    "url": "https://www.itfixer199.com/og-image.jpg"
  },
  "breadcrumb": {
    "@id": "https://www.itfixer199.com/#breadcrumb"
  }
};

// 5. Local Business Schema
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": "https://www.itfixer199.com/#localbusiness",
  "name": "IT Fixer @199",
  "url": "https://www.itfixer199.com/",
  "image": "https://www.itfixer199.com/og-image.jpg",
  "logo": "https://www.itfixer199.com/logo.png",
  "description": "IT Fixer @199 offers doorstep laptop repair, desktop computer repair, gaming PC repair, workstation repair, on-site PC repair, spare part replacement and computer service in Chennai.",
  "telephone": "+91 9385939985",
  "email": "info@itfixer199.com",
  "priceRange": "₹199+",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "46, 1st floor, Giri Rd, Satyamurthy Nagar, T. Nagar",
    "addressLocality": "Chennai",
    "addressRegion": "Tamil Nadu",
    "postalCode": "600017",
    "addressCountry": "IN"
  },
  "areaServed": [
    {
      "@type": "Place",
      "name": "Ramapuram"
    },
    {
      "@type": "Place",
      "name": "Porur"
    },
    {
      "@type": "Place",
      "name": "Guindy"
    },
    {
      "@type": "Place",
      "name": "Ashok Nagar"
    },
    {
      "@type": "Place",
      "name": "Saidapet"
    },
    {
      "@type": "Place",
      "name": "KK Nagar"
    },
    {
      "@type": "Place",
      "name": "Ekkatuthangal"
    },
    {
      "@type": "Place",
      "name": "Chennai"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/itfixerat199",
    "https://www.instagram.com/it.fixerat_199",
    "https://www.youtube.com/@ITFixeAt199",
    "https://www.linkedin.com/company/it-fixer-at199/about/",
    "https://x.com/itfixerat199"
  ]
};


const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Which doorstep laptop service in Chennai can fix a broken screen or keyboard issue same day?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "IT Fixer @199 sends a technician to your location to diagnose screen, keyboard, and battery issues on the spot, with most common repairs completed during that same visit."
      }
    },
    {
      "@type": "Question",
      "name": "Is there an honest, affordable Laptop service in Chennai that doesn't add hidden charges?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "IT Fixer @199 charges a flat ₹199 visit fee covering inspection, diagnosis, and consultation — the technician confirms any repair cost before starting work, so there are no surprise add-ons."
      }
    },
    {
      "@type": "Question",
      "name": "How much does a genuine pc repair service in Chennai typically cost for a home visit?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Every visit starts at ₹199, which includes inspection and diagnosis; if a part needs replacing, the technician shares the exact cost upfront before any work begins."
      }
    },
    {
      "@type": "Question",
      "name": "What should I look for in the best PC repair service in Chennai for both laptops and desktops?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Look for transparent pricing, genuine spare parts, certified technicians, and doorstep visits — IT Fixer @199 covers laptops, desktops, and gaming PCs under one service with 5000+ customers served across 20+ locations."
      }
    },
    {
      "@type": "Question",
      "name": "Can a technician fix my gaming PC or desktop at home instead of a shop?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — our on-site PC repair in Chennai covers gaming PCs, desktops, and workstations, with technicians diagnosing hardware and software issues directly at your doorstep."
      }
    },
    {
      "@type": "Question",
      "name": "How quickly can I get same-day repair support in Chennai?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most common issues are resolved during the same visit when compatible spare parts are available, making our on-site PC repair in Chennai one of the fastest doorstep options for urgent repairs."
      }
    }
  ]
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* All JSON-LD Schemas injected cleanly */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Script
        id="localbusiness-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
      <Faq />
      <Footer />
    </div>
  )
}