import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Tv } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";
import servicesData from '@/constants/services-data.json';

export const metadata = {
    title: "Indoor LED Display | ITFixer199",
    description: "Premium Indoor LED Displays for businesses and events.",
};

export default function IndoorLedPage() {
    const dummyIndoorProducts = servicesData.indoorLed;
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 py-20 bg-muted/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-[#101242]/10 rounded-2xl flex items-center justify-center">
                            <Tv className="w-10 h-10 text-[#101242]" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#101242] tracking-tight">
                        Indoor LED Displays
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        High-resolution indoor LED walls and screens tailored for retail, corporate, and event spaces. Contact us for custom installations.
                    </p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-12">
                        {dummyIndoorProducts.map((product) => (
                            <div key={product.id} className="animate-fade-in text-left">
                                <ProductCard product={product as any} basePath="led-display" hidePrice={true} isCallAction={true} />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
