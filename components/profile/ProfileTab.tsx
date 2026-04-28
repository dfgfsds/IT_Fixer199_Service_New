'use client'

import { useState } from 'react'
import { Edit2 } from 'lucide-react'
import { toast } from 'sonner'
import axiosInstance from '@/configs/axios-middleware'
import Api from '@/api-endpoints/ApiUrls'
import { useAuth } from '@/context/auth-context'
import { extractErrorMessage } from '@/lib/error-utils'

export default function ProfileTab() {
  const { user, refreshUserData } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')

  // Initialize edit states when entering edit mode
  const startEditing = () => {
    setEditName(user?.name || '')
    setEditEmail(user?.email || '')
    setEditPhone(user?.mobile_number || '')
    setIsEditing(true)
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const payload = {
        name: editName,
        email: editEmail,
        mobile_number: editPhone
      }

      await axiosInstance.put(`${Api.updateUser}${user?.id}`, payload)
      toast.success('Profile updated successfully!')
      await refreshUserData()
      setIsEditing(false)
    } catch (error: any) {
      toast.error(extractErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-10">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-[#101242]">Personal Information</h3>
        {!isEditing && (
          <button
            onClick={startEditing}
            className="flex items-center gap-2 text-[#101242] font-bold text-sm tracking-widest uppercase hover:underline"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-x-10 gap-y-8">
        <div className="space-y-2 text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</p>
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="block w-full p-4 bg-slate-50 border border-[#101242]/10 rounded-2xl focus:bg-white focus:border-[#101242]/30 outline-none font-bold text-[#101242]"
              placeholder="Full Name"
            />
          ) : (
            <div className="p-4 bg-slate-50 text-[#101242] font-bold rounded-2xl border border-transparent">
              {user?.name}
            </div>
          )}
        </div>

        <div className="space-y-2 text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</p>
          {isEditing ? (
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="block w-full p-4 bg-slate-50 border border-[#101242]/10 rounded-2xl focus:bg-white focus:border-[#101242]/30 outline-none font-bold text-[#101242]"
              placeholder="Email Address"
            />
          ) : (
            <div className="p-4 bg-slate-50 text-[#101242] font-bold rounded-2xl border border-transparent">
              {user?.email}
            </div>
          )}
        </div>

        <div className="space-y-2 text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Phone Number</p>
          {isEditing ? (
            <div className="space-y-1">
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                disabled={user?.mobile_number?.toString().length >= 10}
                className="block w-full p-4 bg-slate-50 border border-[#101242]/10 rounded-2xl focus:bg-white focus:border-[#101242]/30 outline-none font-bold text-[#101242] disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Phone Number"
              />
              {user?.mobile_number?.toString().length >= 10 && (
                <p className="text-[9px] text-[#101242] font-bold uppercase tracking-tighter ml-1">Verified phone number cannot be changed</p>
              )}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 text-[#101242] font-bold rounded-2xl border border-transparent">
              {user?.mobile_number}
            </div>
          )}
        </div>

        {isEditing && (
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 py-4 bg-[#101242] text-white rounded-2xl font-bold shadow-lg shadow-[#101242]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm disabled:opacity-75"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all text-sm disabled:opacity-75"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
