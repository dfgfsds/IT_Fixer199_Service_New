'use client'

import React from 'react'
import Image from 'next/image'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

const BRANDS = [
    { name: 'Apple', logo: '/brand/1.png' },
    { name: 'Dell', logo: '/brand/2.png' },
    { name: 'Lenovo', logo: '/brand/3.png' },
    { name: 'Asus', logo: '/brand/4.png' },
    { name: 'Acer', logo: '/brand/5.png' },
    { name: 'HP', logo: '/brand/6.jpg' },
]

const animation = { duration: 35000, easing: (t: number) => t }

export default function Brands() {
    const [pause, setPause] = React.useState(false)
    const [sliderRef, internalSlider] = useKeenSlider<HTMLDivElement>({
        loop: true,
        renderMode: 'performance',
        drag: true,
        slides: {
            perView: 'auto',
            spacing: 24,
        },
        created(s) {
            s.moveToIdx(5, true, animation)
        },
        updated(s) {
            s.moveToIdx(s.track.details.abs + 5, true, animation)
        },
        animationEnded(s) {
            if (!pause) {
                s.moveToIdx(s.track.details.abs + 5, true, animation)
            }
        },
    })

    React.useEffect(() => {
        if (!pause && internalSlider.current) {
            internalSlider.current.moveToIdx(internalSlider.current.track.details.abs + 5, true, animation)
        }
    }, [pause])

    return (
        <section className="py-10 md:py-20 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="text-left md:text-center">
                    <div className="inline-block px-4 py-1 text-xs font-semibold tracking-widest uppercase rounded-full bg-[#821616]/10 text-[#821616] mb-4">
                        Supported Brands
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#101242]">
                        Brands We Support
                    </h2>
                    <p className="mt-3 text-gray-700">
                        We repair all major laptop & computer brands
                    </p>
                </div>

                {/* Keen Slider Brand Cards */}
                <div className="mt-10 overflow-hidden">
                    <div
                        ref={sliderRef}
                        className="keen-slider"
                        onMouseEnter={() => setPause(true)}
                        onMouseLeave={() => setPause(false)}
                    >
                        {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((brand, index) => (
                            <div
                                key={index}
                                className="keen-slider__slide min-w-[160px] mb-4"
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