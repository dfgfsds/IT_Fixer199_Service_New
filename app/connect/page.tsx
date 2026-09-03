import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import {
  Laptop,
  Monitor,
  MapPin,
  Cpu,
  Settings,
  ShieldCheck,
  Gamepad2,
  Building2,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Star,
  ExternalLink,
  CheckCircle,
  Sparkles,
  GraduationCap,
  Briefcase,
  Home,
  Palette,
  Layers,
  ArrowRight,
  Globe,
  Share2
} from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'IT Fixer @199 Chennai | Computer & Laptop Repair Services Starting ₹199',
    description:
      'IT Fixer @199 offers affordable computer and laptop repair services in Chennai starting at ₹199. Get on-site computer support, hardware upgrades, virus removal, software troubleshooting, and expert IT assistance.',
    keywords: [
      'IT Fixer 199',
      'laptop repair Chennai',
      'computer service Chennai',
      'desktop repair Chennai',
      'on-site computer service',
      'doorstep laptop service',
      'hardware upgrade Chennai',
      'virus removal Chennai',
      'MacBook repair Chennai',
      'IT support Ramapuram'
    ],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: 'https://www.itfixer199.com/connect',
    },
    openGraph: {
      title: 'IT Fixer @199 Chennai | Computer & Laptop Repair Services Starting ₹199',
      description:
        'IT Fixer @199 offers affordable computer and laptop repair services in Chennai starting at ₹199. Get on-site computer support, hardware upgrades, virus removal, software troubleshooting, and expert IT assistance.',
      url: 'https://www.itfixer199.com/connect',
      siteName: 'IT Fixer @199',
      type: 'website',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: 'IT Fixer @199 Connect',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'IT Fixer @199 Chennai | Computer & Laptop Repair Services Starting ₹199',
      description:
        'IT Fixer @199 offers affordable computer and laptop repair services in Chennai starting at ₹199. Get on-site computer support, hardware upgrades, virus removal, software troubleshooting, and expert IT assistance.',
      images: ['/logo.png'],
      site: '@itfixerat199',
    },
    other: {
      image_src: '/logo.png',
    },
  }
}

export default function ConnectPage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.itfixer199.com/#organization',
    name: 'IT Fixer @199',
    url: 'https://www.itfixer199.com/',
    logo: 'https://www.itfixer199.com/logo.png',
    telephone: '+91 9385939985',
    sameAs: [
      'https://www.facebook.com/itfixerat199',
      'https://www.instagram.com/it.fixerat_199',
      'https://www.youtube.com/@ITFixeAt199',
      'https://www.linkedin.com/in/itfixerat199/'
    ]
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.itfixer199.com/#localbusiness',
    name: 'IT Fixer @199',
    url: 'https://www.itfixer199.com/',
    telephone: '+91 9385939985',
    priceRange: '₹199+',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No.91, Ground Floor, Kothari Nagar 2nd Main Road, Ramapuram',
      addressLocality: 'Chennai',
      addressRegion: 'Tamil Nadu',
      postalCode: '600089',
      addressCountry: 'IN'
    },
    sameAs: [
      'https://www.facebook.com/itfixerat199',
      'https://www.instagram.com/it.fixerat_199',
      'https://www.youtube.com/@ITFixeAt199',
      'https://www.linkedin.com/in/itfixerat199/'
    ]
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://www.itfixer199.com/connect/#webpage',
    url: 'https://www.itfixer199.com/connect',
    name: 'IT Fixer @199 Social Hub',
    description: 'Connect with IT Fixer @199 for computer repair, laptop repair, on-site computer services, and IT support in Chennai.'
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.itfixer199.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Social Hub',
        item: 'https://www.itfixer199.com/connect'
      }
    ]
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What services does IT Fixer @199 provide?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'IT Fixer @199 provides laptop repair, desktop repair, on-site computer services, hardware upgrades, software troubleshooting, virus removal, and IT support in Chennai.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you provide on-site computer services in Chennai?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. IT Fixer @199 offers doorstep computer and laptop repair services across Chennai.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much does a service visit cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Services start from just ₹199.'
        }
      },
      {
        '@type': 'Question',
        name: 'Which laptop brands do you repair?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We repair Dell, HP, Lenovo, Acer, Asus, Apple, MSI, and most major laptop brands.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you provide SSD and RAM upgrades?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We provide SSD upgrades, RAM upgrades, storage replacement, and performance optimization services.'
        }
      }
    ]
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Featured Services',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Laptop Repair Services'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Desktop Computer Repair'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'On-Site Computer Services'
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Hardware Upgrades'
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Software Troubleshooting'
      },
      {
        '@type': 'ListItem',
        position: 6,
        name: 'Virus & Malware Removal'
      },
      {
        '@type': 'ListItem',
        position: 7,
        name: 'Gaming PC Support'
      },
      {
        '@type': 'ListItem',
        position: 8,
        name: 'Business IT Support'
      }
    ]
  }

  const socialLinks = [
    {
      name: 'Website',
      handle: 'itfixer199.com',
      url: 'https://www.itfixer199.com/',
      icon: Globe,
      color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white',
      badge: 'Official Portal'
    },
    {
      name: 'Facebook',
      handle: '@itfixerat199',
      url: 'https://www.facebook.com/itfixerat199',
      icon: Share2,
      color: 'bg-blue-50 text-blue-600 hover:bg-[#1877F2] hover:text-white',
      badge: 'Community'
    },
    {
      name: 'Instagram',
      handle: '@it.fixerat_199',
      url: 'https://www.instagram.com/it.fixerat_199',
      icon: Sparkles,
      color: 'bg-pink-50 text-pink-600 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white',
      badge: 'Updates & Tips'
    },
    {
      name: 'YouTube',
      handle: '@ITFixeAt199',
      url: 'https://www.youtube.com/@ITFixeAt199',
      icon: Monitor,
      color: 'bg-red-50 text-red-600 hover:bg-[#FF0000] hover:text-white',
      badge: 'Repair Guides'
    },
    {
      name: 'LinkedIn',
      handle: 'IT Fixer @199',
      url: 'https://www.linkedin.com/in/itfixerat199/',
      icon: Briefcase,
      color: 'bg-sky-50 text-sky-700 hover:bg-[#0A66C2] hover:text-white',
      badge: 'Professional'
    },
    {
      name: 'Google Maps',
      handle: 'Ramapuram, Chennai',
      url: 'https://maps.app.goo.gl/buadQw61U4bJVugY6',
      icon: MapPin,
      color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white',
      badge: 'Store Directions'
    }
  ]

  const featuredServices = [
    {
      title: 'Laptop Repair Services',
      description: 'Fast diagnosis and repair for all major laptop brands.',
      icon: Laptop,
    },
    {
      title: 'Desktop Computer Repair',
      description: 'Reliable troubleshooting and repair for home and office PCs.',
      icon: Monitor,
    },
    {
      title: 'On-Site Computer Services',
      description: 'Professional technicians visit your location anywhere in Chennai.',
      icon: MapPin,
    },
    {
      title: 'Hardware Upgrades',
      description: 'SSD upgrades, RAM upgrades, motherboard support, and performance enhancements.',
      icon: Cpu,
    },
    {
      title: 'Software Troubleshooting',
      description: 'Operating system issues, driver problems, software installation, and optimization.',
      icon: Settings,
    },
    {
      title: 'Virus & Malware Removal',
      description: 'Protect your data and restore your system performance.',
      icon: ShieldCheck,
    },
    {
      title: 'Gaming PC Support',
      description: 'Hardware troubleshooting, upgrades, cooling solutions, and optimization.',
      icon: Gamepad2,
    },
    {
      title: 'Business IT Support',
      description: 'Technology assistance for offices, startups, and small businesses.',
      icon: Building2,
    }
  ]

  const targetAudiences = [
    {
      title: 'Students',
      description: 'Affordable laptop repair and computer maintenance for online learning and projects.',
      icon: GraduationCap,
    },
    {
      title: 'Working Professionals',
      description: 'Quick solutions to minimize downtime and keep productivity high.',
      icon: Briefcase,
    },
    {
      title: 'Home Users',
      description: 'Reliable support for everyday computing problems and upgrades.',
      icon: Home,
    },
    {
      title: 'Small Businesses',
      description: 'Cost-effective IT assistance without maintaining an in-house technical team.',
      icon: Building2,
    },
    {
      title: 'Gamers',
      description: 'Performance tuning, upgrades, and gaming PC troubleshooting.',
      icon: Gamepad2,
    },
    {
      title: 'Freelancers & Creators',
      description: 'Workstation optimization and hardware support for creative workloads.',
      icon: Palette,
    },
    {
      title: 'Corporate Offices',
      description: 'Professional desktop and laptop maintenance services for teams and employees.',
      icon: Layers,
    }
  ]

  const businessHours = [
    { day: 'Monday', time: 'Open 24 hours' },
    { day: 'Tuesday', time: 'Open 24 hours' },
    { day: 'Wednesday', time: 'Open 24 hours' },
    { day: 'Thursday', time: 'Open 24 hours' },
    { day: 'Friday', time: 'Open 24 hours' },
    { day: 'Saturday', time: 'Open 24 hours' },
    { day: 'Sunday', time: 'Open 24 hours' }
  ]

  const faqs = [
    {
      q: 'What services does IT Fixer @199 provide?',
      a: 'IT Fixer @199 provides laptop repair, desktop repair, on-site computer services, hardware upgrades, software troubleshooting, virus removal, gaming PC support, and business IT services across Chennai.'
    },
    {
      q: 'Do you offer doorstep computer repair services in Chennai?',
      a: 'Yes. Our technicians visit your home or office to diagnose and resolve computer and laptop issues without requiring you to visit a service center.'
    },
    {
      q: 'How much does an IT Fixer @199 service visit cost?',
      a: 'Our on-site computer service starts at just ₹199, making professional technical support affordable and accessible.'
    },
    {
      q: 'Which laptop brands do you repair?',
      a: 'We repair major brands including Dell, HP, Lenovo, Acer, Asus, Apple, MSI, and many others.'
    },
    {
      q: 'Can you repair both laptops and desktop computers?',
      a: 'Yes. We provide repair, maintenance, upgrades, and troubleshooting services for both laptops and desktop PCs.'
    },
    {
      q: 'Do you provide SSD and RAM upgrades?',
      a: 'Yes. We offer SSD upgrades, RAM upgrades, storage replacement, and performance optimization services.'
    },
    {
      q: 'How quickly can my computer be repaired?',
      a: 'Many common issues can be diagnosed and resolved during the first visit. Repair time depends on the nature of the problem and spare part availability.'
    },
    {
      q: 'Do you provide services for businesses and offices?',
      a: 'Yes. We support small businesses, startups, offices, professionals, and corporate environments throughout Chennai.'
    },
    {
      q: 'Is WhatsApp support available?',
      a: 'Yes. Customers can contact our support team directly through WhatsApp for service inquiries and bookings.'
    },
    {
      q: 'Why choose IT Fixer @199?',
      a: 'Customers choose IT Fixer @199 because of our affordable pricing, on-site convenience, experienced technicians, transparent service process, and commitment to customer satisfaction.'
    }
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-[#101242]/10 selection:text-[#101242]">
      {/* Schemas */}
      <Script
        id="connect-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="connect-localbusiness-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Script
        id="connect-webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Script
        id="connect-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="connect-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="connect-itemlist-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-16 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 border-b border-slate-100 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#101242]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#800000]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#101242]/5 border border-[#101242]/10 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-[#101242] tracking-wide">
                  IT Fixer @199 – Chennai’s Trusted Computer &amp; Laptop Service Partner
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#101242] tracking-tight leading-[1.15]">
                Fast, Reliable &amp; Affordable Computer Services in Chennai Starting at <span className="text-[#800000]">₹199</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                Looking for professional laptop repair, desktop repair, or on-site computer services in Chennai? IT Fixer @199 brings expert technology support directly to your doorstep. Whether you need a quick laptop fix, hardware upgrade, software troubleshooting, virus removal, or complete PC maintenance, our skilled technicians provide fast and transparent service starting at just ₹199.
              </p>

              <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
                With thousands of satisfied customers across Chennai, IT Fixer @199 helps individuals, students, professionals, businesses, and gamers keep their devices running smoothly without the hassle of visiting a service center.
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="tel:+919385939985"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#101242] hover:bg-[#800000] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  Call Now: +91 9385939985
                </a>
                <a
                  href="https://wa.me/919385939985"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp Support
                </a>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#101242] font-bold text-sm sm:text-base border border-slate-200 transition-all active:scale-95"
                >
                  Book Service @ ₹199
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Badges bar */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Doorstep On-Site Service
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> 100% Genuine Spare Parts
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> 24/7 Support Available
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Connect With IT Fixer @199 (Social Hub) */}
        <section className="py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101242]/5 text-[#101242] text-xs font-bold uppercase tracking-wider">
                <Share2 className="w-3.5 h-3.5" /> Official Channels
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#101242]">
                Connect With IT Fixer @199
              </h2>
              <p className="text-slate-500 font-medium text-sm sm:text-base max-w-2xl mx-auto">
                Stay connected with us for technology tips, service updates, repair solutions, and special offers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {socialLinks.map((item, idx) => {
                const IconComponent = item.icon
                return (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-slate-50 hover:bg-white p-6 rounded-2xl sm:rounded-3xl border border-slate-100 hover:border-[#101242]/20 hover:shadow-xl transition-all duration-300 flex items-start justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${item.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                          {item.badge}
                        </span>
                        <h3 className="text-lg font-bold text-[#101242] group-hover:text-[#800000] transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{item.handle}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white group-hover:bg-[#101242] text-slate-400 group-hover:text-white flex items-center justify-center border border-slate-200 group-hover:border-[#101242] transition-all shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section className="py-12 sm:py-20 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101242]/5 text-[#101242] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> What We Do
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#101242]">
                Featured Services
              </h2>
              <p className="text-slate-500 font-medium text-sm sm:text-base max-w-2xl mx-auto">
                Comprehensive hardware and software solutions delivered right at your doorstep.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredServices.map((service, idx) => {
                const IconComponent = service.icon
                return (
                  <div
                    key={idx}
                    className="bg-white p-6 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#101242]/20 transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#101242]/5 text-[#101242] flex items-center justify-center group-hover:bg-[#101242] group-hover:text-white transition-colors duration-300">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#101242] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#101242]">
                      <span>Starting at ₹199</span>
                      <Link href="/services" className="inline-flex items-center gap-1 hover:text-[#800000] transition-colors">
                        Book Now <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Leave a Review & Visit Store Combined Section */}
        <section className="py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
              {/* Leave a Review */}
              <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-8 sm:p-10 rounded-3xl border border-amber-200/60 flex flex-col justify-between shadow-sm relative overflow-hidden">
                <div className="space-y-6">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#101242]">
                      Leave a Google Review
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                      Your feedback helps us improve and assists other customers in finding trusted computer repair services in Chennai. If you've used our services, we'd love to hear about your experience.
                    </p>
                  </div>
                </div>

                <div className="pt-8">
                  <a
                    href="https://maps.app.goo.gl/buadQw61U4bJVugY6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#101242] hover:bg-[#800000] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    Write a Review
                  </a>
                </div>
              </div>

              {/* Visit Our Store */}
              <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-sm">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101242]/10 text-[#101242] text-xs font-bold uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" /> Physical Center
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#101242]">
                      Visit Our Store
                    </h2>
                    <div className="space-y-1 text-slate-700 font-bold text-sm sm:text-base">
                      <p className="text-[#101242] font-black text-lg">IT Fixer @199</p>
                      <p className="font-medium text-slate-600">No.91, Ground Floor,</p>
                      <p className="font-medium text-slate-600">Kothari Nagar 2nd Main Road, Ramapuram,</p>
                      <p className="font-medium text-slate-600">Chennai – 600089</p>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium pt-2 leading-relaxed">
                      Visit us for professional computer support, hardware upgrades, system diagnostics, and expert technical assistance.
                    </p>
                  </div>
                </div>

                <div className="pt-8">
                  <a
                    href="https://maps.app.goo.gl/buadQw61U4bJVugY6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-[#101242] border border-slate-300 font-bold text-sm shadow-sm transition-all active:scale-95"
                  >
                    <MapPin className="w-4 h-4 text-[#101242]" />
                    Get Directions on Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information & Business Hours */}
        <section className="py-12 sm:py-20 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Channels */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#101242] mb-2">
                    Contact Information
                  </h2>
                  <p className="text-slate-500 font-medium text-sm">
                    Reach out directly to our dedicated technical assistance team.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {/* Phone */}
                  <a
                    href="tel:+919385939985"
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-[#101242]/30 transition-all block group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#101242] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Phone className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Customer Support</p>
                    <p className="text-sm sm:text-base font-bold text-[#101242] group-hover:text-[#800000] transition-colors">+91 9385939985</p>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:info@itfixer199.com"
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-[#101242]/30 transition-all block group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Support</p>
                    <p className="text-sm sm:text-base font-bold text-[#101242] group-hover:text-[#800000] transition-colors truncate">info@itfixer199.com</p>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/919385939985"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-[#101242]/30 transition-all block group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">WhatsApp Support</p>
                    <p className="text-sm sm:text-base font-bold text-[#101242] group-hover:text-[#800000] transition-colors">+91 9385939985</p>
                  </a>
                </div>

                {/* Info Card */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-[#101242] mb-2">Get the Right Technology for Your Needs</h3>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed mb-3">
                    Technology should make life easier, not more complicated.
                  </p>
                  <p className="text-slate-500 text-xs sm:text-sm font-normal leading-relaxed mb-3">
                    At IT Fixer @199, we help customers choose the right repair solution, upgrade path, or hardware replacement based on their actual requirements. Our team focuses on honest recommendations, transparent pricing, and practical solutions that save both time and money.
                  </p>
                  <p className="text-slate-500 text-xs sm:text-sm font-normal leading-relaxed">
                    From laptop repairs and desktop servicing to performance upgrades and business IT support, we're committed to delivering dependable technology services throughout Chennai.
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-[#101242]">Business Hours</h2>
                      <p className="text-xs text-emerald-600 font-bold">● 24/7 Available for Emergencies</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {businessHours.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 text-xs sm:text-sm">
                        <span className="font-bold text-slate-700">{item.day}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs">
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <a
                    href="tel:+919385939985"
                    className="w-full py-3 rounded-2xl bg-[#101242] hover:bg-[#800000] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call for 24/7 Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who Can Benefit From IT Fixer Computers? */}
        <section className="py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101242]/5 text-[#101242] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Targeted Solutions
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#101242]">
                Who Can Benefit From IT Fixer Computers?
              </h2>
              <p className="text-slate-500 font-medium text-sm sm:text-base max-w-2xl mx-auto">
                Tailored computer repair and IT support customized for every type of user in Chennai.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {targetAudiences.map((item, idx) => {
                const IconComponent = item.icon
                return (
                  <div
                    key={idx}
                    className="bg-slate-50 p-6 rounded-2xl sm:rounded-3xl border border-slate-100 hover:border-[#101242]/20 hover:bg-white transition-all duration-300 shadow-sm space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white text-[#101242] flex items-center justify-center border border-slate-200 shadow-xs">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#101242]">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Call To Action Banner */}
        <section className="py-12 sm:py-16 bg-[#101242] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -m-20 w-96 h-96 bg-[#800000]/20 rounded-full blur-3xl" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Need Computer Support Today?
            </h2>
            <p className="text-slate-300 text-sm sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              Whether your laptop won't start, your desktop is running slow, or you need expert technical assistance, IT Fixer @199 is ready to help.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="tel:+919385939985"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-slate-100 text-[#101242] font-black text-sm sm:text-base shadow-xl transition-all active:scale-95"
              >
                <Phone className="w-4 h-4" />
                Call Now: +91 9385939985
              </a>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#800000] hover:bg-[#a00000] text-white font-bold text-sm sm:text-base shadow-xl transition-all active:scale-95"
              >
                Book Your Service Starting at ₹199
              </Link>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions (AEO Optimized) */}
        <section className="py-12 sm:py-20 bg-slate-50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101242]/5 text-[#101242] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> AEO Optimized
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#101242]">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-500 font-medium text-sm sm:text-base">
                Everything you need to know about IT Fixer @199 services in Chennai.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm open:shadow-md transition-all duration-200"
                >
                  <summary className="font-bold text-slate-800 group-open:text-[#101242] text-base sm:text-lg cursor-pointer flex items-center justify-between list-none">
                    <span className="pr-4">{faq.q}</span>
                    <span className="w-7 h-7 rounded-full bg-slate-100 group-open:bg-[#101242] text-slate-500 group-open:text-white flex items-center justify-center shrink-0 transition-colors">
                      +
                    </span>
                  </summary>
                  <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed mt-4 pt-4 border-t border-slate-100">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
