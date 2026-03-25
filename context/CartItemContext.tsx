"use client";
import axiosInstance from "@/configs/axios-middleware";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Api from "../api-endpoints/ApiUrls";
import { useLocation } from "./location-context";


const CartItemContext = createContext<any | undefined>(undefined);


export function CartItemProvider({ children }: { children: ReactNode }) {
  // const [data, setData] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState(false)
  const { location, zoneData } = useLocation()
  const [data, setData] = useState<any[]>([]) // ✅ correct

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }


  // const fetchCart = async () => {
  //   const token = getToken()

  //   // ❌ token illa → empty cart
  //   if (!token) {
  //     setData("")
  //     return
  //   }

  //   setIsLoading(true)

  //   try {
  //     const res = await axiosInstance.get(`${Api?.cartApi}?include_inactive=true&lat=${location?.lat}&lng=${location?.lng}`)

  //     const items = res?.data?.data || []
  //     setData(items)

  //   } catch (err) {
  //     console.error("Cart fetch error", err)
  //     setData("") // fallback
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const fetchCart = async () => {
    const token = getToken()

    if (!token) {
      setData([])
      return
    }

    // 🔥 IMPORTANT
    if (!location?.lat || !location?.lng) return

    setIsLoading(true)

    try {
      const res = await axiosInstance.get(
        `${Api?.cartApi}?include_inactive=true&lat=${location.lat}&lng=${location.lng}`
      )

      const items = res?.data?.data || [] // ✅ correct path
      setData(items)

    } catch (err) {
      console.error("Cart fetch error", err)
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = getToken()

    if (token && location?.lat && location?.lng) {
      fetchCart()
    } else {
      setData([])
    }
  }, [location?.lat, location?.lng]) // 🔥 THIS IS THE KEY


  // useEffect(() => {
  //   const token = getToken()

  //   if (token) {
  //     fetchCart()
  //   } else {
  //     setData("") // 🔥 important
  //   }
  // }, [])
  return (
    <CartItemContext.Provider
      value={{
        // cartItem: data || [],
        // isAuthenticated: !!data,
        // isLoading,
        // fetchCart,
        cartItem: data, // already array
        totalItems: data.length,
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
