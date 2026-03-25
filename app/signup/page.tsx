'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Mail, Lock, User, ArrowRight, Phone } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-[#1a1c2e] tracking-tight">Create Account</h1>
            <p className="text-slate-500 font-medium tracking-tight">Join IT FIX and get expert services at your door</p>
          </div>

          <div className="space-y-8">
            {/* Signup Form */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#800000]">
                    <User className="w-5 h-5 text-slate-300 transition-colors group-focus-within:text-[#800000]" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#800000]/20 focus:ring-4 focus:ring-[#800000]/5 transition-all outline-none font-medium text-[#1a1c2e]"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#800000]">
                    <Mail className="w-5 h-5 text-slate-300 transition-colors group-focus-within:text-[#800000]" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#800000]/20 focus:ring-4 focus:ring-[#800000]/5 transition-all outline-none font-medium text-[#1a1c2e]"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#800000]">
                    <Phone className="w-5 h-5 text-slate-300 transition-colors group-focus-within:text-[#800000]" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#800000]/20 focus:ring-4 focus:ring-[#800000]/5 transition-all outline-none font-medium text-[#1a1c2e]"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#800000]">
                    <Lock className="w-5 h-5 text-slate-300 transition-colors group-focus-within:text-[#800000]" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#800000]/20 focus:ring-4 focus:ring-[#800000]/5 transition-all outline-none font-medium text-[#1a1c2e]"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#800000] hover:bg-[#600000] text-white font-bold transition-all shadow-xl shadow-[#800000]/20 hover:shadow-[#800000]/30 hover:-translate-y-0.5"
              >
                Create Account
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <p className="text-center text-slate-500 font-medium pt-4">
              Already have an account?{' '}
              <Link href="/login" title='login' className="text-[#800000] font-bold hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
