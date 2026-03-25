'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Star, Check, ArrowRight, Share2, Heart, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { useLocation } from '@/context/location-context'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'
import { useCartItem } from '@/context/CartItemContext'
import { ProductCard } from '@/components/product-card'
import { toast } from 'sonner'

export default function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)
    const { location } = useLocation()
    const { fetchCart } = useCartItem()

    const [product, setProduct] = useState<any>(null)
    const [relatedProducts, setRelatedProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [addingToCart, setAddingToCart] = useState(false)

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!location?.lat || !location?.lng || !id) return

            setLoading(true)
            try {
                // Fetch product details
                const response = await axiosInstance.get(Api.products, {
                    params: {
                        id: id,
                        lat: location.lat,
                        lng: location.lng,
                        include_pricing: true,
                        include_media: true,
                        include_category: true,
                        include_attributes: true
                    }
                })

                const products = response.data?.products || []
                const foundProduct = products.find((p: any) => p.id.toString() === id)

                if (foundProduct) {
                    setProduct(foundProduct)

                    // Fetch related products using category_id
                    if (foundProduct.category_id) {
                        const relatedRes = await axiosInstance.get(Api.products, {
                            params: {
                                category_id: foundProduct.category_id,
                                lat: location.lat,
                                lng: location.lng,
                                include_pricing: true,
                                include_media: true
                            }
                        })
                        const relatedData = relatedRes.data?.products || []
                        setRelatedProducts(relatedData.filter((p: any) => p.id.toString() !== id))
                    }
                }
            } catch (error) {
                console.error("Error fetching product details:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProductDetails()
    }, [id, location?.lat, location?.lng])

    const handleAddToCart = async () => {
        if (!product) return

        setAddingToCart(true)
        try {
            await axiosInstance.post(Api.cartApi, {
                id: product.id,
                quantity: 1,
                type: 'product'
            })
            await fetchCart()
            toast.success('Product added to cart')
        } catch (error) {
            console.error("Error adding to cart:", error)
            toast.error('Failed to add to cart')
        } finally {
            setAddingToCart(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-muted-foreground font-bold uppercase tracking-widest animate-pulse text-sm">
                        Loading product details...
                    </p>
                </main>
                <Footer />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center py-32 space-y-4">
                    <p className="text-muted-foreground font-bold">Product not found</p>
                    <Link href="/products" className="text-primary hover:underline">Back to products</Link>
                </main>
                <Footer />
            </div>
        )
    }

    const price = product.pricing?.[0]?.price || 0
    const regularPrice = product.pricing?.[0]?.regular_price
    const imageUrl = product.media?.[0]?.url || '/placeholder.jpg'
    const attributes = product.attributes?.length > 0
        ? product.attributes.map((attr: any) => attr.value)
        : ['High Quality Guaranteed', 'Professional Service', '90-Day Warranty', 'Verified Product']

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
                    {/* Left: Image */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl group border border-slate-100">
                        <Image
                            src={imageUrl}
                            alt={product.name}
                            width={800}
                            height={600}
                            className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-6 right-6 flex gap-3">
                            <button className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all active:scale-90">
                                <Heart className="w-5 h-5 text-slate-600" />
                            </button>
                            <button className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all active:scale-90">
                                <Share2 className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="space-y-8 py-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {product.category_name || product.category?.name || 'Product'}
                                </span>
                            </div>
                            <h1 className="text-5xl font-extrabold text-[#1a1c2e] tracking-tight">
                                {product.name}
                            </h1>
                            <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
                                {product.description || 'No description available for this product.'}
                            </p>
                        </div>

                        {/* Rating & Verified */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Star className="w-6 h-6 fill-[#ffbb00] text-[#ffbb00]" />
                                <span className="text-xl font-bold text-[#1a1c2e]">{product.rating || 4.5}</span>
                                <span className="text-slate-400 font-medium">({product.reviews_count || 120} reviews)</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm font-semibold text-green-700">Verified Product</span>
                            </div>
                        </div>

                        {/* Price Card */}
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                            <p className="text-slate-500 font-medium mb-1">Starting from</p>
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-4xl font-black text-[#1a1c2e]">₹{price}</span>
                                {regularPrice && (
                                    <span className="text-xl text-slate-400 line-through font-medium">₹{regularPrice}</span>
                                )}
                            </div>
                            <p className="text-sm text-slate-400">Inclusive of all taxes</p>
                        </div>

                        {/* Key Features/Attributes */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-[#1a1c2e]">Key Features</h3>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                {attributes.map((item: any, index: number) => (
                                    <div key={index} className="flex items-center gap-3 group">
                                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 transition-colors group-hover:bg-emerald-100">
                                            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />
                                        </div>
                                        <span className="text-[15px] font-medium text-slate-600 leading-tight">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="w-full bg-[#800000] hover:bg-[#600000] disabled:bg-slate-300 text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-xl shadow-red-900/10"
                        >
                            {addingToCart ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <span>Book Now — ₹{price}</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="space-y-10 py-16 border-t border-slate-100">
                        <div className="flex items-end justify-between">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-[#1a1c2e]">Similar Products</h2>
                                <p className="text-slate-500">Popular products from the same category</p>
                            </div>
                            <Link
                                href="/products"
                                className="flex items-center gap-2 text-[#800000] font-bold hover:gap-3 transition-all group"
                            >
                                <span>See All</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedProducts.map((p) => {
                                const relPrice = p.pricing?.[0]?.price || 0
                                const relRegularPrice = p.pricing?.[0]?.regular_price
                                const relImage = p.media?.[0]?.url || '/placeholder.jpg'

                                return (
                                    <ProductCard key={p.id} product={{
                                        id: p.id,
                                        name: p.name,
                                        category: p.category_name || p.category?.name || 'Product',
                                        price: Number(relPrice),
                                        originalPrice: relRegularPrice ? Number(relRegularPrice) : undefined,
                                        image: relImage,
                                        rating: p.rating || 4.5,
                                        reviews: p.reviews_count || 120,
                                        inStock: true
                                    }} basePath="products" />
                                )
                            })}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
