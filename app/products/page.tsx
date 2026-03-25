'use client'

import { useState, useEffect, useMemo } from 'react'
import { ProductCard } from '../../components/product-card'
import { Header } from '../../components/header'
import { Footer } from '../../components/footer'
import { Package, Loader2 } from 'lucide-react'
import { useLocation } from '@/context/location-context'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'

export default function AllProductsPage() {
    const { location } = useLocation()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('All')

    useEffect(() => {
        const fetchProducts = async () => {
            if (!location?.lat || !location?.lng) return

            setLoading(true)
            try {
                const response = await axiosInstance.get(Api.products, {
                    params: {
                        lat: location.lat,
                        lng: location.lng,
                        include_pricing: true,
                        include_media: true,
                        include_category: true
                    }
                })

                const productsData = response.data?.products || []
                const mappedProducts = productsData.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    category: p.category_name || p.category?.name || 'Uncategorized',
                    price: Number(p.pricing?.[0]?.price || 0),
                    originalPrice: p.pricing?.[0]?.regular_price ? Number(p.pricing?.[0]?.regular_price) : undefined,
                    image: p.media?.[0]?.url || '/placeholder.jpg',
                    inStock: true,
                    rating: p.rating || 4.5,
                    reviews: p.reviews_count || 50,
                    badge: p.badge || 'New'
                }))
                setProducts(mappedProducts)
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [location?.lat, location?.lng])

    const CATEGORIES = useMemo(() => {
        const categories = Array.from(new Set(products.map(p => p.category)))
        return ['All', ...categories]
    }, [products])

    const filtered = products.filter(p => selectedCategory === 'All' || p.category === selectedCategory)

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="py-20 bg-muted/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Heading */}
                    <div className="mb-10 space-y-2">
                        <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                            Home Care <span className="text-primary">Products</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Professional-grade supplies and tools for your home
                        </p>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
                        {CATEGORIES.map((cat) => (
                            <button
                                type="button"
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${selectedCategory === cat
                                    ? 'bg-primary text-white shadow-md scale-105'
                                    : 'bg-white text-muted-foreground border border-border hover:border-primary/40 hover:text-primary'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            <p className="text-muted-foreground font-bold uppercase tracking-widest animate-pulse text-sm text-center">
                                Finding products near you...
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Count */}
                            <p className="text-sm text-muted-foreground mb-6 font-medium">
                                {filtered.length} product{filtered.length !== 1 ? 's' : ''}
                            </p>

                            {/* Product Grid - 2 per row on mobile */}
                            {filtered.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {filtered.map((product) => (
                                        <div key={product.id} className="animate-fade-in">
                                            <ProductCard product={product} basePath="products" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 text-muted-foreground">
                                    <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                    <p className="font-semibold text-lg">No products found</p>
                                    <p className="text-sm mt-1">Try selecting a different category</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

