'use client'

import { ArrowRight, MapPin, Zap } from 'lucide-react'
import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 order-2 md:order-1">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">Trending Today</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-pretty">
                Professional Services
                <span className="block text-primary">Made Simple</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Book trusted home service experts instantly. From cleaning to repairs, get quality work done right at your doorstep.
              </p>
            </div>

            {/* Search Bar */}
            {/* <div className="pt-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-3 bg-muted rounded-xl p-4 border border-border/50 hover:border-accent/50 transition-colors">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter your location"
                    className="flex-1 outline-none bg-transparent text-foreground placeholder-muted-foreground"
                  />
                </div>
                <button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg whitespace-nowrap">
                  Search Services
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div> */}

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-secondary">10M+</p>
                <p className="text-sm text-muted-foreground mt-1">Happy Customers</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-secondary">50K+</p>
                <p className="text-sm text-muted-foreground mt-1">Verified Experts</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-accent">4.8★</p>
                <p className="text-sm text-muted-foreground mt-1">Top Rated</p>
              </div>
            </div>
          </div>

          {/* Right Visual - Hero Image */}
          <div className="relative order-2 md:order-1 h-[300px] sm:h-[400px] md:h-[550px] w-full md:w-[700px]  overflow-hidden">
            <Image
              src="/hero.jpeg"
              alt="Professional home services"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              priority
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
