'use client'

import Image from 'next/image'
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-100">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
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
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">
              Professional home services delivered with excellence and trust at your doorstep. We are your partner for all home care needs.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 flex items-center justify-center transition-all text-slate-400 hover:text-slate-600">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 flex items-center justify-center transition-all text-slate-400 hover:text-slate-600">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 flex items-center justify-center transition-all text-slate-400 hover:text-slate-600">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 flex items-center justify-center transition-all text-slate-400 hover:text-slate-600">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>


          {/* Company */}
          <div className="space-y-6 text-left">
            <h3 className="text-lg font-bold text-slate-900">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-slate-500 hover:text-[#800000] font-medium transition-colors text-sm">About IT Fixer</Link></li>
              <li><Link href="/blog" className="text-slate-500 hover:text-[#800000] font-medium transition-colors text-sm">Our Blog</Link></li>
              <li><Link href="/" className="text-slate-500 hover:text-[#800000] font-medium transition-colors text-sm">How it Works</Link></li>
              <li><Link href="/" className="text-slate-500 hover:text-[#800000] font-medium transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="/" className="text-slate-500 hover:text-[#800000] font-medium transition-colors text-sm">Careers</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-6 text-left">
            <h3 className="text-lg font-bold text-slate-900">User Account</h3>
            <ul className="space-y-3">
              <li><Link href="/login" className="text-slate-500 hover:text-[#800000] font-medium transition-colors text-sm">Sign In</Link></li>
              <li><Link href="/signup" className="text-slate-500 hover:text-[#800000] font-medium transition-colors text-sm">Create Account</Link></li>
              <li><Link href="/profile" className="text-slate-500 hover:text-[#800000] font-medium transition-colors text-sm">My Profile</Link></li>
              <li><Link href="/forgot-password" className="text-slate-500 hover:text-[#800000] font-medium transition-colors text-sm">Forgot Password</Link></li>
              <li><Link href="/cart" className="text-slate-500 hover:text-[#800000] font-medium transition-colors text-sm">My Cart</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#800000]" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-slate-900">Headquarters</p>
                  <p className="text-slate-500">123 Service Street, Business Hub, Hyderabad</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#800000]" />
                </div>
                <a href="tel:+911234567890" className="text-sm font-bold text-slate-900 hover:text-[#800000] transition-colors">+91 1234-567-890</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#800000]" />
                </div>
                <a href="mailto:support@servenow.com" className="text-sm font-bold text-slate-900 hover:text-[#800000] transition-colors">itfixer@199.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-10"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm space-y-4 md:space-y-0">
          <div className="flex items-center gap-4">
            <p>&copy; 2026 IT Fixer @ 199. All rights reserved.</p>
          </div>
          <div className="flex gap-8">
            <Link href="/" className="hover:text-slate-600 font-medium transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-600 font-medium transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-slate-600 font-medium transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
