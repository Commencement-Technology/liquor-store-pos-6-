"use client"

import type React from "react"

import { useState } from "react"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"

type PaymentFormProps = {
  amount: number
}

export default function PaymentForm({ amount }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)!,
    })

    if (error) {
      setError(error.message ?? "An unknown error occurred")
      setProcessing(false)
    } else {
      // Send paymentMethod.id to your server for processing
      console.log("PaymentMethod:", paymentMethod)
      // Implement server-side payment processing here
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <Button type="submit" disabled={!stripe || processing} className="mt-4 w-full">
        Pay ${(amount / 100).toFixed(2)}
      </Button>
    </form>
  )
}

