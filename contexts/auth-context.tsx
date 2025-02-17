"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

type Store = {
  id: number
  name: string
  address: string
}

type User = {
  id: number
  name: string
  role: "Admin" | "Manager" | "Cashier"
  username: string
  store: Store
}

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    const mockUsers: User[] = [
      {
        id: 1,
        name: "Admin User",
        role: "Admin",
        username: "Admin",
        store: { id: 1, name: "Main Store", address: "123 Main St, City, State 12345" },
      },
      {
        id: 2,
        name: "Jane Smith",
        role: "Cashier",
        username: "jane",
        store: { id: 1, name: "Main Store", address: "123 Main St, City, State 12345" },
      },
      {
        id: 3,
        name: "Bob Johnson",
        role: "Manager",
        username: "bob",
        store: { id: 2, name: "Branch Store 1", address: "456 Oak St, City, State 12345" },
      },
    ]

    const foundUser = mockUsers.find((u) => u.username === username)
    if (foundUser && password === "12345") {
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

