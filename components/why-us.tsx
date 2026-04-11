'use client'

import Image from 'next/image'
import { Check, Zap, Smartphone, MapPin, CreditCard, Shield } from 'lucide-react'

const BENEFITS = [
  {
    icon: Zap,
    title: 'Same-Day Service',
    description: 'Get your laptop or PC repaired on the same day',
  },
  {
    icon: Smartphone,
    title: 'Instant Diagnosis',
    description: 'Quick and accurate issue identification',
  },
  {
    icon: MapPin,
    title: 'Doorstep Support',
    description: 'Technicians available across Chennai',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payment',
    description: 'Pay via cash, card, or UPI',
  },
  {
    icon: Shield,
    title: 'Genuine Parts',
    description: 'High-quality and original spare parts used',
  },
  {
    icon: Check,
    title: 'Reliable Service',
    description: 'Trusted by hundreds of happy customers',
  },
]

export function WhyUs() {
  return (
    <section className="py-10 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-bold text-foreground">
                Why Choose Us
              </h2>
              <p className="text-lg text-muted-foreground">
                Fast & Reliable Same-Day Laptop and PC Repair Services in Chennai.
                We ensure quick solutions with minimum downtime using genuine parts and expert technicians.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {BENEFITS.map((benefit) => {
                const IconComponent = benefit.icon
                return (
                  <div key={benefit.title} className="flex gap-4">

                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full  group">

              <div className="relative h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/serviceimage.png"
                  alt="Laptop Repair Service"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#101242]/40 to-transparent"></div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-[#101242] text-white rounded-2xl px-5 py-3 shadow-lg">
                <p className="font-bold text-sm">Starts at ₹199</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}