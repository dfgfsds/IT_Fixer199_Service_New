'use client'

import { X, Package, Clock, Wifi } from 'lucide-react'

interface ItemTrackingModalProps {
  isOpen: boolean
  onClose: () => void
  item: any
  logs: any[]
}

const steps = [
  'COLLECTED',
  'IN_TRANSIT_TO_HUB',
  'RECEIVED_AT_HUB',
  'UNDER_INSPECTION',
  'WAITING_FOR_PARTS',
  'REPAIR_IN_PROGRESS',
  'REPAIR_COMPLETED',
  'READY_FOR_DELIVERY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED'
]

const stepDetails = [
  { key: 'COLLECTED', label: 'Collected', desc: 'Item collected for service' },
  { key: 'IN_TRANSIT_TO_HUB', label: 'In Transit to Hub', desc: 'Moving to service center' },
  { key: 'RECEIVED_AT_HUB', label: 'Received at Hub', desc: 'Arrival at service center' },
  { key: 'UNDER_INSPECTION', label: 'Under Inspection', desc: 'Technicians checking details' },
  { key: 'WAITING_FOR_PARTS', label: 'Waiting for Parts', desc: 'Waiting for required components' },
  { key: 'REPAIR_IN_PROGRESS', label: 'Repair in Progress', desc: 'Service team working on item' },
  { key: 'REPAIR_COMPLETED', label: 'Repair Completed', desc: 'Service successfully finished' },
  { key: 'READY_FOR_DELIVERY', label: 'Ready for Delivery', desc: 'Item prepared for dispatch' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Expert on the way with item' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Item successfully delivered' }
]

const getLocalStatusLabel = (status: string) => {
  const s = status?.toUpperCase()
  switch (s) {
    case "COLLECTED": return "Collected"
    case "IN_TRANSIT_TO_HUB": return "In Transit to Hub"
    case "RECEIVED_AT_HUB": return "Received at Hub"
    case "UNDER_INSPECTION": return "Under Inspection"
    case "WAITING_FOR_PARTS": return "Waiting for Parts"
    case "REPAIR_IN_PROGRESS": return "Repair in Progress"
    case "REPAIR_COMPLETED": return "Repair Completed"
    case "READY_FOR_DELIVERY": return "Ready for Delivery"
    case "OUT_FOR_DELIVERY": return "Out for Delivery"
    case "DELIVERED": return "Delivered"
    case "CANCELLED": return "Cancelled"
    case "RETURNED": return "Returned"
    default: return status || ""
  }
}

export function ItemTrackingModal({ isOpen, onClose, item, logs }: ItemTrackingModalProps) {
  if (!isOpen) return null

  const calculateProgress = () => {
    const lastStatus = logs[logs.length - 1]?.status?.toUpperCase() || item?.status?.toUpperCase()
    const index = steps.indexOf(lastStatus)
    if (index === -1) return 5

    if (index >= 9) return 100

    return ((index / 9) * 100) + 5
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[80vh] mb-10 md:mb-0 md:max-h-[90vh]">

        {/* Header */}
        <div className="p-8 pb-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#101242]/5 flex items-center justify-center text-[#101242]">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#101242]">Service Tracking</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px]">
                {item?.item_details?.name || 'Service Details'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all text-slate-400 hover:text-[#101242]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-10 scrollbar-hide">
          <div className="relative pl-10">
            {/* The Vertical Line */}
            <div className="absolute left-[14px] top-2 bottom-2 w-[4px] bg-slate-100 rounded-full overflow-hidden">
              <div
                className="w-full bg-[#101242] transition-all duration-1000 ease-out"
                style={{ height: `${calculateProgress()}%` }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-12">
              {stepDetails.map((step, idx) => {
                const currentStatus = logs[logs.length - 1]?.status?.toUpperCase() || item?.status?.toUpperCase()
                const currentIndex = steps.indexOf(currentStatus)
                const isActive = idx <= currentIndex
                const isCurrent = idx === currentIndex

                // Color override for cancelled
                const isCancelled = step.key === 'CANCELLED' && isActive
                const accentColor = isCancelled ? 'border-red-500' : 'border-[#101242]'
                const dotColor = isCancelled ? 'bg-red-500' : 'bg-[#101242]'

                return (
                  <div key={idx} className="relative group">
                    <div className={`absolute -left-10 top-0 w-[32px] h-[32px] rounded-full border-4 bg-white transition-all duration-500 z-10 flex items-center justify-center ${isActive ? accentColor + ' shadow-lg shadow-[#101242]/10' : 'border-slate-100'
                      }`}>
                      {isActive && <div className={`w-2 h-2 rounded-full ${dotColor}`} />}
                    </div>

                    <div className="flex flex-col">
                      <h4 className={`font-black text-sm tracking-tight ${isActive ? (isCancelled ? 'text-red-600' : 'text-[#101242]') : 'text-slate-300'}`}>
                        {step.label}
                      </h4>
                      <p className={`text-[11px] font-medium ${isActive ? (isCancelled ? 'text-red-400' : 'text-slate-500') : 'text-slate-300'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* History */}
          {/*
          {logs.length > 0 && (
            <div className="border-t border-slate-100 pt-8 space-y-4">
              <h3 className="text-xs font-black text-[#101242] uppercase tracking-[0.2em]">Tracking History</h3>
              <div className="bg-slate-50 rounded-[32px] border border-slate-100 overflow-hidden">
                <div className="divide-y divide-slate-100 flex flex-col">
                  {logs.slice().reverse().map((log: any) => (
                    <div key={log.id} className="p-5 flex gap-4 hover:bg-white transition-colors group">
                      <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-slate-400 group-hover:text-[#101242]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-bold text-[#101242] text-sm uppercase text-[10px] tracking-widest">{getLocalStatusLabel(log.status)}</p>
                          <span className="text-[10px] font-bold text-slate-400">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 italic">"{log.notes || 'Automated update'}"</p>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2">
                          {new Date(log.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          */}
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200">
          <button onClick={onClose} className="w-full py-4 bg-white border border-slate-200 text-[#101242] rounded-2xl font-black text-sm hover:bg-slate-100 transition-all">
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  )
}
