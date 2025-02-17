"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useCustomButtons } from "@/contexts/custom-buttons-context"
import { useSettings } from "@/contexts/settings-context"

export type User = {
  id: number
  name: string
  role: "Admin" | "Manager" | "Cashier"
  username: string
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { settings, updateSettings } = useSettings()
  const { customButtons, addCustomButton, updateCustomButton, deleteCustomButton } = useCustomButtons()
  const [newButtonLabel, setNewButtonLabel] = useState("")
  const [newButtonPrice, setNewButtonPrice] = useState("")
  const [doorDashEnabled, setDoorDashEnabled] = useState(false)
  const [shopifyEnabled, setShopifyEnabled] = useState(false)
  const [uberEatsEnabled, setUberEatsEnabled] = useState(false)
  const [lowStockThreshold, setLowStockThreshold] = useState("10")
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", role: "Admin", username: "john.doe" },
    { id: 2, name: "Jane Smith", role: "Cashier", username: "jane.smith" },
  ])
  const [newUserName, setNewUserName] = useState("")
  const [newUserRole, setNewUserRole] = useState<"Admin" | "Manager" | "Cashier">("Cashier")
  const [newUsername, setNewUsername] = useState("")
  const [editingButtonId, setEditingButtonId] = useState<number | null>(null)

  const handleAddCustomButton = () => {
    if (newButtonLabel.trim() && newButtonPrice.trim()) {
      addCustomButton({
        label: newButtonLabel.trim(),
        price: Number.parseFloat(newButtonPrice),
      })
      setNewButtonLabel("")
      setNewButtonPrice("")
    }
  }

  const handleUpdateCustomButton = () => {
    if (editingButtonId && newButtonLabel.trim() && newButtonPrice.trim()) {
      updateCustomButton({
        id: editingButtonId,
        label: newButtonLabel.trim(),
        price: Number.parseFloat(newButtonPrice),
      })
      setNewButtonLabel("")
      setNewButtonPrice("")
      setEditingButtonId(null)
    }
  }

  const addUser = () => {
    if (newUserName.trim() && newUsername.trim()) {
      setUsers([
        ...users,
        {
          id: Date.now(),
          name: newUserName.trim(),
          role: newUserRole,
          username: newUsername.trim(),
        },
      ])
      setNewUserName("")
      setNewUsername("")
      setNewUserRole("Cashier")
    }
  }

  const removeUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const saveGeneralSettings = async () => {
    await updateSettings({
      taxRate: settings.taxRate,
      storeName: settings.storeName,
      storeAddress: settings.storeAddress,
      receiptHeader: settings.receiptHeader,
      receiptFooter: settings.receiptFooter,
    })
    alert("Settings saved successfully!")
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="custom-buttons">Custom Buttons</TabsTrigger>
          {user?.role === "Admin" && <TabsTrigger value="superpower">SuperPower</TabsTrigger>}
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general store settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => updateSettings({ taxRate: e.target.value })}
                    className="w-24"
                  />
                </div>
                <div>
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    value={settings.storeName}
                    onChange={(e) => updateSettings({ storeName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="store-address">Store Address</Label>
                  <Input
                    id="store-address"
                    value={settings.storeAddress}
                    onChange={(e) => updateSettings({ storeAddress: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="receipt-header">Receipt Header</Label>
                  <Input
                    id="receipt-header"
                    value={settings.receiptHeader}
                    onChange={(e) => updateSettings({ receiptHeader: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="receipt-footer">Receipt Footer</Label>
                  <Input
                    id="receipt-footer"
                    value={settings.receiptFooter}
                    onChange={(e) => updateSettings({ receiptFooter: e.target.value })}
                  />
                </div>
                <Button onClick={saveGeneralSettings}>Save General Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Button variant="destructive" onClick={() => removeUser(user.id)}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex space-x-2">
                <Input
                  placeholder="New user name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
                <Input
                  placeholder="New username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <Select
                  value={newUserRole}
                  onValueChange={(value: "Admin" | "Manager" | "Cashier") => setNewUserRole(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Cashier">Cashier</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addUser}>Add User</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom-buttons">
          <Card>
            <CardHeader>
              <CardTitle>Custom Buttons</CardTitle>
              <CardDescription>Manage custom buttons for the cashier page</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customButtons.map((button) => (
                    <TableRow key={button.id}>
                      <TableCell>{button.label}</TableCell>
                      <TableCell>${button.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() => {
                            setNewButtonLabel(button.label)
                            setNewButtonPrice(button.price.toString())
                            setEditingButtonId(button.id)
                          }}
                        >
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteCustomButton(button.id)}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex space-x-2">
                <Input
                  placeholder="Button label"
                  value={newButtonLabel}
                  onChange={(e) => setNewButtonLabel(e.target.value)}
                />
                <Input
                  placeholder="Button price"
                  type="number"
                  value={newButtonPrice}
                  onChange={(e) => setNewButtonPrice(e.target.value)}
                />
                <Button onClick={editingButtonId ? handleUpdateCustomButton : handleAddCustomButton}>
                  {editingButtonId ? "Update" : "Add"} Button
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {user?.role === "Admin" && (
          <TabsContent value="superpower">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Configure advanced system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="multi-store-inventory">Enable Multi-Store Inventory</Label>
                    <Switch id="multi-store-inventory" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="advanced-reporting">Enable Advanced Reporting</Label>
                    <Switch id="advanced-reporting" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="api-access">Enable API Access</Label>
                    <Switch id="api-access" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

