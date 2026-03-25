'use client'

import { useState } from 'react'
import { ProductCard } from '../../components/product-card'
import { Header } from '../../components/header'
import { Footer } from '../../components/footer'
import { products } from '@/lib/products'
import { Package } from 'lucide-react'

const CATEGORIES = [
    'All',
    'Cleaning',
    'Appliances',
    'Tools',
    'Home Care',
    'Safety',
    'Plumbing',
]

export default function AllProductsPage() {
    const [activeCategory, setActiveCategory] = useState('All')

    const filtered =
        activeCategory === 'All'
            ? products
            : products.filter((p) => p.category === activeCategory)

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
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${activeCategory === cat
                                    ? 'bg-primary text-white shadow-md scale-105'
                                    : 'bg-white text-muted-foreground border border-border hover:border-primary/40 hover:text-primary'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Count */}
                    <p className="text-sm text-muted-foreground mb-6 font-medium">
                        {filtered.length} product{filtered.length !== 1 ? 's' : ''}
                    </p>

                    {/* Product Grid - 2 per row on mobile */}
                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {filtered.map((product) => (
                                <div key={product.id} className="animate-fade-in">
                                    <ProductCard product={product} />
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
                </div>
            </main>
            <Footer />
        </div>
    )
}
