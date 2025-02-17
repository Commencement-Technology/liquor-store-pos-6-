"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, CreditCard } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useSettings } from "@/contexts/settings-context"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import PaymentForm from "@/components/PaymentForm"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, total, resetCart } = useCart()
  const { settings } = useSettings()
  const [cashAmount, setCashAmount] = useState("")
  const [cardAmount, setCardAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "split">("cash")

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cashier")
    }
  }, [cart, router])

  const handleQuickCash = (amount: number) => {
    setCashAmount(amount.toFixed(2))
    setPaymentMethod("cash")
  }

  const handlePayment = async () => {
    if (paymentMethod === "cash") {
      // Process cash payment
      console.log("Processing cash payment:", cashAmount)
      resetCart()
      router.push("/cashier")
    } else if (paymentMethod === "card") {
      // Stripe payment will be handled by the PaymentForm component
      setCardAmount(total.toFixed(2))
    } else if (paymentMethod === "split") {
      // Process split payment
      console.log("Processing split payment - Cash:", cashAmount, "Card:", cardAmount)
      // Implement split payment logic here
    }
  }

  const quickCashOptions = [total, Math.ceil(total / 5) * 5, Math.ceil(total / 10) * 10, Math.ceil(total / 20) * 20]

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-semibold">Checkout</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
            <p>Order Total: ${total.toFixed(2)}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {quickCashOptions.map((amount) => (
                <Button key={amount} onClick={() => handleQuickCash(amount)}>
                  ${amount.toFixed(2)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="cash-amount">Cash Amount</label>
                <Input
                  id="cash-amount"
                  type="number"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  placeholder="Enter cash amount"
                />
              </div>
              <div>
                <label htmlFor="card-amount">Card Amount</label>
                <Input
                  id="card-amount"
                  type="number"
                  value={cardAmount}
                  onChange={(e) => setCardAmount(e.target.value)}
                  placeholder="Enter card amount"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  className={paymentMethod === "cash" ? "bg-green-600" : ""}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <DollarSign className="mr-2" /> Cash
                </Button>
                <Button
                  className={paymentMethod === "card" ? "bg-blue-600" : ""}
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard className="mr-2" /> Card
                </Button>
                <Button
                  className={paymentMethod === "split" ? "bg-purple-600" : ""}
                  onClick={() => setPaymentMethod("split")}
                >
                  Split
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Process Payment</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentMethod === "card" || paymentMethod === "split" ? (
              <Elements stripe={stripePromise}>
                <PaymentForm amount={Number.parseFloat(cardAmount) * 100} />
              </Elements>
            ) : (
              <Button onClick={handlePayment} className="w-full">
                Complete Cash Payment
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

