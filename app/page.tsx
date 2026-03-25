import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Categories } from '@/components/categories'

import { FeaturedServices } from '@/components/featured-services'
import { WhyUs } from '@/components/why-us'
import { Testimonials } from '@/components/testimonials'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Categories />
      {/* <AllProducts /> */}
      <FeaturedServices />
      <WhyUs />

      <Testimonials />
      <Footer />
    </div>
  )
}
