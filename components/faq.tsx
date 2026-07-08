'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

const FAQS = [
  {
    q: 'Why choose IT Fixer @199 instead of other computer services in Chennai?',
    a: 'IT Fixer @199 offers on-site laptop, desktop, and PC support with transparent pricing from ₹199. Our technicians inspect the device, explain the issue clearly and provide practical repair or replacement solutions.'
  },
  {
    q: 'Do you provide doorstep laptop repair for home and office users?',
    a: 'Yes, we provide on-site support for homes, offices, students, and businesses. Our technician handles laptop diagnosis, software issues, booting problems, display issues, overheating, keyboard faults and basic performance fixes.'
  },
  {
    q: 'What laptop maintenance issues do you handle?',
    a: 'We handle fan noise, overheating, blue screen errors, Windows crash repair, virus removal, SSD upgrade, RAM upgrade, data backup, hard disk failure, charger pin issues and broken laptop screen replacement.'
  },
  {
    q: 'Can IT Fixer @199 repair laptops, desktops, and gaming PCs?',
    a: 'Yes, we support all branded laptops, desktop PCs, gaming systems, workstations, and accessories. As a leading Laptop repair services in Chennai, we provide diagnosis, repair, upgrades and genuine spare part replacement.'
  },
  {
    q: 'Do you provide genuine spare parts and repair assurance?',
    a: 'Yes, we use compatible and genuine spare parts wherever needed. As a trusted computer services in Chennai, we explain the issue, part cost and service warranty details clearly before replacement, for complete transparency.'
  },
  {
    q: 'How quickly can you solve laptop or PC problems in Chennai?',
    a: 'Many common issues can be resolved during the first visit, depending on the problem and spare part availability. We offer same day laptop service for slow systems, software errors, display issues, storage upgrades and basic hardware fixes.'
  }
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      <section className=" bg-gray-50/50 mb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

          {/* Header text center-la align pannaachu */}
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101242]/5 text-[#101242] text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" /> FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 max-w-xl text-sm sm:text-base">
              Got questions? We have got answers. Everything you need to know about our services.
            </p>
          </div>

          {/* FAQs List Wrapper - Perfectly Centered Grid Content */}
          <div className="w-full space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-100 hover:border-gray-200 rounded-2xl shadow-sm transition-all duration-300 overflow-hidden"
                >
                  {/* Question Area - Requested as h5 layout style */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left focus:outline-none transition-colors duration-200"
                  >
                    <h5 className="text-base sm:text-lg font-bold text-gray-900 pr-4 leading-snug">
                      {faq.q}
                    </h5>
                    <div className={`p-1.5 rounded-full transition-transform duration-300 ${isOpen ? 'bg-[#101242] text-white rotate-180' : 'bg-gray-50 text-gray-500'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Smooth Collapsible Answer Section */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[300px] border-t border-gray-50 bg-gray-50/30' : 'max-h-0'
                      }`}
                  >
                    <p className="p-5 text-sm sm:text-base text-gray-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>
    </>
  )
}