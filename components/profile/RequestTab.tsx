'use client'

// Skeleton card
function RequestSkeleton() {
    return (
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <div className="flex items-center gap-5">
                {/* Icon box */}
                <div className="w-14 h-14 rounded-2xl bg-slate-100 shrink-0" />
                <div className="space-y-2.5">
                    {/* Request ID */}
                    <div className="h-3 w-20 bg-slate-100 rounded-full" />
                    {/* Service name */}
                    <div className="h-5 w-48 bg-slate-100 rounded-full" />
                    {/* Description */}
                    <div className="h-3 w-64 bg-slate-100 rounded-full" />
                    {/* Date */}
                    <div className="h-3 w-32 bg-slate-100 rounded-full" />
                </div>
            </div>
            <div className="flex items-center justify-end gap-6">
                <div className="text-right space-y-2">
                    <div className="h-6 w-20 bg-slate-100 rounded-full ml-auto" />
                    <div className="h-3 w-16 bg-slate-100 rounded-full ml-auto" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0" />
            </div>
        </div>
    )
}

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ClipboardList, Clock, CheckCircle, XCircle, AlertCircle, Wrench, ChevronRight, Search, Activity, RotateCcw, CalendarClock } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import axiosInstance from '@/configs/axios-middleware'
import Api from '@/api-endpoints/ApiUrls'
import { safeErrorLog } from '@/lib/error-handler'

interface ServiceRequest {
    id: string
    request_type: 'HUB_SERVICE' | 'CANCELLATION' | 'SLOT_CHANGE' | 'REFUND'
    status: string
    approval_status: 'PENDING' | 'APPROVED' | 'REJECTED'
    created_at: string
    order_id: string
    refund_amount?: string
    device_serial_number?: string
    order_item_details?: any
    order_details?: any
}


// Status config
function getStatusConfig(status: string, approvalStatus: string) {
    if (status === 'CANCELLED') {
        return {
            label: 'Cancelled',
            icon: <XCircle className="w-5 h-5" />,
            iconBg: 'bg-slate-100 text-slate-400',
            badge: 'bg-slate-100 text-slate-500 border-slate-200',
            dot: 'bg-slate-400',
        }
    }

    if (status === 'COMPLETED') {
        return {
            label: 'Completed',
            icon: <CheckCircle className="w-5 h-5" />,
            iconBg: 'bg-emerald-50 text-emerald-500',
            badge: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            dot: 'bg-emerald-400',
        }
    }

    switch (approvalStatus) {
        case 'PENDING':
            return {
                label: 'Pending Approval',
                icon: <Clock className="w-5 h-5" />,
                iconBg: 'bg-amber-50 text-amber-500',
                badge: 'bg-amber-50 text-amber-600 border-amber-100',
                dot: 'bg-amber-400',
            }
        case 'APPROVED':
            return {
                label: 'Approved',
                icon: <CheckCircle className="w-5 h-5" />,
                iconBg: 'bg-violet-50 text-violet-500',
                badge: 'bg-violet-50 text-violet-600 border-violet-100',
                dot: 'bg-violet-400',
            }
        case 'REJECTED':
            return {
                label: 'Rejected',
                icon: <XCircle className="w-5 h-5" />,
                iconBg: 'bg-red-50 text-red-500',
                badge: 'bg-red-50 text-red-600 border-red-100',
                dot: 'bg-red-400',
            }
        default:
            return {
                label: status,
                icon: <AlertCircle className="w-5 h-5" />,
                iconBg: 'bg-slate-100 text-slate-400',
                badge: 'bg-slate-100 text-slate-500 border-slate-200',
                dot: 'bg-slate-400',
            }
    }
}

function formatRequestType(type: string) {
    if (!type) return 'Request'
    return type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}

function getRequestTypeInfo(type: string) {
    const label = formatRequestType(type)
    switch (type) {
        case 'HUB_SERVICE':
            return { label, icon: <Wrench className="w-5 h-5" />, color: 'text-orange-500', bg: 'bg-orange-50' }
        case 'CANCELLATION':
            return { label, icon: <XCircle className="w-5 h-5" />, color: 'text-red-500', bg: 'bg-red-50' }
        case 'SLOT_CHANGE':
            return { label, icon: <CalendarClock className="w-5 h-5" />, color: 'text-blue-500', bg: 'bg-blue-50' }
        case 'REFUND':
            return { label, icon: <RotateCcw className="w-5 h-5" />, color: 'text-emerald-500', bg: 'bg-emerald-50' }
        default:
            return { label, icon: <Activity className="w-5 h-5" />, color: 'text-slate-500', bg: 'bg-slate-50' }
    }
}

// Main Component
export default function RequestTab() {
    const { user } = useAuth()
    const [requests, setRequests] = useState<ServiceRequest[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRequests()
    }, [user?.id])

    const fetchRequests = async () => {
        setLoading(true)
        try {
            const res = await axiosInstance.get(Api.requests)
            setRequests(Array.isArray(res.data) ? res.data : (res.data?.data || []))
        } catch (error: any) {
            safeErrorLog("Failed to fetch requests", error)
        } finally {
            setLoading(false)
        }
    }


    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-[#1a1c2e]">My Requests</h3>
                {!loading && requests.length > 0 && (
                    <span className="text-xs font-bold text-white bg-[#800000] px-3 py-1.5 rounded-full">
                        {requests.length} {requests.length === 1 ? 'Request' : 'Requests'}
                    </span>
                )}
            </div>

            {/* Content */}
            {loading ? (
                <div className="space-y-5">
                    <RequestSkeleton />
                    <RequestSkeleton />
                    <RequestSkeleton />
                </div>
            ) : requests.length === 0 ? (
                /* Empty state */
                <div className="py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <ClipboardList className="h-8 w-8 text-slate-400" />
                    </div>
                    <h2 className="text-lg font-bold text-[#1a1c2e]">No requests yet</h2>
                    <p className="text-sm text-slate-500 font-medium">
                        Submit a service request to see it listed here
                    </p>
                </div>
            ) : (
                <div className="space-y-5 text-left">
                    {requests.map((req) => {
                        const statusConfig = getStatusConfig(req.status, req.approval_status)
                        const typeInfo = getRequestTypeInfo(req.request_type)

                        // Extract service name from order_item_details if possible
                        let serviceName = typeInfo.label
                        if (req.order_item_details) {
                            try {
                                const details = typeof req.order_item_details === 'string'
                                    ? JSON.parse(req.order_item_details)
                                    : req.order_item_details

                                // Look for name in various possible locations in the API response
                                serviceName = details.item_details?.name || details.name || details.service_name || serviceName
                            } catch (e) {
                                // Fallback to type label
                            }
                        } else if (req.order_details) {
                            // If it's an order-level request (like cancellation), try to get info from order_details
                            const orderDetails = typeof req.order_details === 'string'
                                ? JSON.parse(req.order_details)
                                : req.order_details
                            if (orderDetails.id) serviceName = `${typeInfo.label}`
                        }

                        return (
                            <Link
                                href={`/requests/${req.id}`}
                                key={req.id}
                                className="bg-white p-6 rounded-[32px] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-xl hover:border-[#800000]/20 group cursor-pointer"
                            >
                                {/* Left: icon + info */}
                                <div className="flex items-start gap-5 min-w-0 flex-1">
                                    <div
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${typeInfo.bg} ${typeInfo.color}`}
                                    >
                                        {typeInfo.icon}
                                    </div>
                                    <div className="min-w-0 flex-1 text-left">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                                Order ID: {req.order_id}
                                            </p>
                                        </div>
                                        <h4 className="font-bold text-[#1a1c2e] text-lg leading-tight truncate">
                                            {typeInfo.label}
                                        </h4>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {req.device_serial_number && (
                                                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                                                    SN: {req.device_serial_number}
                                                </span>
                                            )}
                                            {req.request_type === 'REFUND' && req.refund_amount && (
                                                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#800000] bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                                                    Refund: ₹{req.refund_amount}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-slate-400 text-xs font-medium mt-1">
                                            Submitted on {formatDate(req.created_at)}
                                        </p>
                                    </div>
                                </div>

                                {/* Right: status badge + chevron */}
                                <div className="flex items-center justify-between md:justify-end gap-8 shrink-0">
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusConfig.badge}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                                            {statusConfig.label}
                                        </span>
                                    </div>

                                    {/* Chevron */}
                                    <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-[#800000] group-hover:text-white transition-all flex items-center justify-center shrink-0">
                                        <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
