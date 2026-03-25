'use client'

import { useState, useEffect, use } from 'react'
import { ProductCard } from '@/components/product-card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Package, Loader2 } from 'lucide-react'
import { useLocation } from '@/context/location-context'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'
import { useRouter } from 'next/navigation'
import { type Product } from '@/lib/products'

export default function CategorySinglePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { location } = useLocation()
    const router = useRouter()

    const [categories, setCategories] = useState<any[]>([])
    const [categoryName, setCategoryName] = useState('')
    const [services, setServices] = useState<Product[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

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
                        image: s.media_files?.[0]?.image_url || s.media?.[0]?.url || '/placeholder-service.jpg',
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
                        image: p.media?.[0]?.url || '/placeholder-product.jpg',
                        inStock: true,
                        rating: p.rating || 4.5,
                        reviews: p.reviews_count || 50,
                        badge: p.badge || 'Product'
                    }
                })
                setProducts(mappedProducts)

            } catch (error) {
                console.error("Error fetching category data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id, location?.lat, location?.lng])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-muted-foreground font-bold uppercase tracking-widest animate-pulse text-sm">
                        Finding best services & products near youx
                    </p>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="py-20 bg-muted/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Heading */}
                    <div className="mb-10 space-y-2">
                        <h1 className="text-4xl sm:text-5xl font-bold text-foreground capitalize">
                            {categoryName} <span className="text-primary">Experts & Supplies</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Professional-grade supplies and tools for your home
                        </p>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                type="button"
                                key={cat.id}
                                onClick={() => router.push(`/categories/${cat.id}`)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${cat.id.toString() === id
                                    ? 'bg-primary text-white shadow-md scale-105'
                                    : 'bg-white text-muted-foreground border border-border hover:border-primary/40 hover:text-primary'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Grids */}
                    <div className="space-y-16">
                        {/* Services Grid */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-medium text-foreground">Services in this Category</h2>
                            {services.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {services.map((service) => (
                                        <div key={service.id} className="animate-fade-in">
                                            <ProductCard product={service} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-muted-foreground border border-dashed rounded-2xl bg-white/50">
                                    <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">No services found in this category</p>
                                </div>
                            )}
                        </div>

                        {/* Products Grid */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-medium text-foreground">Products for this Category</h2>
                            {products.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {products.map((product) => (
                                        <div key={product.id} className="animate-fade-in">
                                            <ProductCard product={product} basePath="products" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-muted-foreground border border-dashed rounded-2xl bg-white/50">
                                    <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">No products found in this category</p>
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
