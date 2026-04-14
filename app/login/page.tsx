'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Mail, Lock, ArrowRight, Phone, Smartphone, Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import { safeErrorLog } from '@/lib/error-handler'
import { useAuth } from '@/context/auth-context'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isLoggedIn } = useAuth()
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('mobile')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [ipAddress, setIpAddress] = useState('0.0.0.0')
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Handle pre-filled phone/email from signup
  useEffect(() => {
    const prefilledPhone = searchParams.get('phone')
    const prefilledEmail = searchParams.get('email')

    if (prefilledPhone) setPhone(prefilledPhone)
    if (prefilledEmail) setEmail(prefilledEmail)

    if (prefilledPhone || prefilledEmail) {
      setLoginMethod('mobile')
    }
  }, [searchParams])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/profile')
    }
  }, [isLoggedIn, router])

  // Fetch IP address
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch(Api.getIp)
        const data = await response.json()
        setIpAddress(data.data?.ip || data.ip || '0.0.0.0')
      } catch (error) {
        safeErrorLog('Error fetching IP', error)
      }
    }
    fetchIp()
  }, [])

  const getDeviceInfo = () => {
    if (typeof window === 'undefined') return {
      deviceId: '',
      deviceName: 'Server',
      deviceType: 'WEB'
    }

    let deviceId = localStorage.getItem('device_id')
    if (!deviceId) {
      deviceId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      localStorage.setItem('device_id', deviceId)
    }

    return {
      deviceId,
      deviceName: window.navigator.userAgent.substring(0, 50),
      deviceType: 'WEB',
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (loginMethod === 'mobile') {
      if (phone.length !== 10) {
        setLoading(false)
        toast.error('Please enter a valid 10-digit mobile number')
        return
      }
    }

    const deviceInfo = getDeviceInfo()

    let payload: any = {
      role: 'CUSTOMER',
    }

    if (loginMethod === 'email') {
      payload = {
        ...payload,
        login_type: 'PASSWORD',
        username: email,
        password: password,
        device_type: deviceInfo.deviceType,
        device_id: deviceInfo.deviceId,
        device_name: deviceInfo.deviceName,
        ip_address: ipAddress,
      }
    } else {
      payload = {
        ...payload,
        login_type: 'OTP',
        mobile_number: Number(phone),
        device_type: deviceInfo.deviceType,
        device_id: deviceInfo.deviceId,
        device_name: deviceInfo.deviceName,
        ip_address: ipAddress,
      }
    }

    try {
      const response = await axiosInstance.post(Api.login, payload)

      if (loginMethod === 'email') {
        const body = response?.data
        const data = body?.data || body
        const token = data?.tokens?.access || data?.access_token || data?.token

        if (token) {
          login(response)
          toast.success('Successfully logged in!')
          router.push('/')
        } else {
          const errorMsg = body?.message || data?.message || 'Login failed. Invalid credentials.'
          toast.error(errorMsg)
        }
      } else {
        toast.success('OTP sent successfully!')
        localStorage.setItem('pending_phone', phone)
        router.push('/login/verify')
      }
    } catch (error: any) {
      console.warn('Login error:', error.response?.data || error.message)
      const res = error.response?.data
      const errorMessage = res?.errors?.[0] || res?.message || res?.error || 'Login failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        {!mounted ? (
          <div className="max-w-md w-full h-[500px] bg-white rounded-[40px] animate-pulse flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-sm">
            Loading...
          </div>
        ) : (
          <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black text-[#101242] tracking-tight">Welcome Back</h1>
              <p className="text-slate-500 font-medium tracking-tight">Select your preferred login method</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setLoginMethod('mobile')}
                  className={`flex items-center justify-center gap-3 px-4 py-4 rounded-2xl border transition-all font-bold text-sm ${loginMethod === 'mobile' ? 'bg-[#101242] border-[#101242] text-white shadow-none' : 'bg-slate-50 border-slate-200 text-[#101242] hover:bg-slate-100'}`}
                >
                  <Smartphone className="w-5 h-5" />
                  Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`flex items-center justify-center gap-3 px-4 py-4 rounded-2xl border transition-all font-bold text-sm ${loginMethod === 'email' ? 'bg-[#101242] border-[#101242] text-white shadow-none' : 'bg-slate-50 border-slate-200 text-[#101242] hover:bg-slate-100'}`}
                >
                  <Mail className="w-5 h-5" />
                  Email
                </button>
              </div>

              {/* Login Form */}
              <form className="space-y-6" onSubmit={handleLogin}>
                {loginMethod === 'mobile' ? (
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
                        placeholder="Enter mobile number"
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <>
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

                    <div className="space-y-2">

                      {/* 
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                        <Link href="/forgot-password" title='forgot password' className="text-xs font-bold text-[#101242] hover:text-[#600000] tracking-widest uppercase">Forgot?</Link>
                      </div> 
                      */}
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
                          className="absolute cursor-pointer inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#101242] transition-colors outline-none"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#101242] hover:bg-[#600000] text-white font-bold transition-all shadow-none shadow-[#101242]/20 hover:shadow-[#101242]/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {loginMethod === 'mobile' ? 'Get OTP' : 'Sign In'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-slate-500 font-medium pt-0">
                Don't have an account?{' '}
                <Link href="/signup" title='signup' className="text-[#101242] font-bold hover:underline">Create one</Link>
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full h-[500px] bg-white rounded-[40px] animate-pulse flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-sm">
            Loading...
          </div>
        </main>
        <Footer />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
