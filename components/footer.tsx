'use client'

import Image from 'next/image'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-100">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-4 md:pb-7">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 lg:gap-12 mb-10 md:mb-14">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="ServeNow"
                  width={150}
                  height={40}
                  className="h-full w-auto object-contain"
                />
              </Link>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-semibold">
              Professional home services delivered with excellence and trust at your doorstep. We are your partner for all home care needs.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/itfixerat199" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 flex items-center justify-center transition-all text-slate-400 hover:text-[#1877f2]">
                <Facebook className="w-5 h-5 fill-current border-none" strokeWidth={0} />
              </a>
              <a href="https://twitter.com/itfixerat199" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 flex items-center justify-center transition-all text-slate-400 hover:text-black">
                <Twitter className="w-5 h-5 fill-current border-none" strokeWidth={0} />
              </a>
              <a href="https://www.instagram.com/it.fixerat_199" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 flex items-center justify-center transition-all text-slate-400 hover:text-[#e1306c]">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@Itfixerat199" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 flex items-center justify-center transition-all text-slate-400 hover:text-[#ff0000]">
                <Youtube className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a href="https://www.linkedin.com/in/itfixerat199/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 flex items-center justify-center transition-all text-slate-400 hover:text-[#0077b5]">
                <Linkedin className="w-5 h-5 fill-current border-none" strokeWidth={0} />
              </a>
            </div>
          </div>


          {/* Company */}
          <div className="text-left lg:mx-auto">
            <h3 className="text-lg mb-4 font-bold text-slate-900">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-slate-500 hover:text-[#101242] font-semibold transition-colors text-sm">Home</Link></li>
              <li><Link href="/about" className="text-slate-500 hover:text-[#101242] font-semibold transition-colors text-sm">About us</Link></li>
              <li><Link href="/categories" className="text-slate-500 hover:text-[#101242] font-semibold transition-colors text-sm">Categories</Link></li>
              <li><Link href="/services" className="text-slate-500 hover:text-[#101242] font-semibold transition-colors text-sm">Services</Link></li>
              <li><Link href="/products" className="text-slate-500 hover:text-[#101242] font-semibold transition-colors text-sm">Products</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg mb-4.5 font-bold text-slate-900">Get in Touch</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=No.91,+Ground+Floor,+Kothari+Nagar,+2nd+Main+Road,+Ramapuram,+Chennai+-+600089"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:opacity-80 transition-opacity group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#101242]/5 group-hover:border-[#101242]/20 transition-colors">
                    <MapPin className="w-5 h-5 text-[#101242]" />
                  </div>
                  <div className="text-sm">
                    <p className="text-slate-500 font-semibold group-hover:text-[#101242] transition-colors">
                      No.91, Ground Floor, <br />Kothari Nagar
                      2nd Main Road, <br />Ramapuram, <br />
                      Chennai - 600089
                    </p>
                  </div>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#101242]" />
                </div>
                <a href="tel:+919385939985" className="text-sm font-semibold text-slate-500 hover:text-[#101242] transition-colors">+91 9385939985</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#101242]" />
                </div>
                <a href="mailto:info@itfixer199.com" className="text-sm font-semibold text-slate-500 hover:text-[#101242] transition-colors">info@itfixer199.com</a>
              </li>
            </ul>
          </div>

          {/* Download App */}
          <div className="text-left">
            <h3 className="text-lg mb-4 font-bold text-slate-900">Download App</h3>
            <p className="text-slate-500 mb-4 text-sm font-semibold pr-4">
              Get the IT Fixer app for the best experience. Book services on the go!
            </p>
            <a
              href="https://play.google.com/store/apps/details?id=in.itfixer199.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-transform hover:-translate-y-1 active:scale-95"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-12 w-auto"
              />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-400 my-6"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm space-y-4 md:space-y-0">
          <div className="flex items-center gap-4">
            <p>&copy; 2026 IT Fixer @ 199. All rights reserved.</p>
          </div>
          <div className="flex gap-4 md:gap-5">
            <Link href="/privacy-policy" className="hover:text-slate-600 font-medium transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-slate-600 font-medium transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
