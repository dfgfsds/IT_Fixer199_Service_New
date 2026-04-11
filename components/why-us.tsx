'use client'

import { Check, Zap, Smartphone, MapPin, CreditCard, Shield } from 'lucide-react'

const BENEFITS = [
  {
    icon: Zap,
    title: 'Super Fast',
    description: 'Get services booked in under 30 seconds',
  },
  {
    icon: Smartphone,
    title: 'Easy Booking',
    description: 'Simple mobile-first experience',
  },
  {
    icon: MapPin,
    title: 'Nearby Experts',
    description: 'Verified professionals near you',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payment',
    description: 'Pay cash, card, or wallet',
  },
  {
    icon: Shield,
    title: 'Verified & Safe',
    description: 'All experts verified and insured',
  },
  {
    icon: Check,
    title: 'Satisfaction',
    description: '100% satisfaction guaranteed',
  },
]

export function WhyUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                Why Choose IT Fixer?
              </h2>
              <p className="text-lg text-muted-foreground">
                We make professional home services accessible, affordable, and convenient for everyone.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {BENEFITS.map((benefit) => {
                const IconComponent = benefit.icon
                return (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/10 text-accent">
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              {/* Main Card */}
              <div className="bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-3xl p-8 shadow-2xl">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold opacity-80">Your Booking</p>
                    <h3 className="text-2xl font-bold">Home Cleaning</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-80">Expert</span>
                      <span className="font-semibold">Rajesh Kumar</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-80">Rating</span>
                      <span className="font-semibold">⭐ 4.9 (2456)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-80">Time</span>
                      <span className="font-semibold">2-3 Hours</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-80">Date</span>
                      <span className="font-semibold">Tomorrow, 10 AM</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm opacity-80">Subtotal</span>
                      <span>₹499</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm opacity-80">Discount</span>
                      <span className="text-accent font-semibold">-₹99</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹400</span>
                    </div>
                  </div>

                  <button className="w-full bg-accent hover:bg-accent/90 text-secondary font-semibold py-3 rounded-xl transition-colors">
                    Confirm Booking
                  </button>
                </div>
              </div>

              {/* Floating Element */}
              <div className="absolute -bottom-6 -right-6 bg-accent text-white rounded-2xl p-4 shadow-lg">
                <p className="font-bold text-2xl">₹400</p>
                <p className="text-xs opacity-90">Total Cost</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
