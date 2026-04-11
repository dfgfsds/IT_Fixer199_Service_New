'use client'

import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Customer',
    content: 'Quick laptop repair service in Chennai. Technician came on time and fixed everything perfectly!',
  },
  {
    id: 2,
    name: 'Amit Patel',
    role: 'Office User',
    content: 'Very professional PC repair service. Same-day support saved my work!',
  },
  {
    id: 3,
    name: 'Neha Kapoor',
    role: 'Freelancer',
    content: 'Super fast diagnosis and affordable pricing. Highly recommended IT Fixer!',
  },
]

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

export function Testimonials() {
  return (
    <section className="py-10 md:py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 space-y-12">

        {/* Header */}
        <div className="text-left md:text-center space-y-4">
          <span className="inline-block px-4 py-1 text-xs font-semibold tracking-widest uppercase rounded-full bg-[#821616]/10 text-[#821616] mb-4">
            Testimonials
          </span>

          <h2 className="text-3xl md:text-5xl font-bold text-[#101242]">
            What Our Customers Say
          </h2>
        </div>

        {/* Infinite Slider */}
        <div className="relative overflow-hidden">

          <div className="flex gap-6 animate-scroll">

            {[...TESTIMONIALS, ...TESTIMONIALS].map((item, index) => (
              <div
                key={index}
                className="min-w-[300px] sm:min-w-[350px] lg:min-w-[400px]"
              >
                <div className="bg-white rounded-3xl p-6 shadow-md border hover:shadow-xl transition h-[220px] flex flex-col justify-between">

                  {/* Top */}
                  <div>
                    {/* Stars + Google */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <GoogleIcon />
                    </div>

                    {/* Content */}
                    <p className="text-gray-600 italic text-sm">
                      "{item.content}"
                    </p>
                  </div>

                  {/* Bottom */}
                  <div className="border-t pt-3">
                    <p className="font-semibold text-[#101242]">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.role}</p>
                  </div>

                </div>
              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  )
}