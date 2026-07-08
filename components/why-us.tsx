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
  'Service starting at ₹199',
  'Doorstep computer repair across Chennai',
  'Same day laptop service whenever possible',
  'Support for all major brands',
  'Warranty laptop repair guidance where applicable',
  'Genuine laptop spare parts',
  'Clear repair explanation',
  'Skilled computer technician support',
  'Hardware and software issue handling',
  'Gaming PC and workstation support'
]

export function WhyUs() {
  const [showMore, setShowMore] = useState(false)

  return (
    <section className="py-10 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left Content - Remains beautiful and structured left-aligned */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Why Choose <span className="text-[#101242]">IT Fixer @199?</span>
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                IT Fixer @199 is designed for customers who want fast service, fair pricing and professional technical support at their doorstep.
              </p>
              <p className="font-semibold text-gray-800">
                You can count on us for:
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {BENEFITS.map((item) => (
                <div 
                  key={item} 
                  className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100/80 hover:shadow-sm transition-all duration-200 p-3.5 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-[#101242] shrink-0" />
                  <span className="text-sm font-medium text-gray-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Final Paragraph */}
            <p className="text-gray-600 pt-2 leading-relaxed">
              From doorstep laptop repair to full desktop diagnosis, IT Fixer @199 helps customers get back to work, study, gaming and business with less downtime.
            </p>
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
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101242] tracking-tight">
        Reliable Technology Service <span className="text-[#821616] block sm:inline">at Your Doorstep</span>
      </h2>
      <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base max-w-3xl mx-auto text-justify sm:text-center">
        <p>
          <strong className="text-[#101242]">IT Fixer @199</strong> is a customer-first technology service platform built for people who need fast, reliable, and affordable computer support without visiting a service centre. We provide on-site laptop repair, desktop repair, gaming PC service, workstation support and computer accessory assistance across Chennai.
        </p>
        <p>
          Our goal is simple: make professional IT support easy to access, easy to understand and transparent in pricing. Whether your laptop has a booting problem, your desktop is running slow or your gaming PC needs hardware troubleshooting, our trained computer technician visits your location and checks the issue directly.
        </p>
        <p className="font-medium text-gray-800 bg-gray-50 py-2 px-4 rounded-xl inline-block border border-gray-100">
          🎯 With <span className="text-[#821616] font-bold">5000+ happy customers</span>, 20+ service locations and access to 3000+ spare parts, IT Fixer @199 helps users save time.
        </p>
      </div>
    </div>

    {/* Section 2 */}
    <div className="space-y-5 max-w-4xl w-full">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101242] tracking-tight">
        Customer-First Computer Support <span className="text-[#821616] block sm:inline">for Everyday Users</span>
      </h2>
      <p className="text-gray-600 leading-relaxed text-sm sm:text-base max-w-3xl mx-auto text-justify sm:text-center">
        IT Fixer @199 supports all branded laptops, desktops, gaming systems, workstations and accessories. Our team handles laptop diagnosis, software troubleshooting, hardware replacement, slow laptop fix, blue screen error, Windows crash repair, virus and malware removal, and system performance issues.
      </p>
      <p className="text-gray-600 leading-relaxed text-sm sm:text-base max-w-3xl mx-auto text-justify sm:text-center font-medium">
        As a local support platform, IT Fixer @199 provides Certified Computer Services in Chennai with a strong focus on practical diagnosis, clear communication and customer convenience.
      </p>
    </div>

    {/* Section 3 */}
    <div className="space-y-6 w-full max-w-4xl">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101242] tracking-tight">
        Affordable Computer Services <span className="text-[#821616] block sm:inline">in Chennai for Homes & Offices</span>
      </h2>
      <div className="space-y-3 text-gray-600 text-sm sm:text-base max-w-3xl mx-auto">
        <p>Professional computer support should not be complicated or costly. That is why our service visit starts at <span className="text-[#821616] font-bold">₹199</span>.</p>
        <p>The visit fee includes basic inspection, issue diagnosis, technical consultation and simple repair support wherever possible.</p>
        <p>This approach helps customers avoid confusion, hidden charges and unnecessary repair expenses.</p>
      </div>
      
      <div className="pt-4 max-w-3xl mx-auto w-full">
        <p className="font-extrabold text-[#101242] mb-5 text-base sm:text-lg flex items-center justify-center gap-2">
          <Monitor className="w-5 h-5 text-[#821616]" /> Our ₹199 service model is useful for:
        </p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
          {[
            'Home laptop users',
            'Office desktop users',
            'Students and professionals',
            'Small businesses',
            'PC users',
            'Workstation users',
            'Customers who need doorstep computer repair'
          ].map((li) => (
            <li key={li} className="flex items-center gap-3 text-sm font-semibold text-gray-700 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#821616]/20 transition-all duration-200">
              <span className="w-2 h-2 rounded-full bg-[#821616] shrink-0" />
              {li}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-gray-500 text-sm italic pt-2">
        From PC maintenance to urgent repair checks, our technicians make the process simple and transparent.
      </p>
    </div>

    {/* Section 4 */}
    <div className="space-y-6 w-full max-w-4xl">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101242] tracking-tight">
        On-Site Laptop Repair <span className="text-[#821616] block sm:inline">with Fast Diagnosis</span>
      </h2>
      <div className="space-y-3 text-gray-600 text-sm sm:text-base max-w-3xl mx-auto">
        <p>Carrying a laptop or desktop to a service centre can be difficult, especially when the device is used daily. IT Fixer @199 solves this problem with on-site laptop repair and doorstep laptop repair support across Chennai.</p>
        <p>Our technician visits your location, checks the device, identifies the fault and completes the repair wherever possible.</p>
      </div>
      
      <div className="pt-4">
        <p className="font-extrabold text-[#101242] mb-5 text-base sm:text-lg flex items-center justify-center gap-2">
          <Wrench className="w-5 h-5 text-[#821616]" /> Common issues we handle include:
        </p>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-left">
          {[
            'No display problem', 'Display issue', 'Broken laptop screen',
            'Keyboard not working', 'Battery draining fast', 'Charger pin issue',
            'Overheating laptop', 'Fan noise repair', 'Liquid damage repair',
            'BIOS issue', 'Motherboard issue', 'Hard disk failure'
          ].map((li) => (
            <li key={li} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#821616] bg-[#821616]/5 p-3 rounded-xl border border-[#821616]/10 hover:bg-[#821616]/10 transition-colors duration-150">
              <span className="w-1.5 h-1.5 rounded-full bg-[#821616] shrink-0" />
              {li}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-gray-500 text-sm italic pt-2">
        Many issues can be resolved on the same visit, especially when compatible spare parts are available.
      </p>
    </div>

    {/* Section 5 */}
    <div className="space-y-6 w-full max-w-4xl">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101242] tracking-tight">
        Top Laptop Repair Services in Chennai <span className="text-[#821616] block sm:inline">Solutions for Long-Term Performance</span>
      </h2>
      <div className="space-y-3 text-gray-600 text-sm sm:text-base max-w-3xl mx-auto">
        <p>A computer repair is not only about fixing the current issue. It is also about improving long-term performance and preventing future problems.</p>
        <p>IT Fixer @199 offers practical upgrade and maintenance solutions based on the customer’s usage. If your laptop is slow, we may recommend an SSD upgrade or RAM upgrade after checking the system condition. If the device has storage trouble, we assist with data backup and possible data recovery options.</p>
      </div>
      
      <div className="pt-4">
        <p className="font-extrabold text-[#101242] mb-5 text-base sm:text-lg flex items-center justify-center gap-2">
          <Sliders className="w-5 h-5 text-[#821616]" /> Our technical services include:
        </p>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-left">
          {[
            'SSD upgrade', 'RAM upgrade', 'Deep cleaning', 'Thermal paste replacement',
            'Operating system support', 'Windows crash repair', 'Driver issue fixing',
            'Software troubleshooting', 'Hardware troubleshooting', 'PC maintenance', 'PC optimization'
          ].map((li) => (
            <li key={li} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200/60 shadow-sm hover:border-gray-300 transition-all duration-200">
              <CheckCircle2 className="w-4 h-4 text-[#101242] shrink-0" />
              {li}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-gray-600 pt-2 text-sm max-w-3xl mx-auto">
        We also provide genuine laptop spare parts wherever replacement is required, helping improve device stability and repair quality.
      </p>
    </div>

    {/* Section 6 */}
    <div className="space-y-6 w-full max-w-4xl">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101242] tracking-tight">
        Skilled Technicians <span className="text-[#821616] block sm:inline">and Transparent Service Process</span>
      </h2>
      <div className="space-y-3 text-gray-600 text-sm sm:text-base max-w-3xl mx-auto">
        <p>IT Fixer @199 is among the trusted Laptop repair services providers in Chennai, focused on doorstep convenience, honest communication and practical repair support. We do not push unnecessary services. Our team recommends only what the device actually needs.</p>
        <p>Customers choose us because we provide Experienced Computer Services in Chennai with trained professionals who understand laptops, desktops, branded systems, gaming PCs and workstations.</p>
      </div>
      
      <div className="pt-4 max-w-2xl mx-auto w-full">
        <p className="font-extrabold text-[#101242] mb-5 text-base sm:text-lg flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#821616]" /> Our service process includes:
        </p>
        <ul className="space-y-3 text-left">
          {[
            'Inspecting the device', 'Finding the exact issue',
            'Explaining the repair requirement', 'Confirming the cost before replacement',
            'Completing the repair wherever possible', 'Testing the device after service'
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
      <p className="text-gray-500 text-sm italic">
        This helps customers feel confident before approving any repair work.
      </p>
    </div>

    {/* Section 7 - Contact & Location Footer block */}
    <div className="bg-gradient-to-br from-gray-50 to-[#821616]/5 border border-gray-100 p-8 sm:p-10 rounded-3xl space-y-4 w-full max-w-3xl mx-auto shadow-inner relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#821616]/5 rounded-full blur-2xl -mr-5 -mt-5" />
      <h4 className="text-xl sm:text-2xl font-extrabold text-[#101242] flex items-center justify-center gap-2">
        <MapPin className="w-5 h-5 text-[#821616] animate-pulse" /> Serving Chennai with Reliable IT Support
      </h4>
      <div className="text-gray-600 text-sm sm:text-base space-y-3 leading-relaxed">
        <p>
          IT Fixer @199 is located at <span className="font-bold text-gray-900">No.91, Ground Floor, Kothari Nagar 2nd Main Road, Ramapuram, Chennai - 600089</span>.
        </p>
        <p>
          We support customers in <span className="font-medium text-gray-900">Ramapuram, Porur, Guindy, Ashok Nagar, Saidapet, KK Nagar, Ekkatuthangal</span>, and nearby Chennai locations.
        </p>
      </div>
      <div className="w-full h-[1px] bg-gray-200/60 my-2" />
      <p className="text-[#101242] text-sm sm:text-base font-bold pt-1 max-w-2xl mx-auto">
        For laptop repair, desktop repair, gaming PC service, spare part replacement, upgrades or technical support, <span className="text-[#821616]">IT Fixer @199</span> brings dependable computer service directly to your doorstep.
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