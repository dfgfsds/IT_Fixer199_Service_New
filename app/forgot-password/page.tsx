'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-[#1a1c2e] tracking-tight">Recover Password</h1>
            <p className="text-slate-500 font-medium tracking-tight">Enter your email to receive reset instructions</p>
          </div>

          <div className="space-y-6">
            {!submitted ? (
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
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

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#800000] hover:bg-[#600000] text-white font-bold transition-all shadow-xl shadow-[#800000]/20 hover:shadow-[#800000]/30 hover:-translate-y-0.5"
                >
                  Send Reset Link
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6 py-4">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#1a1c2e]">Check your email</h3>
                  <p className="text-slate-500 font-medium">We've sent a password reset link to <span className="text-[#1a1c2e] font-bold">{email}</span></p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-[#800000] font-bold hover:underline"
                >
                  Didn't receive it? Try again
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-slate-50">
              <Link href="/login" className="flex items-center justify-center gap-2 text-slate-500 font-bold hover:text-[#800000] transition-colors group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
