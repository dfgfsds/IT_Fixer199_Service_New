'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { OrderModificationModal } from '@/components/order-modification-modal'
import axiosInstance from '@/configs/axios-middleware'
import Api from '@/api-endpoints/ApiUrls'
import { toast } from 'sonner'
import { messaging, requestForToken } from '@/configs/firebase-config'
import { onMessage } from 'firebase/messaging'

interface NotificationContextType {
  showModification: (data: any) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalData, setModalData] = useState<any>(null)

  useEffect(() => {
    // Request Permission and get token
    requestForToken()

    // Listen for foreground notifications
    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('📬 NEW FOREGROUND NOTIFICATION RECEIVED:', payload)

        // Extract data for our modal
        const data = {
          title: payload.notification?.title || payload.data?.title,
          body: payload.notification?.body || payload.data?.body,
          orderId: payload.data?.order_id || payload.data?.orderId,
          modificationId: payload.data?.modification_id || payload.data?.id
        }

        showModification(data)
      })

      return () => unsubscribe()
    }
  }, [])

  const showModification = (data: any) => {
    console.log('NOTIFICATION RECEIVED FROM BACKEND:', data)
    setModalData(data)
    setIsOpen(true)
  }

  const [appData, setAppData] = useState<any>(null)

  useEffect(() => {
    const fetchAppSetting = async () => {
      try {
        const res = await axiosInstance.get(Api.appSettings)
        if (res.data?.success) setAppData(res.data.data)
      } catch (error) { }
    }
    fetchAppSetting()
  }, [])

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleConfirm = async () => {
    console.log('USER CLICKED CONFIRM for order:', modalData?.orderId)
    try {
      if (modalData?.modificationId) {
        const res = await axiosInstance.post(`${Api.modificationApproval}${modalData.modificationId}/customer-approval/`, {
          customer_confirmation: 'APPROVED'
        })

        const responseData = res.data?.data || res.data

        if (responseData?.payment_required) {
          const razorpayLoaded = await loadRazorpay()
          if (!razorpayLoaded) {
            toast.error("Payment gateway failed to load.")
            return
          }

          const options = {
            key: appData?.pg_api_key,
            amount: Math.round(responseData.amount * 100),
            currency: "INR",
            name: "ITFixer@199",
            description: "Order Modification Payment",
            order_id: responseData.razorpay_order_id,
            handler: function (response: any) {
              toast.success('Modification approved successfully')
              setIsOpen(false)
              window.location.reload()
            },
            modal: {
              ondismiss: function () {
                toast.error("Payment cancelled.")
              },
            },
            theme: { color: "#101242" },
          }

          const razorpay = new (window as any).Razorpay(options)
          razorpay.open()
        } else {
          toast.success('Modification approved successfully')
          setIsOpen(false)
          window.location.reload()
        }
      } else {
        toast.info('No modification ID found in notification')
        setIsOpen(false)
      }
    } catch (error) {
      console.error('ERROR CONFIRMING MODIFICATION:', error)
      toast.error('Failed to approve modification')
    }
  }

  const handleReject = async () => {
    console.log('USER CLICKED REJECT for order:', modalData?.orderId)
    try {
      if (modalData?.modificationId) {
        await axiosInstance.post(`${Api.modificationApproval}${modalData.modificationId}/customer-approval/`, {
          customer_confirmation: 'REJECTED'
        })
        toast.error('Modification rejected')
      } else {
        toast.info('No modification ID found in notification')
      }
      setIsOpen(false)
    } catch (error) {
      console.error('❌ ERROR REJECTING MODIFICATION:', error)
      toast.error('Failed to reject modification')
    }
  }

  return (
    <NotificationContext.Provider value={{ showModification }}>
      {children}
      <OrderModificationModal
        isOpen={isOpen}
        data={modalData}
        onConfirm={handleConfirm}
        onReject={handleReject}
      />
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
