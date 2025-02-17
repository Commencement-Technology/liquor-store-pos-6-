import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { AppLayout } from "@/components/app-layout"
import { CustomButtonsProvider } from "@/contexts/custom-buttons-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { CartProvider } from "@/contexts/cart-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Liquor Store POS",
  description: "Comprehensive Point of Sale system for liquor stores",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <AuthProvider>
            <SettingsProvider>
              <CustomButtonsProvider>
                <AppLayout>{children}</AppLayout>
              </CustomButtonsProvider>
            </SettingsProvider>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  )
}



import './globals.css'