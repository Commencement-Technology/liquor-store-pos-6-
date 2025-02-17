"use client"

import { Bell, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <button className="p-1 rounded-full hover:bg-gray-100">
          <Bell className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-2">
          <User className="w-6 h-6" />
          <span>{user?.name || "Guest"}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}

