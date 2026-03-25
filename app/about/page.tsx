'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Shield, Users, MapPin, Zap, CheckCircle, Smartphone, Laptop, Monitor, MousePointer, Settings, RefreshCw, Cpu, Star, Target, Eye, Sparkles, TrendingUp } from 'lucide-react'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-[#800000]/10 selection:text-[#800000]">
      <Header />

      <main className="flex-1">
        {/* Intro Section */}
        <section className="relative pt-20 pb-16 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#800000]/5 text-[#800000] text-xs font-black uppercase tracking-widest shadow-sm">
              <Sparkles className="w-4 h-4" />
              About Us
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-[#1a1c2e] tracking-tight leading-tight">
              About IT Fixer <span className="text-[#800000]">@199</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed italic">
              "A customer-first technology service platform delivering fast, reliable, and affordable onsite IT support - right at your doorstep."
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              {[
                { label: 'Happy Clients', value: '5000+' },
                { label: 'Locations', value: '20+' },
                { label: 'Spare Parts', value: '3000+' },
                { label: 'Starting Price', value: '₹199' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-slate-50 p-6 sm:p-8 rounded-3xl text-center space-y-2 border border-slate-100 hover:border-[#800000]/20 transition-all shadow-sm">
                  <p className="text-3xl sm:text-4xl font-black text-[#1a1c2e]">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-4">
                  <p className="text-[#800000] font-black uppercase tracking-widest text-sm text-center lg:text-left">Who We Are</p>
                  <h2 className="text-3xl sm:text-5xl font-black text-[#1a1c2e] leading-tight text-center lg:text-left">
                    Customer-first IT Support for everyone
                  </h2>
                  <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed text-left">
                    IT Fixer @199 is a customer-first technology service platform designed to provide fast, reliable, and affordable on-site IT support for all types of devices.
                  </p>
                  <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed text-left">
                    We specialize in servicing all branded laptops, desktops, gaming systems, and accessories, making professional technical support easily accessible to every customer.
                  </p>
                  <p className="text-base sm:text-lg font-bold text-[#1a1c2e] leading-relaxed text-left border-l-4 border-[#800000] pl-6 italic">
                    With a network of 3000+ spare parts readily available, our goal is to resolve issues quickly and efficiently - often on the spot, at the customer's location.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/3] sm:aspect-square bg-slate-100 rounded-[40px] sm:rounded-[60px] overflow-hidden shadow-2xl relative group">
                  <Image
                    src="/service-appliance.jpg"
                    alt="IT Fixer Team"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c2e]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-white space-y-1 sm:space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest bg-[#800000] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full inline-block shadow-lg">IT Fixer Team</p>
                    <p className="text-2xl sm:text-3xl font-black">Trusted Service</p>
                    <p className="text-xs sm:text-sm font-bold opacity-80 uppercase tracking-widest">5000+ happy customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* On-Site Service Model */}
        <section className="py-16 sm:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12 sm:mb-20 px-4">
              <h2 className="text-3xl sm:text-5xl font-black text-[#1a1c2e]">On-Site Service Model</h2>
              <p className="text-lg sm:text-xl text-slate-500 font-medium">We come to you - not the other way</p>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                At IT Fixer @199, convenience is key. For just ₹199, our trained technicians visit the customer's location, inspect the device, and fix the issue wherever possible.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {[
                { title: 'Doorstep service by expert technicians', icon: MapPin },
                { title: 'On-the-spot diagnosis and repair', icon: Zap },
                { title: 'Immediate issue resolution whenever possible', icon: RefreshCw },
                { title: 'Access to 3000+ spare parts for quick replacement', icon: Settings }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 sm:p-10 rounded-[30px] sm:rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-6">
                  <div className="w-12 h-12 sm:w-16 h-16 bg-[#800000]/5 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 sm:w-8 h-8 text-[#800000]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1a1c2e] leading-tight">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simple Pricing */}
        <section className="py-20 sm:py-32 bg-slate-50 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[40px] sm:rounded-[60px] p-8 sm:p-20 text-center space-y-10 sm:space-y-14 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden group">
              {/* Decorative light blob */}
              <div className="absolute top-0 right-0 -m-20 w-64 h-64 bg-[#800000]/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
              
              <div className="relative z-10 space-y-6 sm:space-y-8">
                <div className="space-y-3">
                  <h2 className="text-4xl sm:text-6xl font-black text-[#1a1c2e] tracking-tight">Simple Pricing</h2>
                  <p className="text-[#800000] font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs">The IT Fixer Standard</p>
                </div>

                <div className="py-10 sm:py-16 bg-slate-50/50 rounded-[40px] border border-slate-100/50">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-2">Service Visit Fee</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl sm:text-6xl font-black text-[#1a1c2e] opacity-40">₹</span>
                    <p className="text-8xl sm:text-[160px] font-black text-[#800000] leading-none tracking-tighter">199</p>
                  </div>
                </div>

                <p className="text-lg sm:text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
                  One flat fee covers everything below. Hardware parts billed separately and transparently.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto pt-4">
                  {['Device inspection', 'Issue diagnosis', 'Basic repair service', 'Technical consultation'].map((item) => (
                    <div key={item} className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-[#1a1c2e] font-black text-sm tracking-wide transition-all hover:border-[#800000]/30 hover:shadow-md">
                      <div className="w-8 h-8 bg-[#800000]/5 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-[#800000]" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>

                <div className="pt-10 border-t border-slate-100">
                  <p className="text-xs sm:text-sm text-slate-400 font-medium italic max-w-xl mx-auto leading-relaxed">
                    Hardware replacement? The cost of the component is charged separately - ensuring <span className="text-[#1a1c2e] font-black not-italic">complete transparency</span> with no hidden charges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coverage */}
        <section className="py-16 sm:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12 sm:mb-20">
              <h2 className="text-3xl sm:text-5xl font-black text-[#1a1c2e]">Coverage</h2>
              <p className="text-lg sm:text-xl text-slate-500 font-medium">Supporting a wide range of devices & services</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Devices Card */}
              <div className="bg-white p-8 sm:p-12 rounded-[40px] sm:rounded-[50px] shadow-sm space-y-8 sm:space-y-10 border border-slate-100">
                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#1a1c2e]">Devices We Support</h3>
                  <p className="text-slate-500 font-medium">All branded laptops and PCs</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: Laptop, text: 'All branded laptops' },
                    { icon: Monitor, text: 'Desktop PCs' },
                    { icon: TrendingUp, iconRaw: Zap, text: 'Gaming PCs' },
                    { icon: Cpu, text: 'Workstations' },
                    { icon: MousePointer, text: 'Computer accessories' }
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-100">
                        <item.icon className="w-5 h-5 text-[#800000]" />
                      </div>
                      <span className="font-bold text-[#1a1c2e] text-sm sm:text-base">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services Card */}
              <div className="bg-white p-8 sm:p-12 rounded-[40px] sm:rounded-[50px] shadow-sm space-y-8 sm:space-y-10 border border-slate-100">
                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#1a1c2e]">Services We Offer</h3>
                  <p className="text-slate-500 font-medium">Technical expertise you can trust</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    'Laptop & PC repair', 'Hardware replacement', 'Chip-level repair',
                    'RAM & storage upgrades', 'System optimization', 'Deep cleaning',
                    'Thermal paste', 'Complete diagnostics'
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
                      <CheckCircle className="w-4 h-4 sm:w-5 h-5 text-[#800000]" />
                      <span className="font-bold text-xs sm:text-sm tracking-wide text-[#1a1c2e]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Promise */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12 sm:mb-20">
              <h2 className="text-3xl sm:text-5xl font-black text-[#1a1c2e]">Our Promise</h2>
              <p className="text-lg sm:text-xl text-slate-500 font-medium">What you can always count on</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                { title: 'Affordable from ₹199', desc: 'Professional service at a price everyone can afford.' },
                { title: 'On-Site Repair', desc: 'We come to you - doorstep service across Chennai.' },
                { title: 'Transparent Pricing', desc: 'No hidden costs. All charges communicated upfront.' },
                { title: 'Skilled Technicians', desc: 'Experienced professionals trained on all major brands.' },
                { title: 'Genuine Spare Parts', desc: 'Original components from our 3000+ parts inventory.' },
                { title: 'Fast & Reliable', desc: 'Most repairs resolved on the same visit, same day.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-6 sm:p-10 rounded-[30px] sm:rounded-[40px] border border-slate-100 space-y-4 hover:border-[#800000]/30 transition-all">
                  <div className="w-10 h-10 sm:w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100">
                    <Star className="w-5 h-5 sm:w-6 h-6 text-[#800000]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#1a1c2e]">{item.title}</h3>
                  <p className="text-slate-400 font-medium text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Purpose */}
        <section className="py-16 sm:py-32 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16 sm:mb-20">
              <h2 className="text-3xl sm:text-5xl font-black text-[#1a1c2e]">Our Purpose</h2>
              <p className="text-lg sm:text-xl text-slate-500 font-medium">Mission & Vision</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
              <div className="bg-white p-10 sm:p-16 rounded-[40px] sm:rounded-[60px] shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-6 sm:space-y-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#800000]/5 rounded-[30px] flex items-center justify-center">
                  <Target className="w-8 h-8 sm:w-10 sm:h-10 text-[#800000]" />
                </div>
                <div className="space-y-4">
                  <p className="text-[#800000] font-black uppercase tracking-widest text-[10px] sm:text-xs">Our Mission</p>
                  <h3 className="text-2xl sm:text-4xl font-black text-[#1a1c2e]">Accessible IT repair for everyone</h3>
                  <p className="text-slate-500 font-medium text-base sm:text-lg leading-relaxed">
                    To provide accessible, affordable, and reliable on-site IT services, simplifying technology repair for every customer - regardless of location or technical knowledge.
                  </p>
                </div>
              </div>

              <div className="bg-white p-10 sm:p-16 rounded-[40px] sm:rounded-[60px] shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-6 sm:space-y-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-[30px] flex items-center justify-center">
                  <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-[#1a1c2e]" />
                </div>
                <div className="space-y-4">
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] sm:text-xs">Our Vision</p>
                  <h3 className="text-2xl sm:text-4xl font-black text-[#1a1c2e]">A trusted brand across segments</h3>
                  <p className="text-slate-500 font-medium text-base sm:text-lg leading-relaxed">
                    To become a trusted and widely accessible technology service brand, delivering fast, transparent, and high-quality support across all customer segments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
