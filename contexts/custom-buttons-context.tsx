"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import supabase from "@/lib/supabaseClient"

export type CustomButton = {
  id: number
  label: string
  price: number
}

type CustomButtonsContextType = {
  customButtons: CustomButton[]
  setCustomButtons: React.Dispatch<React.SetStateAction<CustomButton[]>>
  addCustomButton: (button: Omit<CustomButton, "id">) => Promise<void>
  updateCustomButton: (button: CustomButton) => Promise<void>
  deleteCustomButton: (id: number) => Promise<void>
}

const CustomButtonsContext = createContext<CustomButtonsContextType | undefined>(undefined)

export function CustomButtonsProvider({ children }: { children: React.ReactNode }) {
  const [customButtons, setCustomButtons] = useState<CustomButton[]>([])

  useEffect(() => {
    fetchCustomButtons()
  }, [])

  const fetchCustomButtons = async () => {
    const { data, error } = await supabase.from("custom_buttons").select("*")
    if (error) {
      console.error("Error fetching custom buttons:", error)
    } else {
      setCustomButtons(data)
    }
  }

  const addCustomButton = async (button: Omit<CustomButton, "id">) => {
    const { data, error } = await supabase.from("custom_buttons").insert(button).select()
    if (error) {
      console.error("Error adding custom button:", error)
    } else {
      setCustomButtons([...customButtons, data[0]])
    }
  }

  const updateCustomButton = async (button: CustomButton) => {
    const { error } = await supabase.from("custom_buttons").update(button).eq("id", button.id)
    if (error) {
      console.error("Error updating custom button:", error)
    } else {
      setCustomButtons(customButtons.map((b) => (b.id === button.id ? button : b)))
    }
  }

  const deleteCustomButton = async (id: number) => {
    const { error } = await supabase.from("custom_buttons").delete().eq("id", id)
    if (error) {
      console.error("Error deleting custom button:", error)
    } else {
      setCustomButtons(customButtons.filter((b) => b.id !== id))
    }
  }

  return (
    <CustomButtonsContext.Provider
      value={{ customButtons, setCustomButtons, addCustomButton, updateCustomButton, deleteCustomButton }}
    >
      {children}
    </CustomButtonsContext.Provider>
  )
}

export function useCustomButtons() {
  const context = useContext(CustomButtonsContext)
  if (context === undefined) {
    throw new Error("useCustomButtons must be used within a CustomButtonsProvider")
  }
  return context
}

