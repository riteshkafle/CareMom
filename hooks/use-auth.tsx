"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { User } from "@/types"
import { demoUser } from "@/lib/data/demo-data"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (data: SignupData) => Promise<boolean>
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

interface SignupData {
  name: string
  email: string
  password: string
  dueDate: string
  state: string
  riskFactors: string[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "nurture-nest-user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // ignore parse errors
    }
    setIsLoading(false)
  }, [])

  const persistUser = useCallback((userData: User | null) => {
    setUser(userData)
    if (userData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const login = useCallback(
    async (email: string, _password: string): Promise<boolean> => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const userData = JSON.parse(stored) as User
        if (userData.email === email) {
          setUser(userData)
          return true
        }
      }
      // For demo: create a default user on any login
      const defaultUser: User = {
        ...demoUser,
        email,
        createdAt: new Date().toISOString(),
      }
      persistUser(defaultUser)
      return true
    },
    [persistUser]
  )

  const signup = useCallback(
    async (data: SignupData): Promise<boolean> => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        dueDate: data.dueDate,
        state: data.state,
        riskFactors: data.riskFactors,
        createdAt: new Date().toISOString(),
      }
      persistUser(newUser)
      return true
    },
    [persistUser]
  )

  const logout = useCallback(() => {
    persistUser(null)
  }, [persistUser])

  const updateUser = useCallback(
    (data: Partial<User>) => {
      if (user) {
        const updated = { ...user, ...data }
        persistUser(updated)
      }
    },
    [user, persistUser]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
