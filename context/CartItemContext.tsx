"use client";
import axiosInstance from "@/configs/axios-middleware";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Api from "../api-endpoints/ApiUrls";
import { useLocation } from "./location-context";
import { toast } from "sonner";
import { useAuth } from "./auth-context";


const CartItemContext = createContext<any | undefined>(undefined);


export function CartItemProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const { location } = useLocation()
  const { user } = useAuth()
  const [data, setData] = useState<any[]>([])
  const [rawCartData, setRawCartData] = useState<any>(null)

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  const fetchCart = async () => {
    const token = getToken()

    if (!token) {
      setData([])
      return
    }

    setIsLoading(true)

    try {
      // Build URL — include lat/lng if available (trailing slash required for DRF)
      let url = `${Api?.cartApi}/?include_inactive=true`
      if (location?.lat && location?.lng) {
        url += `&lat=${location.lat}&lng=${location.lng}`
      }

      const res = await axiosInstance.get(url)
      console.log("Cart API raw response:", res?.data)
      setRawCartData(res?.data)

      // Try multiple response structures
      const items =
        res?.data?.data?.items ||
        res?.data?.items ||
        res?.data?.cart_items ||
        (Array.isArray(res?.data?.data) ? res?.data?.data : null) ||
        (Array.isArray(res?.data) ? res.data : [])

      console.log("Cart items parsed:", items)
      setData(items)

    } catch (err: any) {
      console.warn("Cart fetch note:", err?.response?.data?.message || "Out of zone or server error");

      if (err?.response?.status !== 404 && err?.response?.status !== 401) {
        toast.error("Services are currently not available in this location.");
      }

      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch cart whenever location or user changes (covers login/logout)
  useEffect(() => {
    const token = getToken()
    if (token) {
      fetchCart()
    } else {
      setData([])
      setRawCartData(null)
    }
  }, [location?.lat, location?.lng, user?.id])



  return (
    <CartItemContext.Provider
      value={{
        cartItem: data,
        rawCartData,
        totalItems: data.reduce((sum, item) => sum + (item.quantity || 1), 0),
        isAuthenticated: !!getToken(),
        isLoading,
        fetchCart,
      }}
    >
      {children}
    </CartItemContext.Provider>
  );
}

// Hook
export function useCartItem() {
  const context = useContext(CartItemContext);
  if (!context) {
    throw new Error("useCartItem must be used within a CartItemProvider");
  }
  return context;
}
