"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Customer = {
  id: number
  name: string
  phoneNumber: string
  loyaltyPoints: number
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: "John Doe", phoneNumber: "123-456-7890", loyaltyPoints: 100 },
    { id: 2, name: "Jane Smith", phoneNumber: "234-567-8901", loyaltyPoints: 150 },
  ])
  const [newCustomerName, setNewCustomerName] = useState("")
  const [newCustomerPhone, setNewCustomerPhone] = useState("")
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(true)
  const [pointsPerDollar, setPointsPerDollar] = useState("1")
  const [redemptionRate, setRedemptionRate] = useState("0.01")

  const addCustomer = () => {
    if (newCustomerName.trim() && newCustomerPhone.trim()) {
      setCustomers([
        ...customers,
        {
          id: Date.now(),
          name: newCustomerName.trim(),
          phoneNumber: newCustomerPhone.trim(),
          loyaltyPoints: 0,
        },
      ])
      setNewCustomerName("")
      setNewCustomerPhone("")
    }
  }

  const removeCustomer = (id: number) => {
    setCustomers(customers.filter((customer) => customer.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Customer Loyalty</h2>

      <Card>
        <CardHeader>
          <CardTitle>Loyalty Program Settings</CardTitle>
          <CardDescription>Configure your customer loyalty program</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="loyalty-toggle">Enable Loyalty Program</Label>
              <Switch id="loyalty-toggle" checked={loyaltyEnabled} onCheckedChange={setLoyaltyEnabled} />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="points-per-dollar">Points per Dollar Spent</Label>
              <Input
                id="points-per-dollar"
                type="number"
                value={pointsPerDollar}
                onChange={(e) => setPointsPerDollar(e.target.value)}
                className="w-24"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="redemption-rate">Redemption Rate ($ per point)</Label>
              <Input
                id="redemption-rate"
                type="number"
                value={redemptionRate}
                onChange={(e) => setRedemptionRate(e.target.value)}
                className="w-24"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>Manage your loyalty program customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Loyalty Points</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell>{customer.loyaltyPoints}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => removeCustomer(customer.id)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex space-x-2">
            <Input
              placeholder="Customer name"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
            />
            <Input
              placeholder="Phone number"
              value={newCustomerPhone}
              onChange={(e) => setNewCustomerPhone(e.target.value)}
            />
            <Button onClick={addCustomer}>Add Customer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

