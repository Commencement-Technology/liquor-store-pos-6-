"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for stores and inventory
const stores = [
  { id: 1, name: "Main Store" },
  { id: 2, name: "Branch Store 1" },
  { id: 3, name: "Branch Store 2" },
]

const inventory = [
  { id: 1, name: "Red Wine", sku: "RW001", quantity: 100 },
  { id: 2, name: "White Wine", sku: "WW001", quantity: 80 },
  { id: 3, name: "Vodka", sku: "V001", quantity: 50 },
  { id: 4, name: "Whiskey", sku: "W001", quantity: 60 },
]

export function StoreTransfer() {
  const [fromStore, setFromStore] = useState("")
  const [toStore, setToStore] = useState("")
  const [transferItems, setTransferItems] = useState<{ id: number; quantity: number }[]>([])

  const handleQuantityChange = (id: number, quantity: number) => {
    setTransferItems((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing) {
        return prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      } else {
        return [...prev, { id, quantity }]
      }
    })
  }

  const handleTransfer = () => {
    // In a real application, you would send this data to your backend
    console.log("Transfer from:", fromStore)
    console.log("Transfer to:", toStore)
    console.log("Items to transfer:", transferItems)
    // Reset form after transfer
    setFromStore("")
    setToStore("")
    setTransferItems([])
    alert("Transfer completed successfully!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Transfer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="from-store">From Store</Label>
            <Select value={fromStore} onValueChange={setFromStore}>
              <SelectTrigger id="from-store">
                <SelectValue placeholder="Select store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="to-store">To Store</Label>
            <Select value={toStore} onValueChange={setToStore}>
              <SelectTrigger id="to-store">
                <SelectValue placeholder="Select store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Available Quantity</TableHead>
              <TableHead>Transfer Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    max={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value, 10))}
                    value={transferItems.find((i) => i.id === item.id)?.quantity || ""}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          onClick={handleTransfer}
          className="mt-4"
          disabled={!fromStore || !toStore || transferItems.length === 0}
        >
          Complete Transfer
        </Button>
      </CardContent>
    </Card>
  )
}

