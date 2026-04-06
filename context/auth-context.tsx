// "use client"

// import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// interface AuthContextType {
//   isLoggedIn: boolean
//   user: { name: string; phone: string } | null
//   showLoginModal: boolean
//   setShowLoginModal: (show: boolean) => void
//   login: (phone: string) => void
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [user, setUser] = useState<{ name: string; phone: string } | null>(null)
//   const [showLoginModal, setShowLoginModal] = useState(false)

//   const login = useCallback((phone: string) => {
//     setUser({ name: "User", phone })
//     setIsLoggedIn(true)
//     setShowLoginModal(false)
//   }, [])

//   const logout = useCallback(() => {
//     setUser(null)
//     setIsLoggedIn(false)
//   }, [])

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, user, showLoginModal, setShowLoginModal, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext)
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
//   return ctx
// }


"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useRouter } from 'next/navigation'
import Api from '@/api-endpoints/ApiUrls'
import axiosInstance from '@/configs/axios-middleware'

interface AuthContextType {
  isLoggedIn: boolean
  user: any
  showLoginModal: boolean
  setShowLoginModal: (show: boolean) => void
  login: (data: any) => void
  logout: () => void
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // LOGIN (MAIN LOGIC)
  const login = useCallback((response: any) => {
    console.log("LOGIN RESPONSE RECEIVED:", response)

    const body = response?.data;

    const data = body?.data || body;

    const user = data?.user || (body?.user ? body.user : null);
    const token = data?.tokens?.access || data?.access_token || data?.token;
    const refresh = data?.tokens?.refresh || data?.refresh_token;

    if (!token) {
      console.error("Token not found in response structure. Body:", body)
      return
    }

    setUser(user)
    setIsLoggedIn(true)
    setShowLoginModal(false)

    // STORE
    localStorage.setItem("token", token)
    localStorage.setItem("refresh", refresh)
    localStorage.setItem("user", JSON.stringify(user))

  }, [])

  // RESTORE LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      setIsLoggedIn(true)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      if (user?.id) {
        await axiosInstance.post(`${Api.logout}${user.id}`)
      }
    } catch (e) {
      console.warn("Logout error:", e)
    } finally {
      setUser(null)
      setIsLoggedIn(false)

      localStorage.removeItem("token")
      localStorage.removeItem("refresh")
      localStorage.removeItem("user")

      router.push('/login')
    }
  }, [user, router])

  const refreshUserData = useCallback(async () => {
    if (!user?.id) return
    try {
      const response = await axiosInstance.get(`${Api.getUser}${user.id}`)
      const body = response.data;
      
      // Robustly find the user object within the response
      const updatedUser = body?.data?.user || body?.data || body?.user || body;
      
      console.log("USER REFRESH DATA RECEIVED:", updatedUser)

      if (updatedUser && (updatedUser.name || updatedUser.email)) {
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }
    } catch (e) {
      console.warn("Refresh user error:", e)
    }
  }, [user?.id])

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, showLoginModal, setShowLoginModal, login, logout, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}