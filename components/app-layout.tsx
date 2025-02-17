"use client"

import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useEffect } from "react"
import { useCustomButtons } from "@/contexts/custom-buttons-context"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { customButtons } = useCustomButtons()

  useEffect(() => {
    // Apply global settings here
    console.log("Custom buttons loaded:", customButtons)
    // You can add more global settings application logic here
  }, [customButtons])

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">{children}</main>
      </div>
    </div>
  )
}

