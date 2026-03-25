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

interface AuthContextType {
  isLoggedIn: boolean
  user: any
  showLoginModal: boolean
  setShowLoginModal: (show: boolean) => void
  login: (data: any) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // 🔥 LOGIN (MAIN LOGIC)
  const login = useCallback((data: any) => {
    console.log("LOGIN DATA:", data)

    const user = data?.data?.data?.user
    const token = data?.data?.data?.tokens?.access
    const refresh = data?.data?.data?.tokens?.refresh
    if (!token) {
      console.error("Token not found")
      return
    }

    setUser(user)
    setIsLoggedIn(true)
    setShowLoginModal(false)

    // ✅ STORE
    localStorage.setItem("token", token)
    localStorage.setItem("refresh", refresh)
    localStorage.setItem("user", JSON.stringify(user))

  }, [])

  // 🔥 RESTORE LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      setIsLoggedIn(true)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setIsLoggedIn(false)

    localStorage.removeItem("token")
    localStorage.removeItem("refresh")
    localStorage.removeItem("user")
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, showLoginModal, setShowLoginModal, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}