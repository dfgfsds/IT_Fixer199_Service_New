'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Wrench, Activity, RotateCcw, CalendarClock, MapPin, User, Phone, IndianRupee, Loader2, Package, MessageSquare, } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import axiosInstance from '@/configs/axios-middleware'
import Api from '@/api-endpoints/ApiUrls'
import Image from 'next/image'
import { toast } from 'sonner'
import { safeErrorLog } from '@/lib/error-handler'

interface RequestDetail {
    id: string
    request_type: 'HUB_SERVICE' | 'CANCELLATION' | 'SLOT_CHANGE' | 'REFUND'
    status: string
    approval_status: 'PENDING' | 'APPROVED' | 'REJECTED'
    created_at: string
    order_id: string
    order_details: any
    order_item_details: any
    requested_date?: string
    requested_start_time?: string
    requested_end_time?: string
    slot_change_reason_type?: string
    slot_change_reason_description?: string
    cancellation_reason_type?: string
    cancellation_reason_description?: string
    refund_amount?: string
    device_serial_number?: string
    review_notes?: string
}

const getTypeInfo = (type: string) => {
    const label = type?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') || 'Request'
    switch (type) {
        case 'HUB_SERVICE': return { label, icon: <Wrench className="w-7 h-7" />, bg: 'bg-orange-50', text: 'text-orange-600', bar: 'bg-orange-500', border: 'border-orange-100' }
        case 'CANCELLATION': return { label, icon: <XCircle className="w-7 h-7" />, bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-500', border: 'border-red-100' }
        case 'SLOT_CHANGE': return { label, icon: <CalendarClock className="w-7 h-7" />, bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500', border: 'border-blue-100' }
        case 'REFUND': return { label, icon: <RotateCcw className="w-7 h-7" />, bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500', border: 'border-emerald-100' }
        default: return { label, icon: <Activity className="w-7 h-7" />, bg: 'bg-slate-50', text: 'text-slate-600', bar: 'bg-slate-400', border: 'border-slate-100' }
    }
}

const getApprovalCtx = (approvalStatus: string) => {
    switch (approvalStatus) {
        case 'PENDING': return {
            label: 'Pending Approval',
            badge: 'bg-white text-amber-600 border-amber-200',
            icon: <Clock className="w-3.5 h-3.5" />
        }
        case 'APPROVED': return {
            label: 'Approved',
            badge: 'bg-white text-emerald-600 border-emerald-200',
            icon: <CheckCircle className="w-3.5 h-3.5" />
        }
        case 'REJECTED': return {
            label: 'Rejected',
            badge: 'bg-white text-red-600 border-red-200',
            icon: <XCircle className="w-3.5 h-3.5" />
        }
        default: return {
            label: approvalStatus,
            badge: 'bg-white text-slate-600 border-slate-200',
            icon: <Activity className="w-3.5 h-3.5" />
        }
    }
}

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const { user } = useAuth()
    const [request, setRequest] = useState<RequestDetail | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (id) fetchRequestDetail()
    }, [id])

    const fetchRequestDetail = async () => {
        setLoading(true)
        try {
            const res = await axiosInstance.get(Api.requests)
            const allRequests = Array.isArray(res.data) ? res.data : (res.data?.data || [])
            const found = allRequests.find((req: any) => req.id === id)
            if (found) {
                setRequest(found)
            } else {
                try {
                    const detailRes = await axiosInstance.get(`${Api.requests}${id}/`)
                    setRequest(detailRes.data?.data || detailRes.data)
                } catch {
                    toast.error('Request not found')
                }
            }
        } catch (error: any) {
            safeErrorLog('Failed to fetch request details', error)
            toast.error('Failed to load request details')
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Header />
                <main className="flex-1 py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full animate-pulse">
                    <div className="w-32 h-4 bg-slate-200 rounded-full mb-8" />
                    <div className="w-full h-48 bg-white border border-slate-100 rounded-[40px] mb-10 p-10 flex flex-col justify-center gap-4">
                        <div className="w-1/4 h-3 bg-slate-100 rounded-full" />
                        <div className="w-1/2 h-10 bg-slate-200 rounded-2xl" />
                        <div className="w-1/3 h-4 bg-slate-100 rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-[40px] p-8 border border-slate-100 space-y-4">
                                    <div className="w-1/3 h-4 bg-slate-200 rounded-full mb-2" />
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4 bg-slate-50 rounded-3xl p-5 h-20">
                                            <div className="w-12 h-12 bg-white rounded-2xl" />
                                            <div className="flex-1 space-y-2">
                                                <div className="w-1/4 h-2 bg-slate-200 rounded-full" />
                                                <div className="w-1/2 h-4 bg-slate-200 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-8 text-center flex flex-col items-center">
                            <div className="w-full bg-white rounded-[40px] p-8 border border-slate-100 h-64" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!request) return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 text-center space-y-6">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                        <AlertCircle className="w-12 h-12 text-slate-300" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-[#101242] tracking-tight">Request Not Found</h2>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            We couldn't find the details for this service request. It might have been moved, deleted, or the ID might be incorrect.
                        </p>
                    </div>
                    <div className="pt-0">
                        <button
                            onClick={() => router.push('/profile?tab=requests')}
                            className="w-full py-4 bg-[#101242] text-white rounded-2xl font-bold text-sm hover:bg-[#600000] shadow-lg shadow-[#101242]/20 transition-all active:scale-[0.98]"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )

    const ctx = getTypeInfo(request.request_type)
    const approvalCtx = getApprovalCtx(request.approval_status)
    const orderDetails = request.order_details
    const itemDetails = request.order_item_details?.item_details?.full_details || request.order_item_details?.item_details
    const createdDate = request.created_at ? formatDate(request.created_at) : ''

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            <main className="flex-1 py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">

                {/* Back */}
                <Link href="/profile?tab=requests" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#101242] font-bold text-sm tracking-widest uppercase transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Requests
                </Link>

                {/* Status Banner */}
                <div className={`w-full rounded-[40px] p-8 md:p-10 border ${ctx.border} ${ctx.bg} relative mb-10 shadow-xl shadow-slate-200/40`}>
                    <div className="absolute inset-0 rounded-[40px] overflow-hidden pointer-events-none">
                        <div className={`absolute top-0 left-0 w-2 h-full ${ctx.bar}`} />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-black tracking-widest uppercase opacity-60">Request ID: {request.id}</span>
                            <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${ctx.text}`}>{ctx.label}</h1>
                            {createdDate && (
                                <p className="font-bold opacity-70 mt-1 text-sm">
                                    Submitted on {createdDate}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col md:items-end items-start">
                            <span className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-[11px] font-black uppercase tracking-[0.15em] shadow-sm ${approvalCtx.badge}`}>
                                {approvalCtx.icon}
                                {approvalCtx.label}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 space-y-5">
                            <h2 className="text-lg font-black text-[#101242] flex items-center gap-3">
                                <Activity className="w-5 h-5 text-slate-400" /> Request Details
                            </h2>
                            {request.request_type === 'SLOT_CHANGE' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 bg-slate-50 rounded-3xl p-5 border border-slate-100">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-blue-500 shadow-sm flex items-center justify-center shrink-0">
                                            <CalendarClock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Requested Slot</p>
                                            <p className="font-bold text-[#101242] text-lg">
                                                {request.requested_date
                                                    ? new Date(request.requested_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
                                                    : 'Not specified'}
                                            </p>
                                            {request.requested_start_time && (
                                                <p className="text-slate-500 font-medium text-sm mt-0.5">
                                                    {request.requested_start_time} – {request.requested_end_time}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {request.slot_change_reason_type && (
                                        <div className="flex items-center gap-4 bg-slate-50 rounded-3xl p-5 border border-slate-100">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 shadow-sm flex items-center justify-center shrink-0">
                                                <MessageSquare className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Reason for Change</p>
                                                <p className="font-bold text-[#101242]">{request.slot_change_reason_type.split('_').join(' ')}</p>
                                                {request.slot_change_reason_description && (
                                                    <p className="text-slate-500 font-medium text-sm mt-0.5 italic">"{request.slot_change_reason_description}"</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {request.request_type === 'CANCELLATION' && (
                                <div className="flex items-center gap-4 bg-red-50/50 rounded-3xl p-5 border border-red-100">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-red-100 text-red-500 shadow-sm flex items-center justify-center shrink-0">
                                        <XCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Cancellation Reason</p>
                                        <p className="font-bold text-[#101242] capitalize">
                                            {request.cancellation_reason_type?.split('_').join(' ').toLowerCase() || 'Not specified'}
                                        </p>
                                        {request.cancellation_reason_description && (
                                            <p className="text-slate-500 font-medium text-sm mt-0.5">{request.cancellation_reason_description}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {request.request_type === 'REFUND' && (
                                <div className="flex items-center gap-4 bg-emerald-50/50 rounded-3xl p-5 border border-emerald-100">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-100 text-emerald-500 shadow-sm flex items-center justify-center shrink-0">
                                        <IndianRupee className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Expected Refund</p>
                                        <p className="font-black text-[#101242] text-2xl">₹{request.refund_amount || '0.00'}</p>
                                    </div>
                                </div>
                            )}

                            {request.request_type === 'HUB_SERVICE' && (
                                <div className="flex items-center gap-4 bg-orange-50/50 rounded-3xl p-5 border border-orange-100">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-orange-100 text-orange-500 shadow-sm flex items-center justify-center shrink-0">
                                        <Wrench className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Hub Service Request</p>
                                        <p className="font-bold text-[#101242]">Device submitted for in-hub repair</p>
                                        {request.device_serial_number && (
                                            <p className="text-slate-500 font-medium text-sm mt-0.5">S/N: {request.device_serial_number}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {request.review_notes && (
                                <div className="flex items-start gap-4 bg-slate-50 rounded-3xl p-5 border border-slate-100">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#101242] shadow-sm flex items-center justify-center shrink-0">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#101242] uppercase tracking-widest mb-1">Review Notes from Team</p>
                                        <p className="text-slate-600 font-medium italic">"{request.review_notes}"</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Customer & Location Box */}
                        {orderDetails && (
                            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 space-y-5">
                                <h2 className="text-lg font-black text-[#101242] flex items-center gap-3">
                                    <User className="w-5 h-5 text-slate-400" /> Customer & Address
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 bg-slate-50 rounded-3xl p-5 border border-slate-100">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 shadow-sm flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                                            <p className="font-bold text-[#101242]">{orderDetails.customer_name}</p>
                                            <p className="text-slate-500 font-medium text-sm mt-0.5">+91 {orderDetails.customer_number}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 bg-slate-50 rounded-3xl p-5 border border-slate-100">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 shadow-sm flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Service Address</p>
                                            <p className="font-bold text-[#101242] leading-relaxed">{orderDetails.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Impacted Items Box */}
                        {itemDetails && (
                            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 space-y-5">
                                <h2 className="text-lg font-black text-[#101242] flex items-center gap-3">
                                    <Package className="w-5 h-5 text-slate-400" /> Booked Items
                                </h2>
                                <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
                                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white border border-slate-100 shrink-0">
                                        {itemDetails?.media_files?.[0]?.image_url ? (
                                            <Image
                                                src={itemDetails.media_files[0].image_url}
                                                alt={itemDetails.name || 'Item'}
                                                fill
                                                className="object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png' }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">🛠️</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Service Item</p>
                                        <p className="font-bold text-[#101242] truncate">{itemDetails.name || 'Service'}</p>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">Quantity: {request.order_item_details?.quantity || 1}</p>
                                    </div>
                                    <p className="font-black text-[#101242] text-lg shrink-0">₹{request.order_item_details?.price || '0.00'}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-8">
                        {orderDetails && (
                            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 space-y-5">
                                <h2 className="text-lg font-black text-[#101242] flex items-center gap-3">
                                    <IndianRupee className="w-5 h-5 text-slate-400" /> Order Summary
                                </h2>
                                <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-slate-500 text-sm">Order Total</span>
                                        <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 text-slate-600">₹{orderDetails.total_price}</span>
                                    </div>
                                    <div className="w-full h-px bg-slate-300" />
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-slate-500 text-sm">Order Status</span>
                                        <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 text-slate-500">
                                            {orderDetails.order_status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-slate-500 text-sm">Payment</span>
                                        <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${orderDetails.payment_status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {orderDetails.payment_status || 'PENDING'}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href={`/orders/${orderDetails.id}`}
                                    className="w-full flex items-center justify-center py-4 bg-slate-100 text-[#101242] rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
                                >
                                    View Full Order
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
