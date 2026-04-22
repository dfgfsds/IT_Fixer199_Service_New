'use client'

import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

interface OrderModificationModalProps {
  isOpen: boolean
  data: {
    title?: string
    body?: string
    orderId?: string
    [key: string]: any
  } | null
  onConfirm: () => void
  onReject: () => void
}

export function OrderModificationModal({ isOpen, data, onConfirm, onReject }: OrderModificationModalProps) {
  if (!isOpen || !data) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl border border-white/20 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header / Icon Section */}
        <div className="pt-10 pb-6 px-8 flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shadow-inner">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#101242] tracking-tight">
              {data.title || 'Order Update Requested'}
            </h2>
            <div className="h-1 w-12 bg-amber-200 mx-auto rounded-full" />
          </div>
        </div>

        {/* Content Section */}
        <div className="px-10 pb-10 text-center">
          <p className="text-slate-600 font-bold leading-relaxed">
            {data.body || 'Your service expert has updated some details in your order. Please review and confirm to proceed.'}
          </p>
          
          {data.orderId && (
            <div className="mt-6 inline-block px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Ref: {data.orderId}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4">
          <button
            onClick={onReject}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-white border-2 border-red-100 text-red-600 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:border-red-200 transition-all active:scale-95"
          >
            <XCircle className="w-4 h-4" /> Reject
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-[#101242] text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-[#800000] shadow-lg shadow-[#101242]/20 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" /> Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
