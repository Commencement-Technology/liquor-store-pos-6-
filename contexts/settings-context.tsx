"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import supabase from "@/lib/supabaseClient"

type Settings = {
  taxRate: string
  storeName: string
  storeAddress: string
  receiptHeader: string
  receiptFooter: string
}

type SettingsContextType = {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    taxRate: "8.00",
    storeName: "Liquor Store POS",
    storeAddress: "123 Main St, City, State 12345",
    receiptHeader: "Thank you for your purchase!",
    receiptFooter: "Please come again!",
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const { data, error } = await supabase.from("settings").select("*")
    if (error) {
      console.error("Error loading settings:", error)
    } else {
      const newSettings: Partial<Settings> = {}
      data.forEach((setting) => {
        switch (setting.key) {
          case "tax_rate":
            newSettings.taxRate = setting.value
            break
          case "store_name":
            newSettings.storeName = setting.value
            break
          case "store_address":
            newSettings.storeAddress = setting.value
            break
          case "receipt_header":
            newSettings.receiptHeader = setting.value
            break
          case "receipt_footer":
            newSettings.receiptFooter = setting.value
            break
        }
      })
      setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }))
    }
  }

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updates = Object.entries(newSettings).map(([key, value]) => ({
      key: key.toLowerCase(),
      value: value,
    }))
    const { error } = await supabase.from("settings").upsert(updates)
    if (error) {
      console.error("Error updating settings:", error)
    } else {
      setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }))
    }
  }

  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

