'use client'

import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Homeowner',
    content: 'Best service experience ever! The expert was punctual, professional, and did an excellent job. Highly recommend!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Amit Patel',
    role: 'Office Manager',
    content: 'We book monthly cleaning services. Very consistent quality and reliable. Worth every penny!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Neha Kapoor',
    role: 'Young Professional',
    content: 'Amazing app, super convenient! I was able to book a service in 2 minutes. Great value for money.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Rohan Singh',
    role: 'Business Owner',
    content: 'Emergency plumbing repair at midnight. They responded immediately. Saved my day!',
    rating: 5,
  },
  {
    id: 5,
    name: 'Suresh Kumar',
    role: 'Property Owner',
    content: 'Excellent deep cleaning service. The team was very thorough and polite.',
    rating: 5,
  },
  {
    id: 6,
    name: 'Meera Reddy',
    role: 'Home Maker',
    content: 'Reliable and affordable appliance repair. Will definitely use again!',
    rating: 5,
  },
]

const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
  </svg>
)

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    loop: true,
    skipSnaps: false,
    dragFree: true
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                <GoogleIcon />
                <span className="text-sm font-semibold text-slate-600">Rated 4.8/5 on Google</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
                Trusted by thousands of <span className="text-[#800000]">Happy Customers</span>
              </h2>
            </div>
            
            {/* Nav Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={scrollPrev}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={scrollNext}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Carousel Viewport */}
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex -ml-6">
              {TESTIMONIALS.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-6"
                >
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col group">
                    {/* Rating & Platform */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                      <GoogleIcon />
                    </div>

                    {/* Content */}
                    <blockquote className="flex-1">
                      <p className="text-slate-700 text-lg leading-relaxed italic mb-8">
                        "{testimonial.content}"
                      </p>
                    </blockquote>

                    {/* Author & Footer */}
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-[#800000] transition-colors">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-slate-500">{testimonial.role}</p>
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Verified Review
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots & Stats */}
          <div className="space-y-16">
            {/* Pagination Dots */}
            <div className="flex justify-center gap-2">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`h-2 transition-all rounded-full ${
                    index === selectedIndex ? 'w-8 bg-[#800000]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 py-16 border-t border-slate-200">
              <div className="text-center space-y-1">
                <p className="text-5xl font-extrabold text-[#1a1c2e]">10M+</p>
                <p className="text-slate-500 font-medium">Services Completed</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-5xl font-extrabold text-[#800000]">4.8★</p>
                <p className="text-slate-500 font-medium">Average Rating</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-5xl font-extrabold text-[#1a1c2e]">50K+</p>
                <p className="text-slate-500 font-medium">Experts Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
