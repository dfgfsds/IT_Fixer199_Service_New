'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Star, Check, ArrowRight, Share2, Heart, Loader2, Minus, Plus, MapPin, Navigation } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, use, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useLocation } from '@/context/location-context'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'
import { useCartItem } from '@/context/CartItemContext'
import { ProductCard } from '@/components/product-card'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/format-price'

export default function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)
    const router = useRouter()
    const { location, setShowLocationModal } = useLocation()
    const { cartItem, fetchCart } = useCartItem()

    const currentCartItem = useMemo(() => {
        return cartItem?.find((item: any) => item.product_id === id || item.product?.id === id)
    }, [cartItem, id])

    const [product, setProduct] = useState<any>(null)
    const [relatedProducts, setRelatedProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [addingToCart, setAddingToCart] = useState(false)
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})

    const attributeGroups = useMemo(() => {
        if (!product?.attributes || product.attributes.length === 0) return null
        const groups: Record<string, any[]> = {}
        product.attributes.forEach((attr: any) => {
            if (!groups[attr.attribute_name]) {
                groups[attr.attribute_name] = []
            }
            if (!groups[attr.attribute_name].find((v: any) => v.value_id === attr.value_id)) {
                groups[attr.attribute_name].push(attr)
            }
        })
        return groups
    }, [product])

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!location?.lat || !location?.lng || !id) return

            setLoading(true)
            try {
                const url = `${Api.products}/${id}`
                const response = await axiosInstance.get(url, {
                    params: {
                        lat: location.lat,
                        lng: location.lng,
                        include_pricing: true,
                        include_media: true,
                        include_category: true,
                        include_attribute: true,
                        include_brand: true,
                        status: 'ACTIVE',
                        size: "10000"
                    }
                })

                const foundProduct = response.data?.data

                if (foundProduct && foundProduct.id) {
                    setProduct(foundProduct)

                    const categoryId = foundProduct.category_id || foundProduct.categories?.[0]?.id

                    if (categoryId) {
                        const relatedRes = await axiosInstance.get(Api.products, {
                            params: {
                                category_id: categoryId,
                                lat: location.lat,
                                lng: location.lng,
                                include_pricing: true,
                                include_media: true,
                                include_category: true,
                                status: 'ACTIVE',
                                size: 4
                            }
                        })
                        const relatedData = Array.isArray(relatedRes.data)
                            ? relatedRes.data
                            : (relatedRes.data?.data || relatedRes.data?.products || [])

                        setRelatedProducts(relatedData
                            .filter((p: any) => p.id.toString() !== id)
                            .slice(0, 3)
                        )
                    }
                }
            } catch (error: any) {
                if (![400, 404, 422].includes(error.response?.status)) {
                    console.error("Error fetching product details:", error instanceof Error ? error.message : String(error))
                }
                setProduct(null)
            } finally {
                setLoading(false)
            }
        }

        fetchProductDetails()
    }, [id, location?.lat, location?.lng])

    const handleAddToCart = async () => {
        if (!product) return

        if (attributeGroups) {
            const requiredGroups = Object.keys(attributeGroups)
            const isAllSelected = requiredGroups.every(groupName => !!selectedAttributes[groupName])
            if (!isAllSelected) {
                toast.error('Please select all product options before adding to cart.')
                return
            }
        }

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) {
            toast.error('Please login to add to cart')
            router.push('/login')
            return
        }

        setAddingToCart(true)
        try {
            // Collect the full attribute objects for the API based on selected value IDs
            const attributesToSend = attributeGroups
                ? Object.keys(attributeGroups).map(groupName => {
                    const valueId = selectedAttributes[groupName]
                    const attr = attributeGroups[groupName].find((v: any) => v.value_id === valueId)
                    return {
                        attribute_id: attr.attribute_id,
                        value_id: attr.value_id
                    }
                })
                : []

            await axiosInstance.post(`${Api.cartApi}/add/`, {
                type: 'PRODUCT',
                product_id: product.id,
                quantity: 1,
                attributes: attributesToSend
            })
            await fetchCart()
            toast.success('Product added to cart!')
        } catch (error: any) {
            if (error?.response?.status === 401) {
                toast.error('Please login to add to cart')
                router.push('/login')
            } else {
                console.error('Error adding to cart:', error instanceof Error ? error.message : String(error))
                toast.error('Failed to add to cart')
            }
        } finally {
            setAddingToCart(false)
        }
    }

    const increaseQty = async () => {
        if (!currentCartItem) return
        setAddingToCart(true)
        try {
            await axiosInstance.post(`${Api.cartApi}/add/`, {
                type: 'PRODUCT',
                product_id: id,
                quantity: 1,
            })
            await fetchCart()
        } catch (error) {
            toast.error('Failed to increase quantity')
        } finally {
            setAddingToCart(false)
        }
    }

    const decreaseQty = async () => {
        if (!currentCartItem) return
        setAddingToCart(true)
        try {
            await axiosInstance.post(`${Api.cartApi}/item/${currentCartItem.id}/decrease/`, {
                type: 'PRODUCT',
                product_id: id,
                quantity: currentCartItem.quantity - 1,
            })
            await fetchCart()
        } catch (error) {
            toast.error('Failed to decrease quantity')
        } finally {
            setAddingToCart(false)
        }
    }

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
                            <p className="text-slate-500 font-medium">To show you available products and accurate pricing, please select your city.</p>
                        </div>
                        <button
                            onClick={() => setShowLocationModal(true)}
                            className="px-10 py-4 bg-[#800000] text-white rounded-2xl font-black tracking-widest uppercase shadow-xl shadow-[#800000]/20 hover:bg-[#800000]/90 transition-all active:scale-95 flex items-center gap-3"
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
                <main className="flex-1 flex flex-col items-center justify-center py-40 p-8 space-y-6">
                    <div className="relative">
                        <Loader2 className="w-16 h-16 text-[#800000] animate-spin" />
                        <div className="absolute inset-0 blur-xl bg-[#800000]/10 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-slate-500 font-black uppercase tracking-[0.2em] animate-pulse ml-2 text-sm">
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

    console.log(product, 'jkhgjkgjhgjh')
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
                                <span className="text-4xl font-black text-[#1a1c2e]">₹{formatPrice(price)}</span>
                                {regularPrice && (
                                    <span className="text-xl text-slate-400 line-through font-medium">₹{formatPrice(regularPrice)}</span>
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

                        {/* Dynamic Product Attributes Selection */}
                        {attributeGroups && (
                            <div className="space-y-6 pt-2">
                                {Object.keys(attributeGroups).map((groupName) => (
                                    <div key={groupName} className="space-y-3">
                                        <h3 className="text-lg font-bold text-[#1a1c2e] uppercase tracking-wider">{groupName}</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {attributeGroups[groupName].map((attr) => {
                                                const isSelected = selectedAttributes[groupName] === attr.value_id
                                                return (
                                                    <button
                                                        key={attr.value_id}
                                                        onClick={() => setSelectedAttributes(prev => ({ ...prev, [groupName]: attr.value_id }))}
                                                        className={`px-5 py-2.5 rounded-xl border-2 transition-all font-bold text-sm ${isSelected
                                                            ? 'border-primary bg-primary/10 text-primary scale-[1.02] shadow-sm'
                                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        {attr.value}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                            {currentCartItem ? (
                                <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-3xl border border-border/50 shadow-inner w-full sm:w-auto">
                                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-border shadow-sm grow min-w-[200px]">
                                        <button
                                            onClick={decreaseQty}
                                            disabled={addingToCart}
                                            className="w-14 h-14 flex items-center justify-center bg-primary rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:scale-100"
                                        >
                                            {addingToCart ? <Loader2 className="w-6 h-6 animate-spin" /> : <Minus className="w-6 h-6 text-white stroke-[3px]" />}
                                        </button>
                                        <span className="flex-1 text-center text-2xl font-black text-foreground tabular-nums">
                                            {currentCartItem.quantity}
                                        </span>
                                        <button
                                            onClick={increaseQty}
                                            disabled={addingToCart}
                                            className="w-14 h-14 flex items-center justify-center bg-primary rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:scale-100"
                                        >
                                            {addingToCart ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6 text-white stroke-[3px]" />}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white py-4 px-8 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:shadow-lg disabled:opacity-70"
                                >
                                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                                </button>
                            )}
                        </div>
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
