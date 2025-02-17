"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Dummy data for available items
const availableItems = [
  { id: 1, name: "Red Wine", price: 19.99 },
  { id: 2, name: "White Wine", price: 17.99 },
  { id: 3, name: "Rosé", price: 15.99 },
  { id: 4, name: "Champagne", price: 29.99 },
  { id: 5, name: "Beer", price: 9.99 },
]

type PromotionItem = {
  id: number
  name: string
  price: number
}

type Promotion = {
  id: number
  name: string
  description: string
  items: PromotionItem[]
  discountType: "percentage" | "fixed"
  discountValue: number
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: 1,
      name: "Wine Duo",
      description: "2 for $30",
      items: [availableItems[0], availableItems[1]],
      discountType: "fixed",
      discountValue: 7.98,
    },
    {
      id: 2,
      name: "Party Pack",
      description: "3 for $40",
      items: [availableItems[2], availableItems[3], availableItems[4]],
      discountType: "fixed",
      discountValue: 15.97,
    },
  ])

  const [newPromotion, setNewPromotion] = useState<Promotion>({
    id: 0,
    name: "",
    description: "",
    items: [],
    discountType: "percentage",
    discountValue: 0,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<PromotionItem[]>([])

  useEffect(() => {
    const results = availableItems.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setSearchResults(results)
  }, [searchTerm])

  const handleAddPromotion = () => {
    if (newPromotion.name && newPromotion.items.length > 0) {
      setPromotions([...promotions, { ...newPromotion, id: Date.now() }])
      setNewPromotion({
        id: 0,
        name: "",
        description: "",
        items: [],
        discountType: "percentage",
        discountValue: 0,
      })
    }
  }

  const handleAddItem = (item: PromotionItem) => {
    if (!newPromotion.items.some((i) => i.id === item.id)) {
      setNewPromotion((prev) => ({
        ...prev,
        items: [...prev.items, item],
      }))
    }
    setSearchTerm("")
  }

  const handleRemoveItem = (itemId: number) => {
    setNewPromotion((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }))
  }

  const calculateDiscount = (items: PromotionItem[], type: "percentage" | "fixed", value: number) => {
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0)
    if (type === "percentage") {
      return totalPrice * (value / 100)
    } else {
      return value
    }
  }

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-semibold">Promotions</h2>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Create New Promotion</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Promotion</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newPromotion.name}
                onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newPromotion.description}
                onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="search" className="text-right">
                Add Items
              </Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items..."
                className="col-span-3"
              />
            </div>
            {searchTerm && searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {searchResults.map((item) => (
                    <div key={item.id} className="flex justify-between items-center mb-2">
                      <span>
                        {item.name} - ${item.price.toFixed(2)}
                      </span>
                      <Button onClick={() => handleAddItem(item)}>Add</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Selected Items</CardTitle>
              </CardHeader>
              <CardContent>
                {newPromotion.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-2">
                    <span>
                      {item.name} - ${item.price.toFixed(2)}
                    </span>
                    <Button variant="destructive" onClick={() => handleRemoveItem(item.id)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountType" className="text-right">
                Discount Type
              </Label>
              <select
                id="discountType"
                value={newPromotion.discountType}
                onChange={(e) =>
                  setNewPromotion({ ...newPromotion, discountType: e.target.value as "percentage" | "fixed" })
                }
                className="col-span-3"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountValue" className="text-right">
                Discount Value
              </Label>
              <Input
                id="discountValue"
                type="number"
                value={newPromotion.discountValue}
                onChange={(e) => setNewPromotion({ ...newPromotion, discountValue: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleAddPromotion}>Add Promotion</Button>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promo) => (
            <TableRow key={promo.id}>
              <TableCell>{promo.name}</TableCell>
              <TableCell>{promo.description}</TableCell>
              <TableCell>{promo.items.map((item) => item.name).join(", ")}</TableCell>
              <TableCell>
                {promo.discountType === "percentage" ? `${promo.discountValue}%` : `$${promo.discountValue.toFixed(2)}`}
                <br />
                (${calculateDiscount(promo.items, promo.discountType, promo.discountValue).toFixed(2)} off)
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="ml-2">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

