// 'use client'

// import Image from 'next/image'
// import { Check, Zap, Smartphone, MapPin, CreditCard, Shield } from 'lucide-react'

// const BENEFITS = [
//   {
//     icon: Zap,
//     title: 'Same-Day Service',
//     description: 'Get your laptop or PC repaired on the same day',
//   },
//   {
//     icon: Smartphone,
//     title: 'Instant Diagnosis',
//     description: 'Quick and accurate issue identification',
//   },
//   {
//     icon: MapPin,
//     title: 'Doorstep Support',
//     description: 'Technicians available across Chennai',
//   },
//   {
//     icon: CreditCard,
//     title: 'Flexible Payment',
//     description: 'Pay via cash, card, or UPI',
//   },
//   {
//     icon: Shield,
//     title: 'Genuine Parts',
//     description: 'High-quality and original spare parts used',
//   },
//   {
//     icon: Check,
//     title: 'Reliable Service',
//     description: 'Trusted by hundreds of happy customers',
//   },
// ]

// export function WhyUs() {
//   return (
//     <section className="py-10 md:py-20 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid lg:grid-cols-2 gap-10 items-center">

//           {/* Left Content */}
//           <div className="space-y-8">
//             <div className="space-y-4">
//               <h2 className="text-3xl sm:text-5xl font-bold text-foreground">
//                 Why Choose Us
//               </h2>
//               <p className="text-lg text-muted-foreground">
//                 Fast & Reliable Same-Day Laptop and PC Repair Services in Chennai.
//                 We ensure quick solutions with minimum downtime using genuine parts and expert technicians.
//               </p>
//             </div>

//             {/* Benefits Grid */}
//             <div className="grid sm:grid-cols-2 gap-6">
//               {BENEFITS.map((benefit) => {
//                 const IconComponent = benefit.icon
//                 return (
//                   <div key={benefit.title} className="flex gap-4">

//                     <div>
//                       <h3 className="font-bold text-lg text-foreground">
//                         {benefit.title}
//                       </h3>
//                       <p className="text-sm text-muted-foreground">
//                         {benefit.description}
//                       </p>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>

//           {/* Right Image */}
//           <div className="hidden lg:flex items-center justify-center">
//             <div className="relative w-full  group">

//               <div className="relative h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl">
//                 <Image
//                   src="/serviceimage.png"
//                   alt="Laptop Repair Service"
//                   fill
//                   className="object-cover transition-transform duration-700 group-hover:scale-105"
//                 />
//               </div>

//               {/* Gradient Overlay */}
//               <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#101242]/40 to-transparent"></div>

//               {/* Floating Badge */}
//               <div className="absolute -bottom-6 -right-6 bg-[#101242] text-white rounded-2xl px-5 py-3 shadow-lg">
//                 <p className="font-bold text-sm">Starts at ₹199</p>
//               </div>

//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   )
// }

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CheckCircle, CheckCircle2, ChevronDown, ChevronUp, MapPin, Monitor, ShieldCheck, Sliders, Wrench } from 'lucide-react'

const BENEFITS = [
  'Laptop repair',
  'Desktop repair',
  'Gaming PC service',
  'Hardware upgrades'
]

export function WhyUs() {
  const [showMore, setShowMore] = useState(false)

  return (
    <section className="py-10 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Why Customers Stick With <span className="text-[#101242]">IT Fixer @199</span>
              </h4>
              <p className="text-lg text-gray-600 leading-relaxed">
                If you've been searching for reliable laptop repair services in Chennai that skip the shop visit entirely, IT Fixer @199 flips that around — the technician comes to you instead.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We handle laptop service in Chennai for ₹199 in desktop repairs, gaming PC maintenance and component upgrades.
              </p>
              <p className="font-semibold text-gray-800 pt-2">
                Core services at a glance:
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {BENEFITS.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100/80 hover:shadow-sm transition-all duration-200 p-3.5 rounded-xl border border-gray-100"
                >
                  <CheckCircle className="w-5 h-5 text-[#101242] shrink-0" />
                  <span className="text-sm font-medium text-gray-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:flex items-center justify-center self-start">
            <div className="relative w-full group">
              <div className="relative h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                <Image
                  src="/serviceimage.png"
                  alt="Laptop Repair Service"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#101242]/40 to-transparent"></div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-[#101242] text-white rounded-2xl px-5 py-3 shadow-lg border border-white/10">
                <p className="font-bold text-sm tracking-wide">Starts at ₹199</p>
              </div>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* BUTTON AREA: Centered perfectly on the page */}
        {/* ------------------------------------------------------------- */}


        {/* Existing dynamic wrapper */}
        <div className={`transition-all duration-700 ease-in-out overflow-hidden ${showMore ? 'max-h-[5000px] opacity-100 mt-12' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-gray-100 pt-16 space-y-16 max-w-5xl mx-auto text-center flex flex-col items-center px-4">

            {/* Section 1 */}
            <div className="space-y-5 max-w-4xl">
              <h4 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101242] tracking-tight">
                Doorstep Laptop Service in Chennai,<span className="text-[#821616] block sm:inline">Support Without the Wait</span>
              </h4>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base max-w-3xl mx-auto text-justify sm:text-center">
                <p>

                  Getting your laptop or desktop repaired should not mean travelling across the city or waiting days for updates.<strong className="text-[#101242]">IT Fixer @199</strong>  brings expert technicians to your doorstep for on-the-spot diagnosis and repairs. We handle laptops, desktops, gaming PCs, workstations and accessories across Chennai. If you need the best PC repair service in Chennai, our on-site approach saves both time and effort.
                </p>
                <p>
                  With 5,000+ customers, coverage across 20+ locations and access to 3,000+ spare parts, we complete most repairs without unnecessary delays. This dependable Laptop service in Chennai experience is why customers continue to trust us.
                </p>
                {/* <p className="font-medium text-gray-800 bg-gray-50 py-2 px-4 rounded-xl inline-block border border-gray-100">
                  🎯 With <span className="text-[#821616] font-bold">5000+ happy customers</span>, 20+ service locations and access to 3000+ spare parts, IT Fixer @199 helps users save time.
                </p> */}
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-5 max-w-4xl w-full">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101242] tracking-tight">
                Same-Day On-Site <span className="text-[#821616] block sm:inline">PC Repair in Chennai </span>
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base max-w-3xl mx-auto text-justify sm:text-center">
                No matter the brand or device type — laptop, desktop, gaming setup, or workstation — our on-site PC repair in Chennai service is built to handle it at your doorstep. The team regularly works through diagnostics, software glitches, hardware swaps, sluggish performance, blue-screen crashes, Windows failures and malware cleanup.
              </p>
              {/* <p className="text-gray-600 leading-relaxed text-sm sm:text-base max-w-3xl mx-auto text-justify sm:text-center font-medium">
                As a local support platform, IT Fixer @199 provides Certified Computer Services in Chennai with a strong focus on practical diagnosis, clear communication and customer convenience.
              </p> */}
            </div>

            {/* Section 3 */}
            <div className="space-y-6 w-full max-w-4xl">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101242] tracking-tight">
                Affordable Laptop Service <span className="text-[#821616] block sm:inline">in Chennai for Homes & Offices</span>
              </h3>
              <div className="space-y-3 text-gray-600 text-sm sm:text-base max-w-3xl mx-auto">
                <p>Getting your device looked at shouldn't drain your wallet before you even know what's broken. That's the thinking behind our <span className="text-[#821616] font-bold">₹199</span> visit fee.</p>
                <p>That fee covers the inspection, a proper diagnosis, a quick consultation, and — where possible — the repair itself, all rolled into one visit.</p>
                <p>It's this straightforward pricing that keeps homes, offices and students coming back to us for an honest, affordable computer service in Chennai.</p>
              </div>

              <div className="pt-4 max-w-3xl mx-auto w-full">
                <p className="font-extrabold text-[#101242] mb-5 text-base sm:text-lg flex items-center justify-center gap-2">
                  <Monitor className="w-5 h-5 text-[#821616]" /> Who typically books this ₹199 visit?
                </p>
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
                  {[
                    'Home users with a laptop acting up',
                    'Offices running desktop fleets',
                    'Students juggling deadlines'
                  ].map((li) => (
                    <li key={li} className="flex items-center gap-3 text-sm font-semibold text-gray-700 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#821616]/20 transition-all duration-200">
                      <span className="w-2 h-2 rounded-full bg-[#821616] shrink-0" />
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-6 w-full max-w-4xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101242] tracking-tight">
                Doorstep Laptop Service <span className="text-[#821616] block sm:inline">in Chennai with Fast Support</span>
              </h2>
              <div className="space-y-3 text-gray-600 text-sm sm:text-base max-w-3xl mx-auto">
                <p>IT Fixer @199 skips that step entirely with on-site and doorstep laptop repair across Chennai.</p>
                <p>For anyone who simply doesn't have time for a service-centre trip, fast on-site PC repair in Chennai tends to be the more practical route.</p>
              </div>

              <div className="pt-4">
                <p className="font-extrabold text-[#101242] mb-5 text-base sm:text-lg flex items-center justify-center gap-2">
                  <Wrench className="w-5 h-5 text-[#821616]" /> Issues we come across regularly:
                </p>
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-left">
                  {[
                    'No display',
                    'Cracked or damaged screen',
                    'Unresponsive keyboard',
                    'Battery draining too fast',
                    'Overheating',
                    'BIOS errors',
                    'Hard disk failure'
                  ].map((li) => (
                    <li key={li} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#821616] bg-[#821616]/5 p-3 rounded-xl border border-[#821616]/10 hover:bg-[#821616]/10 transition-colors duration-150">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#821616] shrink-0" />
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-gray-500 text-sm italic pt-2">
                When the right spare part is in stock, a good number of these get resolved in a single visit.
              </p>
            </div>


            {/* Section 5 */}
            <div className="space-y-6 w-full max-w-4xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101242] tracking-tight">
                Top PC Repair Service <span className="text-[#821616] block sm:inline">in Chennai for Better Efficiency</span>
              </h2>
              <div className="space-y-3 text-gray-600 text-sm sm:text-base max-w-3xl mx-auto">
                <p>Fixing today's problem is only half the job — the other half is making sure the same issue (or a new one) doesn't show up again in a month. That's the lens we use for every repair.</p>
              </div>

              <div className="pt-4">
                <p className="font-extrabold text-[#101242] mb-5 text-base sm:text-lg flex items-center justify-center gap-2">
                  <Sliders className="w-5 h-5 text-[#821616]" /> Services under this umbrella include:
                </p>
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-left">
                  {[
                    'SSD upgrades',
                    'RAM upgrades',
                    'Deep cleaning',
                    'Thermal paste replacement',
                    'OS-level support',
                    'Windows crash fixes',
                    'Driver troubleshooting',
                    'Software and hardware diagnostics',
                    'General PC maintenance and optimization'
                  ].map((li) => (
                    <li key={li} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200/60 shadow-sm hover:border-gray-300 transition-all duration-200">
                      <CheckCircle2 className="w-4 h-4 text-[#101242] shrink-0" />
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-gray-600 pt-2 text-sm max-w-3xl mx-auto">
                When a part genuinely needs replacing, we use authentic spare components — because a repair is only as good as what goes into it.
              </p>
            </div>


            {/* Section 6 */}
            <div className="space-y-6 w-full max-w-4xl">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101242] tracking-tight">
                Accurate PC Repair Services <span className="text-[#821616] block sm:inline">in Chennai by Skilled Technicians</span>
              </h3>
              <div className="space-y-3 text-gray-600 text-sm sm:text-base max-w-3xl mx-auto">
                <p>Ask around and you'll find IT Fixer @199 mentioned among the trusted laptop repair services providers in Chennai — largely because we don't oversell. Positive customer referrals are the foundation of dependable laptop repair services in Chennai.</p>
                <p>Our technicians handle laptops, desktops, branded computers, gaming PCs and workstations, making us a trusted choice for experienced Laptop service in Chennai — and often the best PC repair service in Chennai for handling a mix of devices under one roof — rather than a one-size-fits-all fix.</p>
              </div>

              <div className="pt-4 max-w-2xl mx-auto w-full">
                <p className="font-extrabold text-[#101242] mb-5 text-base sm:text-lg flex items-center justify-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#821616]" /> Here's roughly how a visit plays out:
                </p>
                <ul className="space-y-3 text-left">
                  {[
                    'The device gets inspected',
                    'The actual fault is identified',
                    "We explain what's needed and why",
                    'Cost is confirmed before any replacement',
                    'The repair is carried out on the spot where possible',
                    'The device is tested before we leave'
                  ].map((li, index) => (
                    <li key={li} className="flex items-center gap-4 text-sm font-semibold text-gray-700 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#101242] text-white text-xs font-black shrink-0 shadow-sm">
                        {index + 1}
                      </span>
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
            </div>


          {/* Section 7 - Contact & Location Footer block */}
            <div className="bg-gradient-to-br from-gray-50 to-[#821616]/5 border border-gray-100 p-8 sm:p-10 rounded-3xl space-y-4 w-full max-w-3xl mx-auto shadow-inner relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#821616]/5 rounded-full blur-2xl -mr-5 -mt-5" />
              <h4 className="text-xl sm:text-2xl font-extrabold text-[#101242] flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5 text-[#821616] animate-pulse shrink-0" /> Areas We Serve for laptop Service in Chennai
              </h4>
              <div className="text-gray-600 text-sm sm:text-base space-y-3 leading-relaxed">
                <p>
                  You'll find us at <span className="font-bold text-gray-900">No.91, Ground Floor, Kothari Nagar 2nd Main Road, Ramapuram, Chennai – 600089</span>.
                </p>
                <p>
                  Our service area covers <span className="font-medium text-gray-900">Ramapuram, Porur, Guindy, Ashok Nagar, Saidapet, KK Nagar, Ekkatuthangal</span>, and the surrounding neighbourhoods.
                </p>
                <p>
                  Laptop, desktop or gaming PC — we on-site PC repair in Chennai brings dependable support straight to wherever you are.
                </p>
              </div>
              <div className="w-full h-[1px] bg-gray-200/60 my-2" />
              <p className="text-[#101242] text-sm sm:text-base font-bold pt-1 max-w-2xl mx-auto">
                Whatever the requirement — repair, spare-part swap, an upgrade, or general troubleshooting — <span className="text-[#821616]">IT Fixer @199</span> handles it at your doorstep, not a counter across town.
              </p>
            </div>


          </div>
        </div>

        <div className="pt-12 w-full flex justify-center">
          <button
            onClick={() => setShowMore(!showMore)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#101242] hover:bg-[#1c1f63] active:scale-95 text-white font-bold text-sm transition-all shadow-lg hover:shadow-xl shadow-blue-900/10"
          >
            {showMore ? (
              <>
                See Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                See More <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </section>
  )
}