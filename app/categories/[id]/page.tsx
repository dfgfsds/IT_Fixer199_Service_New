'use client'

import { useState, useEffect, use } from 'react'
import { ProductCard } from '@/components/product-card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Package, Loader2, MapPin, Navigation, Sparkles } from 'lucide-react'
import { ServiceCard } from '@/components/service-card'
import { useLocation } from '@/context/location-context'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'
import { useRouter } from 'next/navigation'
import { type Product } from '@/lib/products'
import { safeErrorLog } from '@/lib/error-handler'

export default function CategorySinglePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { location, setShowLocationModal } = useLocation()
    const router = useRouter()

    const [categories, setCategories] = useState<any[]>([])
    const [categoryName, setCategoryName] = useState('')
    const [services, setServices] = useState<Product[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Clear state immediately when ID or Location changes
    useEffect(() => {
        setServices([])
        setProducts([])
        setError(null)
    }, [id, location?.lat, location?.lng])

    useEffect(() => {
        const fetchData = async () => {
            if (!location?.lat || !location?.lng) return

            setLoading(true)
            try {
                // Fetch Categories for heading and tabs
                const catRes = await axiosInstance.get(Api.categories)
                const cats = catRes.data?.data || []
                setCategories(cats)
                const currentCat = cats.find((c: any) => c.id.toString() === id)
                setCategoryName(currentCat ? currentCat.name : 'Category')

                // Fetch Services
                const servicesRes = await axiosInstance.get(Api.services, {
                    params: {
                        category_id: id,
                        lat: location.lat,
                        lng: location.lng,
                        include_categories: true,
                        include_media: true,
                        include_pricing: true
                    }
                })
                const servicesData = servicesRes.data?.services || []
                const mappedServices = servicesData.map((s: any) => {
                    const sellingPrice = s.pricing_models?.find((p: any) => p.pricing_type_name === "Selling Price")?.price || 0
                    const regularPrice = s.pricing_models?.find((p: any) => p.pricing_type_name === "Regular Price")?.price
                    return {
                        id: s.id,
                        name: s.name,
                        category: s.categories?.[0]?.name || 'Service',
                        price: Number(sellingPrice),
                        originalPrice: regularPrice ? Number(regularPrice) : undefined,
                        image: s.media_files?.[0]?.image_url || s.media?.[0]?.url || '/placeholder-image.jpg',
                        inStock: s.status === "ACTIVE",
                        rating: s.rating || 4.5,
                        reviews: s.reviews_count || 100,
                        badge: s.badge || 'Service'
                    }
                })
                setServices(mappedServices)

                // Fetch Products
                const productsRes = await axiosInstance.get(Api.products, {
                    params: {
                        category_id: id,
                        lat: location.lat,
                        lng: location.lng,
                        include_pricing: true,
                        include_media: true
                    }
                })
                const productsData = productsRes.data?.products || []
                const mappedProducts = productsData.map((p: any) => {
                    const sellingPrice = p.pricing?.[0]?.price || 0
                    const regularPrice = p.pricing?.[0]?.regular_price || 0
                    return {
                        id: p.id,
                        name: p.name,
                        category: p.category_name || 'Product',
                        price: Number(sellingPrice),
                        originalPrice: regularPrice ? Number(regularPrice) : undefined,
                        image: p.media?.[0]?.url || '/placeholder-image.jpg',
                        inStock: true,
                        rating: p.rating || 4.5,
                        reviews: p.reviews_count || 50,
                        badge: p.badge || 'Product'
                    }
                })
                setProducts(mappedProducts)

            } catch (error: any) {
                safeErrorLog("Error fetching category data", error)
                // If API fails (e.g. out of zone), ensure we don't show old data
                setServices([])
                setProducts([])
                setError(error.response?.data?.message || 'Content not available at this location.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id, location?.lat, location?.lng])

    if (!location?.lat || !location?.lng) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-center py-12 sm:py-20 p-8 space-y-8 bg-white rounded-[40px] border border-dashed border-slate-200 w-full max-w-3xl shadow-sm">
                        <div className="relative">
                            <div className="w-24 h-24 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto">
                                <MapPin className="w-10 h-10" />
                            </div>
                            <div className="absolute inset-0 blur-xl bg-primary/5 rounded-full"></div>
                        </div>
                        <div className="space-y-3 max-w-sm mx-auto">
                            <h3 className="text-2xl font-black text-[#1a1c2e] uppercase tracking-tight">Location Required</h3>
                            <p className="text-slate-500 font-medium">To show you available services & products and accurate pricing, please select your city.</p>
                        </div>
                        <button
                            onClick={() => setShowLocationModal(true)}
                            className="px-10 py-4 bg-[#101242] text-white rounded-2xl font-black tracking-widest uppercase shadow-xl shadow-[#101242]/20 hover:bg-[#101242]/90 transition-all active:scale-95 flex items-center gap-3"
                        >
                            <Navigation className="w-5 h-5 text-white/50" />
                            Select Your Location
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-muted-foreground font-bold uppercase tracking-widest animate-pulse text-sm">
                        Finding best services & products near you
                    </p>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="flex-1 pb-24">
                {/* Hero Section */}
                <section className="bg-white py-20 px-4 border-b border-slate-100">
                    <div className="max-w-7xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#101242]/5 text-[#101242] text-xs font-black uppercase tracking-widest shadow-sm">
                            <Sparkles className="w-4 h-4" />
                            {categoryName} Experts in {location?.city || 'your city'}
                        </div>
                        <h1 className="text-5xl sm:text-6xl font-black text-[#1a1c2e] tracking-tight leading-tight capitalize">
                            {categoryName} <span className="text-[#101242]">Collection</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
                            Handpicked professional services and high-quality products specifically for your {categoryName.toLowerCase()} needs.
                        </p>

                        {/* Category Tabs */}
                        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 justify-center pt-8">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => router.push(`/categories/${cat.id}`)}
                                    className={`px-8 py-3.5 rounded-2xl text-sm font-black tracking-widest uppercase transition-all whitespace-nowrap border-2 ${cat.id.toString() === id
                                        ? 'bg-[#101242] border-[#101242] text-white shadow-xl shadow-[#101242]/20 scale-105'
                                        : 'bg-white border-white text-slate-500 hover:border-slate-100 hover:bg-slate-50'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

                    {/* Grids */}
                    <div className="space-y-24">
                        {/* Services Grid */}
                        <div className="space-y-10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest">
                                    Available Services ({services.length})
                                </h2>
                            </div>

                            {services.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
                                    {services.map((service: any) => (
                                        <div key={service.id} className="animate-fade-in">
                                            <ServiceCard service={service} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200 space-y-4">
                                    <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto">
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No services found in this category</p>
                                </div>
                            )}
                        </div>

                        {/* Products Grid */}
                        <div className="space-y-10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest">
                                    Essential Products ({products.length})
                                </h2>
                            </div>

                            {products.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
                                    {products.map((product) => (
                                        <div key={product.id} className="animate-fade-in">
                                            <ProductCard product={product} basePath="products" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200 space-y-4">
                                    <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto">
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No products found in this category</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
