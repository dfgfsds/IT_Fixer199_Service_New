'use client'

import { CheckCircle } from 'lucide-react'

export default function AboutSection() {
    return (
        <section className="py-10 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 ">

                <div className="grid lg:grid-cols-2 gap-10 items-center">

                    {/* LEFT CONTENT */}
                    <div className="relative flex justify-center">

                        <div className="relative w-full max-w-md">

                            {/* Image */}
                            <div className="rounded-3xl overflow-hidden shadow-xl">
                                <img
                                    src="https://www.pcgeeksusa.com/wp-content/uploads/2020/08/computer-repair.jpeg"
                                    alt="Laptop Repair Chennai"
                                    className="w-full h-full  md:w-[500px] md:h-[500px] object-cover"
                                />
                            </div>

                            {/* Floating Card */}
                            <div className="absolute -bottom-6 -left-6 bg-[#101242] rounded-2xl shadow-lg p-5">
                                <p className="text-sm text-white">Service Starts</p>
                                <p className="text-xl font-bold text-[#fff]">₹199</p>
                            </div>

                        </div>

                    </div>
                    <div className="space-y-6">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#821616]/10 text-[#821616] text-sm font-semibold">
                            About IT Fixer
                        </div>

                        {/* Heading */}
                        <h2 className="text-4xl sm:text-5xl font-bold leading-tight text-gray-900">
                            Laptop Repair in Chennai <br />
                            <span className="bg-gradient-to-r from-[#101242] to-[#821616] bg-clip-text text-transparent">
                                @ ₹199
                            </span>
                        </h2>

                        {/* Paragraphs */}
                        <p className="text-gray-600 text-lg">
                            Looking for reliable laptop repair in Chennai without the hassle of visiting a service center?
                            <span className="font-semibold text-gray-900"> IT Fixer @199 </span>
                            brings professional computer repair services right to your doorstep.
                        </p>

                        <p className="text-gray-600">
                            For just ₹199, our expert technicians visit your location, diagnose the issue,
                            and provide fast, efficient solutions.
                        </p>

                        <p className="text-gray-600">
                            We specialize in laptop repair, desktop repair, gaming PC service, and hardware upgrades,
                            making us one of the most trusted doorstep IT service providers in Chennai.
                        </p>

                        {/* Feature Points */}
                        <div className="grid sm:grid-cols-2 gap-4 pt-4">
                            {[
                                'Laptop Repair',
                                'Desktop Repair',
                                'Gaming PC Service',
                                'Hardware Upgrades',
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 transition p-3 rounded-xl"
                                >
                                    <CheckCircle className="w-5 h-5 text-[#101242]" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* RIGHT VISUAL */}


                </div>

            </div>
        </section>
    )
}