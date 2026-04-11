'use client'

import Image from 'next/image'

const BRANDS = [
    { name: 'Apple', logo: '/brand/1.png' },
    { name: 'Dell', logo: '/brand/2.png' },
    { name: 'Lenovo', logo: '/brand/3.png' },
    { name: 'Asus', logo: '/brand/4.png' },
    { name: 'Acer', logo: '/brand/5.png' },
    { name: 'HP', logo: '/brand/6.jpg' },
]

export default function Brands() {
    return (
        <section className="py-10 md:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4  text-center">

                <div className="text-left md:text-center">

                    {/* Badge */}
                    <div className="inline-block px-4 py-1 text-xs font-semibold tracking-widest uppercase rounded-full bg-[#821616]/10 text-[#821616] mb-4">
                        Supported Brands
                    </div>

                    {/* Heading */}
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#101242]">
                        Brands We Support
                    </h2>

                    {/* Subtext */}
                    <p className="mt-3 text-gray-700">
                        We repair all major laptop & computer brands
                    </p>

                </div>


                {/* Brand Cards */}
                <div className="mt-10 overflow-hidden">
                    <div className="flex gap-6 animate-marquee">

                        {[...BRANDS, ...BRANDS].map((brand, index) => (
                            <div
                                key={index}
                                className="bg-white w-[200px] rounded-xl border border-gray-200 px-2 py-2 flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 transition duration-300 h-20"
                            >
                                <div className="w-[140px] h-[60px] flex items-center justify-center">
                                    <Image
                                        src={brand.logo}
                                        alt={brand.name}
                                        width={140}
                                        height={60}
                                        className="object-contain w-full h-full"
                                    />
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </section>
    )
}