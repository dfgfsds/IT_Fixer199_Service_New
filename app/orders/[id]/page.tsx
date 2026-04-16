'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowLeft, MapPin, Clock, CheckCircle, XCircle, AlertCircle, FileText, User as UserIcon, Calendar, IndianRupee, Loader2, Phone, MoreVertical, X, Package, Wifi, Check, RotateCcw } from 'lucide-react'
import axiosInstance from '@/configs/axios-middleware'
import Api from '@/api-endpoints/ApiUrls'
import { toast } from 'sonner'
import Image from 'next/image'
import { formatPrice } from '@/lib/format-price'
import { useLocation } from '@/context/location-context'
import { safeErrorLog } from '@/lib/error-handler'

// SSR-safe dynamic import for LiveMap
const LiveMap = dynamic(
  () => import('@/components/live-map').then((mod) => mod.LiveMap).catch(() => {
    // If LiveMap doesn't exist yet, return a placeholder
    return () => (
      <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center">
        <p className="text-slate-400 font-bold text-sm">Map Loading...</p>
      </div>
    )
  }),
  { ssr: false }
)

const transformOrder = (order: any) => {
  const items = order.items || []
  let sTotal = 0
  let pTotal = 0

  items.forEach((item: any) => {
    const lineTotal = (item.quantity || 1) * Number(item.selling_price || item.price || 0)
    if (item.type === 'SERVICE') {
      sTotal += lineTotal
    } else {
      pTotal += lineTotal
    }
  })

  return {
    id: order.id,
    status: order.order_status?.toLowerCase(),
    slot: order.slot_time,
    isInstant: order.is_instant_slot,
    customer_name: order.customer_name,
    google_address: order.google_address,
    address: order.address,
    amount: Math.abs(Number(order.total_price || 0)),
    serviceTotal: sTotal,
    productTotal: pTotal,
    fullData: order,
    items: items,
    agent: order.agent_details
      ? {
        name: order.agent_details.user_details?.name,
        phone: order.agent_details.user_details?.mobile_number,
      }
      : null,
  }
}

const statusLabel = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending": return "Order Pending"
    case "confirmed": return "Confirmed"
    case "assigned": return "Expert Assigned"
    case "in_progress": return "In Progress"
    case "in_transit": return "Expert on the Way"
    case "service_in_progress": return "Service Ongoing"
    case "completed": return "Completed"
    case "cancelled": return "Cancelled"
    case "refunded": return "Refund Processed"
    case "returned": return "Returned"
    default: return status || 'Unknown'
  }
}

const getStatusCtx = (status: string) => {
  const s = status?.toLowerCase()
  if (s === 'completed') return { icon: <CheckCircle className="w-7 h-7" />, bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500', border: 'border-emerald-100' }
  if (s === 'cancelled' || s === 'refunded') return { icon: <XCircle className="w-7 h-7" />, bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-500', border: 'border-red-100' }
  if (s === 'pending') return { icon: <Clock className="w-7 h-7" />, bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-500', border: 'border-amber-100' }
  if (s === 'confirmed' || s === 'assigned') return { icon: <CheckCircle className="w-7 h-7" />, bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500', border: 'border-blue-100' }
  return { icon: <AlertCircle className="w-7 h-7" />, bg: 'bg-indigo-50', text: 'text-indigo-600', bar: 'bg-indigo-500', border: 'border-indigo-100' }
}

const cancellationReasons = [
  { value: "CUSTOMER_CHANGE_OF_MIND", label: "Customer Change of Mind" },
  { value: "WRONG_BOOKING", label: "Wrong Booking" },
  { value: "BOOKED_BY_MISTAKE", label: "Booked By Mistake" },
  { value: "FOUND_BETTER_PRICE", label: "Found Better Price" },
  { value: "SERVICE_NO_LONGER_REQUIRED", label: "Service No Longer Required" },
  { value: "SCHEDULE_CHANGE", label: "Schedule Change" },
  { value: "LOCATION_CHANGED", label: "Location Changed" },
  { value: "DUPLICATE_BOOKING", label: "Duplicate Booking" },
  { value: "AGENT_UNAVAILABLE", label: "Agent Unavailable" },
  { value: "AGENT_RUNNING_LATE", label: "Agent Running Late" },
  { value: "AGENT_PERSONAL_EMERGENCY", label: "Agent Personal Emergency" },
  { value: "AGENT_VEHICLE_ISSUE", label: "Agent Vehicle Issue" },
  { value: "AGENT_UNABLE_TO_CONTACT_CUSTOMER", label: "Unable to Contact Customer" },
  { value: "CUSTOMER_NOT_RESPONDING", label: "Customer Not Responding" },
  { value: "CUSTOMER_NOT_AVAILABLE_AT_LOCATION", label: "Customer Not Available at Location" },
  { value: "SERVICE_DELAY", label: "Service Delay" },
  { value: "OUT_OF_STOCK", label: "Out of Stock" },
  { value: "PRICE_DISPUTE", label: "Price Dispute" },
  { value: "SERVICE_NOT_AVAILABLE", label: "Service Not Available" },
  { value: "ADDRESS_NOT_SERVICEABLE", label: "Address Not Serviceable" },
  { value: "TECHNICAL_ISSUE", label: "Technical Issue" },
  { value: "OTHER", label: "Other" },
]

const slotChangeReasons = [
  { value: "AGENT_UNAVAILABLE", label: "Agent Unavailable" },
  { value: "RUNNING_LATE", label: "Running Late" },
  { value: "EMERGENCY", label: "Emergency" },
  { value: "VEHICLE_ISSUE", label: "Vehicle Issue" },
  { value: "PERSONAL_REASON", label: "Personal Reason" },
  { value: "NOT_AVAILABLE_AT_TIME", label: "Not Available at Selected Time" },
  { value: "DELAY", label: "Delay" },
  { value: "OVERBOOKED", label: "Overbooked" },
  { value: "ROUTE_CONFLICT", label: "Route Conflict" },
  { value: "SERVICE_DELAY", label: "Service Delay" },
  { value: "PARTS_DELAY", label: "Parts Delay" },
  { value: "RESOURCE_UNAVAILABLE", label: "Resource Unavailable" },
  { value: "TRAFFIC_DELAY", label: "Traffic Delay" },
  { value: "WEATHER_ISSUE", label: "Weather Issue" },
  { value: "LOCATION_ACCESS_ISSUE", label: "Location Access Issue" },
  { value: "OTHER", label: "Other" },
]

export default function SingleOrderPage() {
  const { id } = useParams()
  const router = useRouter()
  const { zoneData, setLocation } = useLocation()

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [actionType, setActionType] = useState<'cancel' | 'slot' | 'refund' | null>(null)

  // Slot selection state
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [selectedSlot, setSelectedSlot] = useState<any>(null)

  const [formData, setFormData] = useState({ reason: '', description: '', date: '', slotId: '' })
  const [submitting, setSubmitting] = useState(false)

  const DATES = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      value: d.toISOString().split("T")[0],
      label: i === 0 ? "TODAY" : d.toLocaleDateString("en-IN", { weekday: "short" }),
      day: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    }
  })

  // Live Tracking
  const [showTracking, setShowTracking] = useState(false)
  const [agentLocation, setAgentLocation] = useState<any>(null)
  const [liveStatus, setLiveStatus] = useState('')
  const [debugData, setDebugData] = useState<any>({ api: null, ws: null })
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => { if (id) fetchOrder() }, [id])

  // Close menu on outside click
  useEffect(() => {
    const close = () => setShowMenu(false)
    if (showMenu) window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [showMenu])

  // WebSocket for live tracking
  useEffect(() => {
    if (!showTracking) {
      wsRef.current?.close()
      return
    }
    const token = localStorage.getItem('token')
    if (!token) return

    const ws = new WebSocket(`wss://api.itfixer199.com/ws/order-tracking/${id}/?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => console.log('WS Connected')
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("WEBSOCKET DATA RECEIVED:", data)
      setLiveStatus(data.status)

      // Extremely broad catcher for any possible shape of agent location
      if (data.partner_location) setAgentLocation(data.partner_location)
      if (data.order_details?.partner_location) setAgentLocation(data.order_details.partner_location)
      if (data.agent_location) setAgentLocation(data.agent_location)
      if (data.lat && data.lng) setAgentLocation({ lat: data.lat, lng: data.lng })
      if (data.latitude && data.longitude) setAgentLocation({ lat: data.latitude, lng: data.longitude })
    }
    ws.onerror = () => console.warn('WS Connection Error: Live tracking currently unavailable')
    ws.onclose = () => console.log('WS Closed')

    return () => ws.close()
  }, [showTracking, id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get(`${Api.orders}${id}/`)
      const fetchedOrder = res.data.order

      setOrder(transformOrder(fetchedOrder))

      // Attempt to parse coordinates if stored as a string "lat,lng" or standard object
      if (fetchedOrder?.starting_agent_coordinates) {
        if (typeof fetchedOrder.starting_agent_coordinates === 'string') {
          const [lat, lng] = fetchedOrder.starting_agent_coordinates.split(',').map(Number)
          if (lat && lng) setAgentLocation({ lat, lng })
        } else if (fetchedOrder.starting_agent_coordinates.lat) {
          setAgentLocation(fetchedOrder.starting_agent_coordinates)
        } else if (fetchedOrder.starting_agent_coordinates.latitude) {
          setAgentLocation({ lat: fetchedOrder.starting_agent_coordinates.latitude, lng: fetchedOrder.starting_agent_coordinates.longitude })
        }
      }

      if (!agentLocation) {
        if (fetchedOrder?.partner_location) setAgentLocation(fetchedOrder.partner_location)
        else if (fetchedOrder?.agent_details?.latitude) setAgentLocation({ lat: fetchedOrder.agent_details.latitude, lng: fetchedOrder.agent_details.longitude })
        else if (fetchedOrder?.agent?.latitude) setAgentLocation({ lat: fetchedOrder.agent.latitude, lng: fetchedOrder.agent.longitude })
      }

      // SYNC LOCATION CONTEXT to fetch slots for THIS order's location
      if (fetchedOrder?.latitude && fetchedOrder?.longitude) {
        setLocation({
          lat: Number(fetchedOrder.latitude),
          lng: Number(fetchedOrder.longitude),
          city: fetchedOrder.user_details?.city || "Unknown",
          address: fetchedOrder.address || fetchedOrder.user_address?.full_address || "",
        })
      }

    } catch (err: any) {
      safeErrorLog('Failed to load order details', err)
      toast.error('Failed to load order details.')
      router.push('/profile?tab=orders')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async () => {
    setSubmitting(true)
    try {
      if (actionType === 'cancel') {
        await axiosInstance.post(Api.requestCancellation, {
          order_id: order.id,
          cancellation_reason_type: formData.reason,
          cancellation_reason_description: formData.description,
        })
        toast.success('Cancellation request submitted.')
      }
      if (actionType === 'slot') {
        const item = order.items?.[0]
        if (!selectedSlot || !item) {
          toast.error("Please select a new time slot")
          setSubmitting(false)
          return
        }

        await axiosInstance.post(Api.slotChange, {
          order_id: order.id,
          order_item_id: item.id,
          // current_slot_id: order.fullData?.slot_id || item.slot_id || "",
          requested_slot_id: selectedSlot.id,
          requested_date: selectedDate,
          requested_start_time: selectedSlot.start_time,
          requested_end_time: selectedSlot.end_time,
          slot_change_reason_type: formData.reason,
          slot_change_reason_description: formData.description,
        })
        toast.success('Slot change request submitted.')
      }
      if (actionType === 'refund') {
        await axiosInstance.post(Api.requestRefund, { order_id: order.id })
        toast.success('Refund request submitted.')
      }

      // RESET STATE AFTER SUCCESS
      setActionType(null)
      setSelectedSlot(null)
      setFormData({ reason: '', description: '', date: '', slotId: '' })
      fetchOrder()
    } catch (err: any) {
      safeErrorLog('Action failed', err)
      const data = err?.response?.data
      const errMsg =
        (typeof data === 'string' ? data : null) ||
        data?.message ||
        data?.detail ||
        data?.error ||
        (Array.isArray(data?.non_field_errors) ? data.non_field_errors[0] : null) ||
        err?.message ||
        'Action failed. Please try again.'
      toast.error(errMsg)
    } finally {
      setSubmitting(false)
    }
  }

  // Cleanup effect when modal closes
  useEffect(() => {
    if (!actionType) {
      setSelectedSlot(null)
      setFormData({ reason: '', description: '', date: '', slotId: '' })
    }
  }, [actionType])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-1 py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full animate-pulse">
          {/* Back Button Skeleton */}
          <div className="w-32 h-4 bg-slate-200 rounded-full mb-8" />

          {/* Banner Skeleton */}
          <div className="w-full h-48 bg-white border border-slate-100 rounded-[40px] mb-10 p-10 flex flex-col justify-center gap-4">
            <div className="w-1/4 h-3 bg-slate-100 rounded-full" />
            <div className="w-1/2 h-10 bg-slate-200 rounded-2xl" />
            <div className="w-1/3 h-4 bg-slate-100 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column Skeletons */}
            <div className="lg:col-span-2 space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-[40px] p-8 border border-slate-100 h-40 flex flex-col justify-center gap-4">
                  <div className="w-1/3 h-4 bg-slate-200 rounded-full mb-2" />
                  <div className="flex items-center gap-4 bg-slate-50 rounded-3xl p-5 h-20">
                    <div className="w-12 h-12 bg-white rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <div className="w-1/4 h-2 bg-slate-200 rounded-full" />
                      <div className="w-1/2 h-4 bg-slate-200 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column Skeletons */}
            <div className="space-y-8">
              <div className="bg-[#101242] rounded-[40px] p-8 h-48 opacity-20" />
              <div className="bg-white rounded-[40px] p-8 border border-slate-100 h-60" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) return null

  const orderStatus = order.fullData?.order_status
  const paymentStatus = order.fullData?.payment_status
  const ctx = getStatusCtx(order.status)

  const showCancel = !['CANCELLED', 'COMPLETED', 'REFUNDED'].includes(orderStatus)
  const showSlotChange = !['IN_PROGRESS', 'IN_TRANSIT', 'CANCELLED', 'COMPLETED', 'SERVICE_IN_PROGRESS', 'REFUNDED'].includes(orderStatus)
  const showRefund = paymentStatus === 'SUCCESS'
  const showTrackBtn = ['IN_PROGRESS', 'IN_TRANSIT', 'SERVICE_IN_PROGRESS'].includes(orderStatus)

  const createdDate = order.fullData?.created_at
    ? new Date(order.fullData.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">

        {/* Back */}
        <Link href="/profile?tab=orders" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#101242] font-bold text-sm tracking-widest uppercase transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Orders
        </Link>

        {/* Status Banner */}
        <div className={`w-full rounded-[40px] p-8 md:p-10 border ${ctx.border} ${ctx.bg} relative mb-10 shadow-xl shadow-slate-200/40`}>
          <div className="absolute inset-0 rounded-[40px] overflow-hidden pointer-events-none">
            <div className={`absolute top-0 left-0 w-2 h-full ${ctx.bar}`} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-black tracking-widest uppercase opacity-60">Order ID: {order.id}</span>
              <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${ctx.text}`}>{statusLabel(order.status)}</h1>
              {createdDate && <p className="font-bold opacity-70 mt-1 text-sm">Placed on {createdDate}</p>}
            </div>
            <div className="flex items-center gap-4">
              <div className={`p-5 ${ctx.bg} border ${ctx.border} rounded-full shadow-sm ${ctx.text}`}>
                {ctx.icon}
              </div>

              {/* 3 dots - Menu */}
              {(showCancel || showSlotChange || showRefund) && (
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
                    className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:bg-slate-50 transition-all"
                  >
                    <MoreVertical className="w-5 h-5 text-slate-500" />
                  </button>
                  {showMenu && (
                    <div className="absolute left-0 md:left-auto md:right-0 top-14 w-52 bg-white border border-slate-100 rounded-3xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      {showCancel && (
                        <button onClick={() => { setActionType('cancel'); setShowMenu(false) }} className="w-full text-left px-5 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition flex items-center gap-3">
                          <XCircle className="w-4 h-4" /> Cancel Order
                        </button>
                      )}
                      {showSlotChange && (
                        <button onClick={() => { setActionType('slot'); setShowMenu(false) }} className="w-full text-left px-5 py-4 text-sm font-bold text-[#101242] hover:bg-slate-50 transition flex items-center gap-3">
                          <Calendar className="w-4 h-4" /> Change Slot
                        </button>
                      )}
                      {/* 
                      {showRefund && (
                        <button onClick={() => { setActionType('refund'); setShowMenu(false) }} className="w-full text-left px-5 py-4 text-sm font-bold text-[#101242] hover:bg-slate-50 transition flex items-center gap-3">
                          <IndianRupee className="w-4 h-4" /> Request Refund
                        </button>
                      )} 
                      */}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">

            {/* Service Schedule */}
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 space-y-5">
              <h2 className="text-lg font-black text-[#101242] flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#101242]" /> Service Schedule
              </h2>
              <div className="flex items-center gap-4 bg-slate-50 rounded-3xl p-5 border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#101242] shadow-sm flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    {/* {order.isInstant ? 'Service Type' : 'Scheduled For'} */}
                    Scheduled For
                  </p>
                  <p className="font-bold text-[#101242] text-lg">
                    {order.isInstant ? (order.slot || 'Instant Service') : (order.slot || 'Slot to be confirmed')}
                  </p>
                </div>
              </div>
            </div>

            {/* Assigned Expert */}
            {order.agent && (
              <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 space-y-5">
                <h2 className="text-lg font-black text-[#101242] flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-[#101242]" /> Service Professional
                </h2>
                <div className="flex items-center justify-between bg-slate-50 rounded-3xl p-5 border border-slate-100 gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#101242]/10 text-[#101242] flex items-center justify-center shrink-0">
                      <UserIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Expert</p>
                      <p className="font-bold text-[#101242] text-lg">{order.agent.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <a
                      href={`tel:${order.agent.phone}`}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#101242] border border-slate-200 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    >
                      <Phone className="w-4 h-4" /> Call
                    </a>
                    {showTrackBtn && (
                      <button
                        onClick={() => setShowTracking(true)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#101242] text-white font-bold text-sm hover:bg-[#600000] transition-all shadow-lg shadow-[#101242]/20"
                      >
                        <Wifi className="w-4 h-4" /> Track Live
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 space-y-5">
              <h2 className="text-lg font-black text-[#101242] flex items-center gap-3">
                <Package className="w-5 h-5 text-[#101242]" /> Booked Services
              </h2>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-5 p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white border border-slate-100 shrink-0">
                      <Image
                        src={item?.item_details?.full_details?.media_files?.[0]?.image_url || '/placeholder-image.jpg'}
                        alt={item.item_details?.name || 'Service'}
                        fill
                        className="object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.jpg' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#101242] text-[16px] capitalize truncate">
                        {item.item_details?.name || item.item_details?.full_details?.name}
                      </p>
                      <div className="mt-0.5 space-y-0.5">
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                          {item?.type?.toLowerCase() || ""}
                        </p>
                        <p className="font-black text-[#101242]/80 text-[15px]">₹{formatPrice(item.price)}</p>
                      </div>
                    </div>

                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-full border uppercase tracking-widest shrink-0 shadow-sm whitespace-nowrap ${item.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      item.status === 'CANCELLED' || item.status === 'RETURNED' ? 'bg-red-50 text-red-600 border-red-100' :
                        item.status === 'SERVICE_IN_PROGRESS' || item.status === 'IN_PROGRESS' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                          item.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            item.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              'bg-slate-50 text-slate-500 border-slate-100'
                      }`}>
                      {item.status || ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">

            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 px-1">
                <h2 className="text-lg font-black flex items-center gap-3 text-[#101242]">
                  <IndianRupee className="w-5 h-5 text-[#101242]" /> Payment
                </h2>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm ${paymentStatus === 'SUCCESS' || paymentStatus === 'CREDIT' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                    paymentStatus === 'REFUNDED' || paymentStatus === 'PARTIALLY_REFUNDED' ? 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                  {paymentStatus === 'SUCCESS' || paymentStatus === 'CREDIT' ? <CheckCircle className="w-3.5 h-3.5" /> :
                    paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED' ? <XCircle className="w-3.5 h-3.5" /> :
                      paymentStatus === 'REFUNDED' || paymentStatus === 'PARTIALLY_REFUNDED' ? <RotateCcw className="w-3.5 h-3.5" /> :
                        <Clock className="w-3.5 h-3.5" />}
                  {paymentStatus || 'PENDING'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 space-y-3">
                {order.serviceTotal > 0 && (
                  <div className="flex justify-between text-slate-500 font-medium text-sm px-1">
                    <span>Service Total</span>
                    <span className="font-bold text-[#101242]">₹{formatPrice(order.serviceTotal)}</span>
                  </div>
                )}
                {order.productTotal > 0 && (
                  <div className="flex justify-between text-slate-500 font-medium text-sm px-1">
                    <span>Product Total</span>
                    <span className="font-bold text-[#101242]">₹{formatPrice(order.productTotal)}</span>
                  </div>
                )}

                <div className="w-full h-px bg-slate-200" />

                <div className="flex justify-between items-center px-1">
                  <span className="font-bold text-slate-500 text-md">Total Amount</span>
                  <span className="font-black text-[#101242] text-lg tracking-tight">₹{formatPrice(order.amount)}</span>
                </div>
              </div>
            </div>

            {/* Service Location */}
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 space-y-4">
              <h2 className="text-lg font-black text-[#101242] flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#101242]" /> Service Location
              </h2>
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
                <p className="font-bold text-[#101242] mb-1">{order.customer_name || 'Customer'}</p>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                  {order.address || order.google_address || 'Address not available'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {/* ACTION MODAL */}
      {actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#101242] capitalize">
                {actionType === 'cancel' && '❌ Cancel Order'}
                {actionType === 'slot' && '📅 Change Slot'}
                {actionType === 'refund' && '💰 Request Refund'}
              </h2>
              <button onClick={() => setActionType(null)} className="p-2 rounded-full hover:bg-slate-50 transition">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide space-y-6">
              {actionType === 'cancel' && (
                <div className="space-y-4">
                  <select
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#101242] outline-none focus:border-[#101242]/30"
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  >
                    <option value="">Select Cancellation Reason</option>
                    {cancellationReasons.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                  <textarea
                    placeholder="Additional description (optional)"
                    rows={3}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#101242] outline-none focus:border-[#101242]/30 resize-none placeholder:font-medium"
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              )}

              {actionType === 'slot' && (
                <div className="space-y-6">
                  {/* Fixed Date Indicator */}
                  <div className="flex items-center gap-3 p-4 bg-[#101242]/5 border border-[#101242]/10 rounded-2xl">
                    <Calendar className="w-5 h-5 text-[#101242]" />
                    <div>
                      <p className="text-[10px] font-black text-[#101242] uppercase tracking-widest">Scheduling For</p>
                      <p className="font-bold text-[#101242]">Today, {new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'long' })}</p>
                    </div>
                  </div>

                  {/* Current Slot Reference */}
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Appointment</p>
                        <p className="font-bold text-[#101242] text-sm">{order.slot || 'Not assigned'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-[#101242] uppercase bg-red-50 px-2 py-1 rounded-full">Selected</span>
                  </div>

                  {/* Slot Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Select New Time</p>
                      {selectedSlot && (
                        <button onClick={() => setSelectedSlot(null)} className="text-[10px] font-black text-[#101242] uppercase underline">Clear</button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {zoneData?.slots && zoneData.slots.length > 0 ? (
                        zoneData.slots.map((slot: any) => (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot)}
                            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedSlot?.id === slot.id
                              ? 'border-[#101242] bg-red-50/30'
                              : 'border-slate-100 bg-slate-50 hover:bg-white'
                              }`}
                          >
                            <div className="text-left">
                              <p className={`font-bold text-sm ${selectedSlot?.id === slot.id ? 'text-[#101242]' : 'text-[#101242]'}`}>
                                {slot.name}
                              </p>
                              <p className={`text-[11px] font-medium ${selectedSlot?.id === slot.id ? 'text-[#101242]/70' : 'text-slate-400'}`}>
                                {slot.start_time} - {slot.end_time}
                              </p>
                            </div>
                            {selectedSlot?.id === slot.id && <CheckCircle className="w-5 h-5 text-[#101242]" />}
                          </button>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
                          No slots available for today
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reason Selection */}
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Reason for Change</p>
                    <select
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#101242] outline-none focus:border-[#101242]/30"
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    >
                      <option value="">Select Reason</option>
                      {slotChangeReasons.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    <textarea
                      placeholder="Additional description (optional)"
                      rows={2}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[#101242] outline-none focus:border-[#101242]/30 resize-none placeholder:font-medium"
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {actionType === 'refund' && (
                <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 space-y-2">
                  <p className="font-bold text-amber-700">Confirm Refund Request</p>
                  <p className="text-sm text-amber-600 font-medium">Are you sure you want to request a refund of <span className="font-black">₹{formatPrice(order.amount)}</span> for this order?</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActionType(null)}
                disabled={submitting}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={submitting || (actionType === 'cancel' && !formData.reason) || (actionType === 'slot' && (!formData.reason || !selectedSlot))}
                className="flex-1 py-4 bg-[#101242] text-white rounded-2xl font-bold hover:bg-[#600000] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#101242]/20"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE TRACKING MODAL */}
      {showTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[40px] p-8 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#101242]/10 text-[#101242] flex items-center justify-center">
                  <Wifi className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#101242]">Live Tracking</h2>
                  {liveStatus && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{liveStatus}</p>}
                </div>
              </div>
              <button onClick={() => setShowTracking(false)} className="p-2 rounded-full hover:bg-slate-50 transition">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="h-[320px] w-full rounded-3xl overflow-hidden bg-slate-100">
              <LiveMap
                agentLat={agentLocation?.lat || agentLocation?.latitude}
                agentLng={agentLocation?.lng || agentLocation?.longitude}
                customerLat={order.fullData?.latitude}
                customerLng={order.fullData?.longitude}
              />
            </div>
            <button
              onClick={() => setShowTracking(false)}
              className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Close Tracking
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
