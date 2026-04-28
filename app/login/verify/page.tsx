'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ArrowRight, Loader2, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { extractErrorMessage } from '@/lib/error-utils'

export default function VerifyOTPPage() {
  const router = useRouter()
  const { login, isLoggedIn } = useAuth()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [phone, setPhone] = useState('')

  useEffect(() => {
    // Get phone or redirect if not found
    const storedPhone = localStorage.getItem('pending_phone')
    if (!storedPhone) {
      router.push('/login')
    } else {
      setPhone(storedPhone)
    }
  }, [router])

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/')
    }
  }, [isLoggedIn, router])

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (loading || otp.length !== 6) return

    setLoading(true)

    // Device info
    let deviceId = localStorage.getItem('device_id')
    if (!deviceId) {
      deviceId = Math.random().toString(36).substring(2, 15)
      localStorage.setItem('device_id', deviceId)
    }

    let ip = '0.0.0.0'
    try {
      const ipRes = await fetch(Api.getIp)
      const ipData = await ipRes.json()
      ip = ipData.data?.ip || ipData.ip || '0.0.0.0'
    } catch (e) { }

    try {
      const response = await axiosInstance.post(Api.verifyOtp, {
        login_type: 'OTP',
        otp: otp,
        mobile_number: Number(phone),
        role: 'CUSTOMER',
        device_type: 'WEB',
        device_id: deviceId,
        device_name: typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) : 'Web Browser',
        ip_address: ip
      })

      const body = response.data;
      const data = body?.data || body;
      const token = data?.tokens?.access || data?.access_token || data?.token;

      if (token) {
        login(response)
        toast.success('Verification successful!')
        localStorage.removeItem('pending_phone')
        router.push('/')
      } else {
        const errorMsg = body?.message || data?.message || 'Invalid verification code.'
        toast.error(errorMsg)
      }
    } catch (error: any) {
      console.warn('Verify error:', error.response?.data || error.message)
      toast.error(extractErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resending) return
    setResending(true)
    try {
      const deviceId = localStorage.getItem('device_id')
      let ipAddress = '0.0.0.0'
      try {
        const ipRes = await fetch(Api.getIp)
        const ipData = await ipRes.json()
        ipAddress = ipData.data?.ip || ipData.ip || '0.0.0.0'
      } catch (e) { }

      await axiosInstance.post(Api.login, {
        role: 'CUSTOMER',
        login_type: 'OTP',
        mobile_number: Number(phone),
        device_type: 'WEB',
        device_id: deviceId,
        device_name: typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) : 'Web Browser',
        ip_address: ipAddress
      })
      toast.success('OTP resent successfully!')
    } catch (error: any) {
      toast.error(extractErrorMessage(error))
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center">
          <div className="space-y-1">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#101242]/10 mb-4">
              <KeyRound className="w-8 h-8 text-[#101242]" />
            </div>
            <h1 className="text-3xl font-black text-[#101242] tracking-tight">Verify Phone</h1>
            <p className="text-slate-500 font-medium tracking-tight">
              Enter the 6-digit code sent to <br />
              <span className="text-[#101242] font-bold"> {phone} </span>
            </p>
          </div>

          <div className="space-y-6">
            <form className="space-y-8 flex flex-col items-center" onSubmit={handleVerify}>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                disabled={loading}
                pattern={REGEXP_ONLY_DIGITS}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-12 h-14 text-xl font-bold bg-slate-50 rounded-xl border-l border-y border-r" />
                  <InputOTPSlot index={1} className="w-12 h-14 text-xl font-bold bg-slate-50 rounded-xl border-l border-y border-r" />
                  <InputOTPSlot index={2} className="w-12 h-14 text-xl font-bold bg-slate-50 rounded-xl border-l border-y border-r" />
                  <InputOTPSlot index={3} className="w-12 h-14 text-xl font-bold bg-slate-50 rounded-xl border-l border-y border-r" />
                  <InputOTPSlot index={4} className="w-12 h-14 text-xl font-bold bg-slate-50 rounded-xl border-l border-y border-r" />
                  <InputOTPSlot index={5} className="w-12 h-14 text-xl font-bold bg-slate-50 rounded-xl border-l border-y border-r" />
                </InputOTPGroup>
              </InputOTP>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex cursor-pointer items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#101242] hover:bg-[#800000] text-white font-bold transition-all shadow-none hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Verify OTP
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="space-y-1 pt-[2px] border-t border-slate-50">
              <p className="text-slate-500 font-medium">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-[#101242] font-bold hover:underline disabled:opacity-50 cursor-pointer"
                  type="button"
                >
                  {resending ? 'Resending...' : 'Resend Code'}
                </button>
              </p>

              <Link
                href="/login"
                className="inline-block text-xs font-bold text-slate-500 hover:text-[#101242] uppercase tracking-widest transition-colors"
              >
                Change Phone Number
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
