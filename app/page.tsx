import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Categories } from '@/components/categories'

import { FeaturedServices } from '@/components/featured-services'
import { WhyUs } from '@/components/why-us'
import { Testimonials } from '@/components/testimonials'
import { Footer } from '@/components/footer'
import AboutSection from '@/components/AboutSection'
import Brands from '@/components/Brands'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
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
