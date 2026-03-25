"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { orders as mockOrders, type Order } from "@/data/mock"

interface OrderContextType {
  orders: Order[]
  addOrder: (order: Order) => void
  cancelOrder: (id: string) => void
  getOrder: (id: string) => Order | undefined
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders)

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev])
  }, [])

  const cancelOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "cancelled" as const } : o))
    )
  }, [])

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  )

  return (
    <OrderContext.Provider value={{ orders, addOrder, cancelOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error("useOrders must be used inside OrderProvider")
  return ctx
}
