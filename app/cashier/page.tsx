"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import supabase from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, MinusCircle } from "lucide-react"
import { useCustomButtons } from "@/contexts/custom-buttons-context"
import { useSettings } from "@/contexts/settings-context"
import { useToast } from "@/components/ui/use-toast"
import { useHotkeys } from "react-hotkeys-hook"
import { useCart } from "@/contexts/cart-context"

type Item = {
  id: string
  barcode: string
  name: string
  price: number
  qty_on_hand_items: number
  qty_on_hand_cases: number
  units_per_case: number
}

type CartItem = Item & { quantity: number; isCase: boolean }

type SuspendedOrder = {
  id: string
  cart: CartItem[]
  customerPhone: string
  discount: number
}

export default function CashierPage() {
  //const [cart, setCart] = useState<CartItem[]>([]) //Replaced
  //const [searchTerm, setSearchTerm] = useState("") //Replaced
  //const [searchResults, setSearchResults] = useState<Item[]>([]) //Replaced
  const [products, setProducts] = useState<Item[]>([])
  //const [paymentMethod, setPaymentMethod] = useState("cash") //Removed
  const [customerPhone, setCustomerPhone] = useState("")
  const [discount, setDiscount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [suspendedOrders, setSuspendedOrders] = useState<SuspendedOrder[]>([])

  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { settings } = useSettings()
  const { customButtons } = useCustomButtons()
  const {
    cart,
    addToCart: addToCartFromContext,
    removeFromCart,
    updateQuantity: updateQuantityFromContext,
    total,
  } = useCart()

  // Fetch products from Supabase
  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase.from("products").select("*")
    if (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      })
    } else {
      setProducts(data)
    }
  }, [toast])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts]) //Updated useEffect

  // Handle product search
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Item[]>([])
  useEffect(() => {
    const results = products.filter(
      (item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.barcode.includes(searchTerm),
    )
    setSearchResults(results)
  }, [searchTerm, products])

  // Add product to cart (Handles both bottles & cases)
  const handleAddToCart = useCallback(
    (item: Item, isCase = false) => {
      addToCartFromContext({ ...item, isCase })
      setSearchTerm("")
      searchInputRef.current?.focus()
    },
    [addToCartFromContext],
  )

  // Update item quantity in cart
  const handleUpdateQuantity = useCallback(
    (itemId: string, change: number, isCase: boolean) => {
      const item = cart.find((i) => i.id === itemId && i.isCase === isCase)
      if (item) {
        updateQuantityFromContext(itemId, item.quantity + change)
      }
    },
    [cart, updateQuantityFromContext],
  )

  // Process Sale & Update Inventory in Supabase
  const processSale = useCallback(async () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty!",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const updates = cart.map((item) => {
        const newQtyItems = item.isCase ? item.qty_on_hand_items : item.qty_on_hand_items - item.quantity
        const newQtyCases = item.isCase ? item.qty_on_hand_cases - item.quantity : item.qty_on_hand_cases

        return {
          id: item.id,
          qty_on_hand_items: newQtyItems >= 0 ? newQtyItems : 0,
          qty_on_hand_cases: newQtyCases >= 0 ? newQtyCases : 0,
        }
      })

      for (const update of updates) {
        const { error } = await supabase.from("products").update(update).eq("id", update.id)
        if (error) throw error
      }

      toast({
        title: "Success",
        description: `Sale completed!`, //Updated success message
      })
      resetSale()
    } catch (error) {
      console.error("Error processing sale:", error)
      toast({
        title: "Error",
        description: "Failed to process sale. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }, [cart, toast])

  const resetSale = useCallback(() => {
    removeFromCart()
    setCustomerPhone("")
    setDiscount(0)
    //setPaymentMethod("cash") //Removed
  }, [removeFromCart])

  const suspendOrder = useCallback(() => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty!",
        variant: "destructive",
      })
      return
    }

    const suspendedOrder: SuspendedOrder = {
      id: Date.now().toString(),
      cart,
      customerPhone,
      discount,
    }

    setSuspendedOrders((prev) => [...prev, suspendedOrder])
    resetSale()
    toast({
      title: "Success",
      description: "Order suspended successfully.",
    })
  }, [cart, customerPhone, discount, resetSale, toast])

  const recallOrder = useCallback(
    (orderId: string) => {
      const order = suspendedOrders.find((o) => o.id === orderId)
      if (order) {
        addToCartFromContext(...order.cart)
        setCustomerPhone(order.customerPhone)
        setDiscount(order.discount)
        setSuspendedOrders((prev) => prev.filter((o) => o.id !== orderId))
        toast({
          title: "Success",
          description: "Order recalled successfully.",
        })
      }
    },
    [suspendedOrders, toast, addToCartFromContext],
  )

  //const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) //Replaced
  const discountedTotal = total - discount
  const taxTotal = discountedTotal * (Number.parseFloat(settings.taxRate) / 100)
  const finalTotal = discountedTotal + taxTotal

  // Keyboard shortcuts
  useHotkeys("ctrl+f", () => searchInputRef.current?.focus(), { enableOnFormTags: true })
  useHotkeys("ctrl+p", processSale, { enableOnFormTags: true })
  useHotkeys("ctrl+n", resetSale, { enableOnFormTags: true })

  const Receipt = () => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-2">{settings.storeName}</h3>
      <p className="text-sm mb-2">{settings.storeAddress}</p>
      <p className="text-sm mb-4">{settings.receiptHeader}</p>
      <div className="border-t border-b py-2 mb-4">
        {cart.map((item) => (
          <div key={`${item.id}-${item.isCase}`} className="flex justify-between">
            <span>
              {item.name} {item.isCase ? "(Case)" : ""} x{item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mb-1">
        <span>Subtotal:</span>
        <span>${discountedTotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span>Tax ({settings.taxRate}%):</span>
        <span>${taxTotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Total:</span>
        <span>${finalTotal.toFixed(2)}</span>
      </div>
      <p className="text-sm mt-4">{settings.receiptFooter}</p>
    </div>
  )

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-semibold">Cashier</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Search Bar */}
          <div className="mb-4">
            <Input
              ref={searchInputRef}
              placeholder="Scan barcode or search item... (Ctrl+F)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchResults.length > 0 && searchTerm && (
              <div className="mt-2 bg-white border rounded-md shadow-sm max-h-60 overflow-y-auto">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                    onClick={() => handleAddToCart(item)}
                  >
                    <span>{item.name}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {customButtons.slice(0, 3).map((button) => (
              <Button
                key={button.id}
                onClick={() =>
                  handleAddToCart({
                    ...button,
                    id: button.id.toString(),
                    qty_on_hand_items: 1,
                    qty_on_hand_cases: 0,
                    units_per_case: 1,
                  } as Item)
                }
                className="w-full"
              >
                {button.label} - ${button.price.toFixed(2)}
              </Button>
            ))}
          </div>

          {/* Cart */}
          <Card>
            <CardHeader>
              <CardTitle>Current Cart</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.map((item) => (
                <div key={`${item.id}-${item.isCase}`} className="flex justify-between items-center mb-2">
                  <span>
                    {item.name} {item.isCase ? "(Case)" : "(Bottle)"}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleUpdateQuantity(item.id, -1, item.isCase)}>
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button size="sm" variant="outline" onClick={() => handleUpdateQuantity(item.id, 1, item.isCase)}>
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <Label htmlFor="discount">Discount ($)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number.parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="customer-phone">Customer Phone (for loyalty)</Label>
                <Input
                  id="customer-phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
              <div className="mt-4 text-xl font-bold">
                <p>Subtotal: ${discountedTotal.toFixed(2)}</p>
                <p>
                  Tax ({settings.taxRate}%): ${taxTotal.toFixed(2)}
                </p>
                <p>Total: ${finalTotal.toFixed(2)}</p>
              </div>
              <div className="mt-4">{/* Payment Method Buttons Removed */}</div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  className="w-full bg-green-600 text-white"
                  onClick={() => router.push("/checkout")} //Updated Process Sale button
                  disabled={isProcessing || cart.length === 0}
                >
                  Process Sale (Ctrl+P)
                </Button>
                <Button className="w-full" onClick={resetSale} disabled={isProcessing || cart.length === 0}>
                  New Sale (Ctrl+N)
                </Button>
                <Button className="w-full" onClick={suspendOrder} disabled={isProcessing || cart.length === 0}>
                  Suspend Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suspended Orders */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Suspended Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {suspendedOrders.map((order) => (
                <div key={order.id} className="mb-2 flex justify-between items-center">
                  <span>Order {order.id}</span>
                  <Button onClick={() => recallOrder(order.id)}>Recall</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Receipt Dialog */}
      {/* This section remains unchanged */}
      {/* <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sale Complete</DialogTitle>
          </DialogHeader>
          <Receipt />
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => window.print()}>
              <Printer className="mr-2" /> Print Receipt
            </Button>
            <Button onClick={resetSale}>New Sale</Button>
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}

