'use client'

import { ShoppingBag } from 'lucide-react'

export function ShopButton() {
  return (
    <a
      href="https://www.itfixer.in/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Shop Products"
      className="group fixed right-0 top-1/2 -translate-y-1/2 z-50
        flex flex-col items-center gap-2
        bg-[#101242] hover:bg-[#800000] text-white
        px-3 py-4 rounded-tl-[10px] rounded-bl-[10px]
        shadow-xl shadow-[#101242]/30
        hover:shadow-[#800000]/30
        transition-all duration-300 ease-in-out"
    >
      <span
        className="text-[12px] font-black uppercase tracking-widest whitespace-nowrap select-none"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
      >
        Shop Products
      </span>
      <ShoppingBag
        className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ transform: 'rotate(270deg)' }}
      />
    </a>
  )
}
