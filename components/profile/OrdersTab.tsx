'use client'

// Skeleton card
function OrderSkeleton() {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      <div className="flex items-center gap-5">
        {/* Icon box */}
        <div className="w-14 h-14 rounded-2xl bg-slate-100 shrink-0" />
        <div className="space-y-2.5">
          {/* Order ID */}
          <div className="h-3 w-20 bg-slate-100 rounded-full" />
          {/* Service name */}
          <div className="h-5 w-48 bg-slate-100 rounded-full" />
          {/* Date */}
          <div className="h-3 w-32 bg-slate-100 rounded-full" />
        </div>
      </div>
      <div className="flex items-center justify-end gap-8">
        <div className="text-right space-y-2">
          {/* Price */}
          <div className="h-7 w-16 bg-slate-100 rounded-full ml-auto" />
          {/* Status */}
          <div className="h-3 w-20 bg-slate-100 rounded-full" />
        </div>
        {/* Arrow */}
        <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0" />
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, ChevronRight, Package, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/format-price'
import axiosInstance from '@/configs/axios-middleware'
import Api from '@/api-endpoints/ApiUrls'

export default function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get(Api.orders)
      setOrders(res?.data?.orders || [])
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const normalizeStatus = (status: string) => status?.toLowerCase()

  const statusLabel = (status: string) => {
    switch (normalizeStatus(status)) {
      case "pending": return "Pending"
      case "confirmed": return "Confirmed"
      case "assigned": return "Assigned"
      case "in_progress": return "In Progress"
      case "in_transit": return "In Transit"
      case "service_in_progress": return "Service In Progress"
      case "completed": return "Completed"
      case "cancelled": return "Cancelled"
      case "refunded": return "Refunded"
      default: return status || 'Unknown'
    }
  }

  const getStatusIconContext = (status: string) => {
    const s = normalizeStatus(status)
    if (s === 'completed') {
      return { icon: <CheckCircle className="w-6 h-6" />, bg: 'bg-emerald-50 text-emerald-500', text: 'text-emerald-500' }
    }
    if (s === 'cancelled' || s === 'refunded') {
      return { icon: <XCircle className="w-6 h-6" />, bg: 'bg-red-50 text-red-500', text: 'text-red-500' }
    }
    return { icon: <Clock className="w-6 h-6" />, bg: 'bg-blue-50 text-blue-500', text: 'text-blue-500' }
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-black text-[#1a1c2e]">Recent Orders</h3>

      {loading ? (
        <div className="space-y-5">
          <OrderSkeleton />
          <OrderSkeleton />
          <OrderSkeleton />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
            <Package className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="mb-2 text-lg font-bold text-[#1a1c2e]">No orders yet</h2>
          <p className="text-sm text-slate-500 font-medium">Book a service to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-5 text-left">
          {orders.map((order: any, i: number) => {
            const context = getStatusIconContext(order?.order_status)
            const dateStr = order?.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""
            const serviceName = order?.items?.[0]?.item_details?.name || "Service Booking"

            return (
              <div key={order.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-xl hover:border-[#800000]/20">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${context.bg}`}>
                    {context.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">{order.id}</p>
                    <h4 className="font-bold text-[#1a1c2e] text-lg leading-tight">{serviceName}</h4>
                    <p className="text-slate-500 text-sm font-medium mt-1">Booked on {dateStr} {order?.slot_time && `• ${order.slot_time}`}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-10">
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#800000]">₹{formatPrice(order?.total_price)}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${context.text}`}>
                      {statusLabel(order?.order_status)}
                    </p>
                  </div>
                  <Link href={`/orders/${order.id}`} className="group p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-[#800000] hover:text-white transition-all flex items-center justify-center shrink-0">
                    <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
