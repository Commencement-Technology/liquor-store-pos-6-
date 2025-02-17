"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

type Transfer = {
  id: number
  date: string
  fromStoreId: number
  toStoreId: number
  fromStore: string
  toStore: string
  status: string
}

type TransferItem = {
  id: number
  barcode: string
  name: string
  cases: number
  unitsPerCase: number
  items: number
  cost: number
  price: number
}

const stores = [
  { id: 1, name: "Main Store" },
  { id: 2, name: "Branch Store 1" },
  { id: 3, name: "Branch Store 2" },
]

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([
    {
      id: 1,
      date: "2023-06-01",
      fromStoreId: 1,
      toStoreId: 2,
      fromStore: "Main Store",
      toStore: "Branch Store 1",
      status: "Completed",
    },
    {
      id: 2,
      date: "2023-06-02",
      fromStoreId: 2,
      toStoreId: 1,
      fromStore: "Branch Store 1",
      toStore: "Main Store",
      status: "In Transit",
    },
  ])
  const [showNewTransfer, setShowNewTransfer] = useState(false)
  const [newTransfer, setNewTransfer] = useState<Partial<Transfer>>({})
  const [transferItems, setTransferItems] = useState<TransferItem[]>([])
  const [currentBarcode, setCurrentBarcode] = useState("")

  const handleAddTransfer = () => {
    if (newTransfer.fromStoreId && newTransfer.toStoreId) {
      setTransfers([
        ...transfers,
        {
          id: Date.now(),
          date: new Date().toISOString().split("T")[0],
          fromStoreId: newTransfer.fromStoreId,
          toStoreId: newTransfer.toStoreId,
          fromStore: stores.find((store) => store.id === newTransfer.fromStoreId)?.name || "",
          toStore: stores.find((store) => store.id === newTransfer.toStoreId)?.name || "",
          status: "Pending",
        },
      ])
      setNewTransfer({})
      setShowNewTransfer(false)
    }
  }

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would fetch the item details from your database
    const mockItem: TransferItem = {
      id: Date.now(),
      barcode: currentBarcode,
      name: `Item ${currentBarcode}`,
      cases: 0,
      unitsPerCase: 12,
      items: 0,
      cost: 10.0,
      price: 15.0,
    }
    setTransferItems([...transferItems, mockItem])
    setCurrentBarcode("")
  }

  const updateTransferItem = (id: number, field: keyof TransferItem, value: number) => {
    setTransferItems(transferItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Store Transfers</h2>
        <Button onClick={() => setShowNewTransfer(true)}>Add New Transfer</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>From Store</TableHead>
            <TableHead>To Store</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers.map((transfer) => (
            <TableRow key={transfer.id}>
              <TableCell>{transfer.date}</TableCell>
              <TableCell>{transfer.fromStore}</TableCell>
              <TableCell>{transfer.toStore}</TableCell>
              <TableCell>{transfer.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showNewTransfer} onOpenChange={setShowNewTransfer}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>New Transfer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from-store">From Store</Label>
                <Select
                  value={newTransfer.fromStoreId?.toString() || ""}
                  onValueChange={(value) => setNewTransfer({ ...newTransfer, fromStoreId: Number(value) })}
                >
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
                <Select
                  value={newTransfer.toStoreId?.toString() || ""}
                  onValueChange={(value) => setNewTransfer({ ...newTransfer, toStoreId: Number(value) })}
                >
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
            <form onSubmit={handleBarcodeSubmit}>
              <Input
                placeholder="Scan barcode..."
                value={currentBarcode}
                onChange={(e) => setCurrentBarcode(e.target.value)}
              />
            </form>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Cases</TableHead>
                  <TableHead>Units/Case</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transferItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.barcode}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.cases}
                        onChange={(e) => updateTransferItem(item.id, "cases", Number(e.target.value))}
                      />
                    </TableCell>
                    <TableCell>{item.unitsPerCase}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.items}
                        onChange={(e) => updateTransferItem(item.id, "items", Number(e.target.value))}
                      />
                    </TableCell>
                    <TableCell>${item.cost.toFixed(2)}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button onClick={handleAddTransfer}>Create Transfer</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

