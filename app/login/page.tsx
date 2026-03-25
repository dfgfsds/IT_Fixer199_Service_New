'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Mail, Lock, ArrowRight, Phone, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('mobile')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-[#1a1c2e] tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 font-medium tracking-tight">Select your preferred login method</p>
          </div>

          <div className="space-y-8">
            {/* Login Method Toggle */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setLoginMethod('mobile')}
                className={`flex items-center justify-center gap-3 px-4 py-4 rounded-2xl border transition-all font-bold text-sm ${loginMethod === 'mobile' ? 'bg-[#800000] border-[#800000] text-white shadow-lg shadow-[#800000]/20' : 'bg-slate-50 border-slate-200 text-[#1a1c2e] hover:bg-slate-100'}`}
              >
                <Smartphone className="w-5 h-5" />
                Mobile
              </button>
              <button 
                onClick={() => setLoginMethod('email')}
                className={`flex items-center justify-center gap-3 px-4 py-4 rounded-2xl border transition-all font-bold text-sm ${loginMethod === 'email' ? 'bg-[#800000] border-[#800000] text-white shadow-lg shadow-[#800000]/20' : 'bg-slate-50 border-slate-200 text-[#1a1c2e] hover:bg-slate-100'}`}
              >
                <Mail className="w-5 h-5" />
                Email
              </button>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {loginMethod === 'mobile' ? (
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
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>
                </div>
              ) : (
                <>
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

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                      <Link href="/forgot-password" title='forgot password' className="text-xs font-bold text-[#800000] hover:text-[#600000] tracking-widest uppercase">Forgot?</Link>
                    </div>
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
                </>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#800000] hover:bg-[#600000] text-white font-bold transition-all shadow-xl shadow-[#800000]/20 hover:shadow-[#800000]/30 hover:-translate-y-0.5"
              >
                {loginMethod === 'mobile' ? 'Get OTP' : 'Sign In'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <p className="text-center text-slate-500 font-medium pt-4">
              Don't have an account?{' '}
              <Link href="/signup" title='signup' className="text-[#800000] font-bold hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
