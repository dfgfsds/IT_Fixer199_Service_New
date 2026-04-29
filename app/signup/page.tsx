'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Mail, Lock, User, ArrowRight, Phone, Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'
import { extractErrorMessage } from '@/lib/error-utils'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }

    setLoading(true)
    try {
      const payload = {
        name,
        email,
        mobile_number: phone,
        password,
        role: 'CUSTOMER',
        // comments: 'Registered from web'
      }

      await axiosInstance.post(Api.user, payload)
      toast.success('Account created successfully! Please login.')
      router.push(`/login?phone=${phone}&email=${email}`)
    } catch (error: any) {
      console.warn('Signup error:', error.response?.data || error.message)
      toast.error(extractErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-[#101242] tracking-tight">Create Account</h1>
            <p className="text-slate-500 font-medium tracking-tight">Join IT FIX and get expert services at your door</p>
          </div>

          <div className="space-y-6">
            {/* Signup Form */}
            <form className="space-y-6" onSubmit={handleSignup}>
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#101242] uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group mt-[2px]">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#101242]">
                    <User className="w-5 h-5 text-[#101242] transition-colors group-focus-within:text-[#101242]" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#101242]/5 focus:ring-1 focus:ring-[#101242]/50 transition-all outline-none font-medium text-[#101242]"
                    placeholder="Enter your name"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#101242] uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group mt-[2px]">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#101242]">
                    <Mail className="w-5 h-5 text-[#101242] transition-colors group-focus-within:text-[#101242]" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#101242]/5 focus:ring-1 focus:ring-[#101242]/50 transition-all outline-none font-medium text-[#101242]"
                    placeholder="Enter your email address"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#101242] uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group mt-[2px]">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#101242]">
                    <Phone className="w-5 h-5 text-[#101242] transition-colors group-focus-within:text-[#101242]" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setPhone(value)
                    }}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#101242]/5 focus:ring-1 focus:ring-[#101242]/50 transition-all outline-none font-medium text-[#101242]"
                    placeholder="Enter your phone number"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#101242] uppercase tracking-widest ml-1">Password</label>
                <div className="relative group mt-[2px]">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#101242]">
                    <Lock className="w-5 h-5 text-[#101242] transition-colors group-focus-within:text-[#101242]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#101242]/5 focus:ring-1 focus:ring-[#101242]/50 transition-all outline-none font-medium text-[#101242]"
                    placeholder="Enter your password"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#101242] transition-colors outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#101242] hover:bg-[#600000] text-white font-bold transition-all shadow-none cursor-pointer hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-slate-500 font-medium pt-0">
              Already have an account?{' '}
              <Link href="/login" title='login' className="text-[#101242] font-bold hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
