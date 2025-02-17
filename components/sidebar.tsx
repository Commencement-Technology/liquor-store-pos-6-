"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  ShoppingCart,
  Tag,
  Users,
  Settings,
  MoveIcon as Transfer,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["Admin", "Manager", "Cashier"] },
  { name: "Cashier", href: "/cashier", icon: CreditCard, roles: ["Admin", "Manager", "Cashier"] },
  { name: "Reports", href: "/reports", icon: FileText, roles: ["Admin", "Manager"] },
  { name: "Transactions", href: "/transactions", icon: ShoppingCart, roles: ["Admin", "Manager"] },
  { name: "Items", href: "/items", icon: Tag, roles: ["Admin", "Manager"] },
  { name: "Promotions", href: "/promotions", icon: Tag, roles: ["Admin", "Manager"] },
  { name: "Transfers", href: "/transfers", icon: Transfer, roles: ["Admin", "Manager"] },
  { name: "Customers", href: "/customers", icon: Users, roles: ["Admin", "Manager"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["Admin"] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const filteredNavItems = navItems.filter((item) => user && item.roles.includes(user.role))

  return (
    <div className="flex flex-col w-64 bg-white border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <span className="text-2xl font-semibold">Liquor Store POS</span>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2 space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                    isActive ? "text-white bg-blue-600 hover:bg-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

