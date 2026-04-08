'use client'

import { useState, useEffect, useMemo } from 'react'
import { ProductCard } from '../../components/product-card'
import { Header } from '../../components/header'
import { Footer } from '../../components/footer'
import { Package, Loader2, ChevronLeft, ChevronRight, MapPin, Navigation } from 'lucide-react'
import { useLocation } from '@/context/location-context'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'

export default function AllProductsPage() {
    const { location, setShowLocationModal } = useLocation()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('All')

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [paginationData, setPaginationData] = useState<any>(null)
    const PAGE_SIZE = 12

    useEffect(() => {
        const fetchProducts = async () => {
            if (!location?.lat || !location?.lng) return

            setLoading(true)
            setProducts([]) // Clear old products when switching pages or locations

            try {
                const response = await axiosInstance.get(Api.products, {
                    params: {
                        lat: location.lat,
                        lng: location.lng,
                        include_pricing: true,
                        include_media: true,
                        include_category: true,
                        status: 'ACTIVE',
                        page: currentPage,
                        size: PAGE_SIZE,
                        include_attribute: true,
                    }
                })

                const responseData = response.data
                const productsData = Array.isArray(responseData)
                    ? responseData
                    : (responseData?.data || responseData?.products || [])

                // Save pagination metadata
                if (responseData?.pagination) {
                    setPaginationData(responseData.pagination)
                } else if (!Array.isArray(responseData)) {
                    // Fallback if pagination is in the object
                    setPaginationData({
                        total_elements: responseData.total_elements || productsData.length,
                        page: responseData.page || currentPage,
                        size: responseData.size || PAGE_SIZE,
                        total_pages: responseData.total_pages || 1
                    })
                }

                const mappedProducts = productsData.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    category: p.categories?.[0]?.name || p.category_name || p.category?.name || 'Uncategorized',
                    price: Number(p.pricing?.[0]?.price || 0),
                    originalPrice: p.pricing?.[0]?.regular_price ? Number(p.pricing?.[0]?.regular_price) : undefined,
                    image: p.media?.[0]?.url || '/placeholder.jpg',
                    inStock: p.status === 'ACTIVE',
                    rating: p.rating || 4.5,
                    reviews: p.reviews_count || 50,
                    badge: p.badge || 'New'
                }))
                setProducts(mappedProducts)
            } catch (error: any) {
                if (![400, 404, 422, 500].includes(error.response?.status)) {
                    console.error("Error fetching products:", error instanceof Error ? error.message : String(error))
                }
                setProducts([])
                setPaginationData(null)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [location?.lat, location?.lng, currentPage])

    const CATEGORIES = useMemo(() => {
        const categories = Array.from(new Set(products.map(p => p.category)))
        return ['All', ...categories]
    }, [products])

    const filtered = products.filter(p => selectedCategory === 'All' || p.category === selectedCategory)

    // Calculate pagination showing range
    const totalItems = paginationData?.total_elements || 0
    const startItem = ((currentPage - 1) * PAGE_SIZE) + 1
    const endItem = Math.min(currentPage * PAGE_SIZE, totalItems)

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="py-20 bg-muted/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Heading */}
                    <div className="mb-10 space-y-2">
                        <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                            Home Care <span className="text-primary">Products</span>
                        </h1>
                        <p className="text-lg text-muted-foreground font-medium">
                            Professional-grade supplies and tools for your home
                        </p>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                        {CATEGORIES.map((cat) => (
                            <button
                                type="button"
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide whitespace-nowrap transition-all duration-200 ${selectedCategory === cat
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                    : 'bg-white text-muted-foreground border border-border hover:border-primary/40 hover:text-primary'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {!location?.lat || !location?.lng ? (
                        <div className="flex flex-col items-center justify-center py-40 p-8 space-y-8 bg-white rounded-[40px] border border-dashed border-border shadow-sm">
                            <div className="relative">
                                <div className="w-24 h-24 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto">
                                    <MapPin className="w-10 h-10" />
                                </div>
                                <div className="absolute inset-0 blur-xl bg-primary/5 rounded-full"></div>
                            </div>
                            <div className="text-center space-y-3 max-w-sm mx-auto">
                                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Location Required</h3>
                                <p className="text-muted-foreground font-medium">To show you available products and accurate pricing, please select your city.</p>
                            </div>
                            <button
                                onClick={() => setShowLocationModal(true)}
                                className="px-10 py-4 bg-primary text-white rounded-2xl font-black tracking-widest uppercase shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-3"
                            >
                                <Navigation className="w-5 h-5 text-white/50" />
                                Select Your Location
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="flex flex-col items-center justify-center py-40 p-8 space-y-6">
                            <div className="relative">
                                <Loader2 className="w-16 h-16 text-[#800000] animate-spin" />
                                <div className="absolute inset-0 blur-xl bg-[#800000]/10 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-slate-500 font-black uppercase tracking-[0.2em] animate-pulse ml-2 text-sm text-center">
                                Loading products...
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Showing Info Banner */}
                            {totalItems > 0 && (
                                <div className="mb-8 flex justify-end">
                                    <div className="inline-flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-2.5 shadow-sm overflow-hidden relative">
                                        {/* Left accent bar */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
                                        <Package className="w-3.5 h-3.5 text-primary shrink-0 ml-1" />
                                        <p className="text-xs font-black text-foreground uppercase tracking-[1.5px] whitespace-nowrap">
                                            Showing&nbsp;
                                            <span className="text-primary">{startItem}–{endItem}</span>
                                            &nbsp;of&nbsp;
                                            <span className="text-primary">{totalItems}</span>
                                            &nbsp;Products
                                        </p>
                                        <span className="shrink-0 bg-primary/10 text-primary text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                            {currentPage}/{paginationData?.total_pages}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Product Grid */}
                            {filtered.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                                        {filtered.map((product) => (
                                            <div key={product.id} className="animate-fade-in">
                                                <ProductCard product={product} basePath="products" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination Controls */}
                                    {paginationData?.total_pages > 1 && (
                                        <div className="mt-16 flex justify-center items-center gap-2">
                                            {/* Prev Button */}
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-border text-sm font-bold text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-all duration-200 active:scale-95 shadow-sm"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                Prev
                                            </button>

                                            {/* Page Numbers */}
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: paginationData.total_pages }, (_, i) => i + 1)
                                                    .filter(page =>
                                                        page === 1 ||
                                                        page === paginationData.total_pages ||
                                                        Math.abs(page - currentPage) <= 1
                                                    )
                                                    .reduce((acc: (number | string)[], page, idx, arr) => {
                                                        if (idx > 0 && (page as number) - (arr[idx - 1] as number) > 1) acc.push('...')
                                                        acc.push(page)
                                                        return acc
                                                    }, [])
                                                    .map((item, idx) =>
                                                        item === '...' ? (
                                                            <span key={`ellipsis-${idx}`} className="px-2 py-2 text-sm text-muted-foreground font-bold select-none">…</span>
                                                        ) : (
                                                            <button
                                                                key={item}
                                                                onClick={() => handlePageChange(item as number)}
                                                                className={`w-10 h-10 rounded-xl text-sm font-black transition-all duration-200 active:scale-95 ${currentPage === item
                                                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                                                    : 'bg-white border border-border text-foreground hover:border-primary hover:text-primary'
                                                                    }`}
                                                            >
                                                                {item}
                                                            </button>
                                                        )
                                                    )
                                                }
                                            </div>

                                            {/* Next Button */}
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === paginationData?.total_pages}
                                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-border text-sm font-bold text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-all duration-200 active:scale-95 shadow-sm"
                                            >
                                                Next
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-20 text-muted-foreground bg-white rounded-3xl border border-border border-dashed">
                                    <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                    <p className="font-bold text-xl text-slate-900">No products found</p>
                                    <p className="text-sm mt-1">Try selecting a different category or location</p>
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

