// 'use client'

// import { useState } from 'react'
// import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

// const FAQS = [
//   {
//     q: 'Why choose IT Fixer @199 instead of other computer services in Chennai?',
//     a: 'IT Fixer @199 offers on-site laptop, desktop, and PC support with transparent pricing from ₹199. Our technicians inspect the device, explain the issue clearly and provide practical repair or replacement solutions.'
//   },
//   {
//     q: 'Do you provide doorstep laptop repair for home and office users?',
//     a: 'Yes, we provide on-site support for homes, offices, students, and businesses. Our technician handles laptop diagnosis, software issues, booting problems, display issues, overheating, keyboard faults and basic performance fixes.'
//   },
//   {
//     q: 'What laptop maintenance issues do you handle?',
//     a: 'We handle fan noise, overheating, blue screen errors, Windows crash repair, virus removal, SSD upgrade, RAM upgrade, data backup, hard disk failure, charger pin issues and broken laptop screen replacement.'
//   },
//   {
//     q: 'Can IT Fixer @199 repair laptops, desktops, and gaming PCs?',
//     a: 'Yes, we support all branded laptops, desktop PCs, gaming systems, workstations, and accessories. As a leading Laptop repair services in Chennai, we provide diagnosis, repair, upgrades and genuine spare part replacement.'
//   },
//   {
//     q: 'Do you provide genuine spare parts and repair assurance?',
//     a: 'Yes, we use compatible and genuine spare parts wherever needed. As a trusted computer services in Chennai, we explain the issue, part cost and service warranty details clearly before replacement, for complete transparency.'
//   },
//   {
//     q: 'How quickly can you solve laptop or PC problems in Chennai?',
//     a: 'Many common issues can be resolved during the first visit, depending on the problem and spare part availability. We offer same day laptop service for slow systems, software errors, display issues, storage upgrades and basic hardware fixes.'
//   }
// ]

// export function Faq() {
//   const [openIndex, setOpenIndex] = useState<number | null>(null)

//   const toggleFAQ = (index: number) => {
//     setOpenIndex(openIndex === index ? null : index)
//   }

//   return (
//     <>
//       <section className=" bg-gray-50/50 mb-10">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

//           {/* Header text center-la align pannaachu */}
//           <div className="text-center space-y-3 mb-12">
//             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101242]/5 text-[#101242] text-xs font-bold uppercase tracking-wider">
//               <HelpCircle className="w-3.5 h-3.5" /> FAQ
//             </div>
//             <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
//               Frequently Asked Questions
//             </h2>
//             <p className="text-gray-500 max-w-xl text-sm sm:text-base">
//               Got questions? We have got answers. Everything you need to know about our services.
//             </p>
//           </div>

//           {/* FAQs List Wrapper - Perfectly Centered Grid Content */}
//           <div className="w-full space-y-4">
//             {FAQS.map((faq, index) => {
//               const isOpen = openIndex === index
//               return (
//                 <div
//                   key={index}
//                   className="bg-white border border-gray-100 hover:border-gray-200 rounded-2xl shadow-sm transition-all duration-300 overflow-hidden"
//                 >
//                   {/* Question Area - Requested as h5 layout style */}
//                   <button
//                     onClick={() => toggleFAQ(index)}
//                     className="w-full flex items-center justify-between gap-4 p-5 text-left focus:outline-none transition-colors duration-200"
//                   >
//                     <h5 className="text-base sm:text-lg font-bold text-gray-900 pr-4 leading-snug">
//                       {faq.q}
//                     </h5>
//                     <div className={`p-1.5 rounded-full transition-transform duration-300 ${isOpen ? 'bg-[#101242] text-white rotate-180' : 'bg-gray-50 text-gray-500'}`}>
//                       <ChevronDown className="w-4 h-4" />
//                     </div>
//                   </button>

//                   {/* Smooth Collapsible Answer Section */}
//                   <div
//                     className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[300px] border-t border-gray-50 bg-gray-50/30' : 'max-h-0'
//                       }`}
//                   >
//                     <p className="p-5 text-sm sm:text-base text-gray-600 leading-relaxed">
//                       {faq.a}
//                     </p>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>

//         </div>
//       </section>
//     </>
//   )
// }


'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle, CheckCircle2 } from 'lucide-react'

const FAQS = [
  {
    q: '1. Which doorstep laptop service in Chennai can fix a broken screen or keyboard issue same day?',
    a: 'IT Fixer @199 sends a technician to your location to diagnose screen, keyboard, and battery issues on the spot, with most common repairs completed during that same visit.'
  },
  {
    q: "2. Is there an honest, affordable Laptop service in Chennai that doesn't add hidden charges?",
    a: 'IT Fixer @199 charges a flat ₹199 visit fee covering inspection, diagnosis, and consultation — the technician confirms any repair cost before starting work, so there are no surprise add-ons.'
  },
  {
    q: '3. How much does a genuine pc repair service in Chennai typically cost for a home visit?',
    a: 'Every visit starts at ₹199, which includes inspection and diagnosis; if a part needs replacing, the technician shares the exact cost upfront before any work begins.'
  },
  {
    q: '4. What should I look for in the best PC repair service in Chennai for both laptops and desktops?',
    a: 'Look for transparent pricing, genuine spare parts, certified technicians, and doorstep visits — IT Fixer @199 covers laptops, desktops and gaming PCs under one service with 5000+ customers served across 20+ locations.'
  },
  {
    q: '5. Can a technician fix my gaming PC or desktop at home instead of a shop?',
    a: 'Yes — our on-site PC repair in Chennai covers gaming PCs, desktops, and workstations, with technicians diagnosing hardware and software issues directly at your doorstep.'
  },
  {
    q: '6. How quickly can I get same-day repair support in Chennai?',
    a: 'Most common issues are resolved during the same visit when compatible spare parts are available, making our on-site PC repair in Chennai one of the fastest doorstep options for urgent repairs.'
  }
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

        {/* Header Section with Enhanced Design */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#821616]/10 text-[#821616] text-xs font-bold uppercase tracking-wider border border-[#821616]/20 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5" /> FAQs
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          {/* <p className="text-gray-500 max-w-xl text-sm sm:text-base leading-relaxed">
            Got questions about our ₹199 doorstep computer service? Everything you need to know about our repair process in Chennai.
          </p> */}
        </div>

        {/* FAQs List Wrapper with Refined Card UI */}
        <div className="w-full space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-[#821616]/30 shadow-md ring-1 ring-[#821616]/10'
                    : 'bg-white/80 hover:bg-white border-gray-200/80 hover:border-gray-300 shadow-sm'
                }`}
              >
                {/* Question Area */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left focus:outline-none transition-colors duration-200 group"
                >
                  <h5 className={`text-base sm:text-lg font-bold transition-colors duration-200 pr-2 leading-snug ${
                    isOpen ? 'text-[#821616]' : 'text-gray-900 group-hover:text-[#101242]'
                  }`}>
                    {faq.q}
                  </h5>
                  <div className={`p-2 rounded-xl shrink-0 transition-all duration-300 ${
                    isOpen 
                      ? 'bg-[#821616] text-white rotate-180 shadow-sm' 
                      : 'bg-gray-100 text-gray-500 group-hover:bg-[#101242] group-hover:text-white'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Collapsible Answer Section */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[300px] border-t border-gray-100 bg-gray-50/50' : 'max-h-0'
                  }`}
                >
                  <div className="p-5 flex gap-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-[#821616] shrink-0 mt-0.5" />
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}