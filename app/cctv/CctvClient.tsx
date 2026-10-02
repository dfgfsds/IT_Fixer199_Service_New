'use client'

import { ProductCard } from '@/components/product-card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Camera } from 'lucide-react'
import servicesData from '@/constants/services-data.json'

export default function CctvClient() {
    const dummyCctvProducts = servicesData.cctv;
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 py-20 bg-muted/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Heading */}
                    <div className="mb-10 md:mb-16 space-y-2">
                        <div className="flex justify-center items-center gap-3 mb-4">
                            <div className="w-16 h-16 bg-[#101242]/10 rounded-2xl flex items-center justify-center">
                                <Camera className="w-8 h-8 text-[#101242]" />
                            </div>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-bold text-[#101242] text-center tracking-tight">
                            CCTV Solutions
                        </h1>
                        <p className="text-lg text-muted-foreground text-center font-medium">
                            Premium security cameras and installation services
                        </p>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {dummyCctvProducts.map((product) => (
                            <div key={product.id} className="animate-fade-in">
                                <ProductCard product={product as any} basePath="cctv" hidePrice={true} isCallAction={true} />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
