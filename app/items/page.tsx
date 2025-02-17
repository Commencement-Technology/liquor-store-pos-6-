"use client"

import { useState, useEffect, useCallback, type React } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Item = {
  id: number
  barcode: string
  name: string
  qtyOnHand: { items: number; cases: number }
  price: number
  avgCost: number
  margin: number
  size: string
  category: string
  supplier: string
  unitsPerCase: number
  caseCost: number
  rank: number
}

const initialItems: Item[] = [
  {
    id: 1,
    barcode: "123456789",
    name: "Red Wine",
    qtyOnHand: { items: 50, cases: 5 },
    price: 19.99,
    avgCost: 15.0,
    margin: 25.0,
    size: "750ml",
    category: "Wine",
    supplier: "Wine Supplier Inc.",
    unitsPerCase: 12,
    caseCost: 180.0,
    rank: 1,
  },
  {
    id: 2,
    barcode: "987654321",
    name: "Vodka",
    qtyOnHand: { items: 30, cases: 3 },
    price: 24.99,
    avgCost: 18.0,
    margin: 28.0,
    size: "1L",
    category: "Spirits",
    supplier: "Spirits Distributor LLC",
    unitsPerCase: 6,
    caseCost: 108.0,
    rank: 2,
  },
]

const calculateDerivedValues = (item: Partial<Item>): Partial<Item> => {
  const updatedItem = { ...item }

  if (item.price && item.avgCost) {
    updatedItem.margin = ((item.price - item.avgCost) / item.price) * 100
  }

  if (item.unitsPerCase && item.avgCost) {
    updatedItem.caseCost = item.unitsPerCase * item.avgCost
  }

  return updatedItem
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState<Partial<Item>>({
    qtyOnHand: { items: 0, cases: 0 },
    margin: 0,
    rank: 0,
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [categories, setCategories] = useState<string[]>(["Wine", "Beer", "Spirits", "Mixers", "Snacks"])
  const [suppliers, setSuppliers] = useState<string[]>(["ABC Distributors", "XYZ Wines", "Local Brewery Co."])

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      const itemToAdd = calculateDerivedValues({
        ...newItem,
        id: Math.max(...items.map((i) => i.id)) + 1,
        qtyOnHand: newItem.qtyOnHand || { items: 0, cases: 0 },
        rank: newItem.rank || items.length + 1,
      })
      setItems([...items, itemToAdd as Item])
      setNewItem({
        qtyOnHand: { items: 0, cases: 0 },
        margin: 0,
        rank: 0,
      })
      setIsAddDialogOpen(false)
    }
  }

  const handleEditItem = () => {
    if (editingItem) {
      const updatedItem = calculateDerivedValues(editingItem)
      setShowConfirmation(true)
    }
  }

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const ItemForm = ({ item, setItem, isNewItem = false }) => {
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        let updatedItem: Partial<Item> = { ...item }

        if (name === "qtyOnHand.items" || name === "qtyOnHand.cases") {
          const [parent, child] = name.split(".")
          updatedItem = {
            ...item,
            qtyOnHand: { ...item.qtyOnHand, [child]: Number.parseInt(value) || 0 },
          }
        } else if (name === "price" || name === "avgCost" || name === "unitsPerCase") {
          updatedItem = { ...item, [name]: Number.parseFloat(value) || 0 }
        } else {
          updatedItem = { ...item, [name]: value }
        }

        setItem(calculateDerivedValues(updatedItem))
      },
      [item, setItem],
    )

    useEffect(() => {
      const updatedItem = calculateDerivedValues(item)
      if (JSON.stringify(updatedItem) !== JSON.stringify(item)) {
        setItem(updatedItem)
      }
    }, [item, setItem])

    return (
      <div className="grid gap-4 py-4 sm:grid-cols-2">
        <div className="grid sm:grid-cols-4 items-center gap-4">
          <Label htmlFor={`${isNewItem ? "new" : "edit"}-barcode`} className="sm:text-right">
            Barcode
          </Label>
          <Input
            id={`${isNewItem ? "new" : "edit"}-barcode`}
            name="barcode"
            value={item.barcode || ""}
            onChange={handleInputChange}
            className="w-full sm:col-span-3"
          />
        </div>
        <div className="grid sm:grid-cols-4 items-center gap-4">
          <Label htmlFor={`${isNewItem ? "new" : "edit"}-name`} className="sm:text-right">
            Name
          </Label>
          <Input
            id={`${isNewItem ? "new" : "edit"}-name`}
            name="name"
            value={item.name || ""}
            onChange={handleInputChange}
            className="w-full sm:col-span-3"
          />
        </div>
        <div className="grid sm:grid-cols-4 items-center gap-4">
          <Label htmlFor={`${isNewItem ? "new" : "edit"}-qty-items`} className="sm:text-right">
            Quantity (Items)
          </Label>
          <Input
            id={`${isNewItem ? "new" : "edit"}-qty-items`}
            name="qtyOnHand.items"
            type="number"
            value={item.qtyOnHand?.items || 0}
            onChange={handleInputChange}
            className="w-full sm:col-span-3"
          />
        </div>
        <div className="grid sm:grid-cols-4 items-center gap-4">
          <Label htmlFor={`${isNewItem ? "new" : "edit"}-cases`} className="sm:text-right">
            Cases
          </Label>
          <Input
            id={`${isNewItem ? "new" : "edit"}-cases`}
            name="cases"
            type="number"
            value={item.qtyOnHand?.cases || 0}
            readOnly
            className="w-full sm:col-span-3 bg-gray-100"
          />
        </div>
        <div className="grid sm:grid-cols-4 items-center gap-4">
          <Label htmlFor={`${isNewItem ? "new" : "edit"}-price`} className="sm:text-right">
            Price
          </Label>
          <Input
            id={`${isNewItem ? "new" : "edit"}-price`}
            name="price"
            type="number"
            value={item.price || ""}
            onChange={handleInputChange}
            className="w-full sm:col-span-3"
          />
        </div>
        <div className="grid sm:grid-cols-4 items-center gap-4">
          <Label htmlFor={`${isNewItem ? "new" : "edit"}-avg-cost`} className="sm:text-right">
            Average Cost
          </Label>
          <Input
            id={`${isNewItem ? "new" : "edit"}-avg-cost`}
            name="avgCost"
            type="number"
            value={item.avgCost || ""}
            onChange={handleInputChange}
            className="w-full sm:col-span-3"
          />
        </div>
        <div className="grid sm:grid-cols-4 items-center gap-4">
          <Label htmlFor={`${isNewItem ? "new" : "edit"}-margin`} className="sm:text-right">
            Margin (%)
          </Label>
          <Input
            id={`${isNewItem ? "new" : "edit"}-margin`}
            name="margin"
            type="number"
            value={item.margin?.toFixed(2) || ""}
            readOnly
            className="w-full sm:col-span-3 bg-gray-100"
          />
        </div>
        <div className="grid sm:grid-cols-4 items-center gap-4">
          <Label htmlFor={`${isNewItem ? "new" : "edit"}-size`} className="sm:text-right">
            Size
          </Label>
          <Input
            id={`${isNewItem ? "new" : "edit"}-size`}
            name="size"
            value={item.size || ""}
            onChange={handleInputChange}
            className="w-full sm:col-span-3"
          />
        </div>
        <div className="grid sm:grid-cols-4 items-center gap-4">
          <Label htmlFor={`${isNewItem ? "new" : "edit"}-category`} className="sm:text-right">
            Category
          </Label>
          <Select value={item.category || ""} onValueChange={(value) => setItem({ ...item, category: value })}>
            <SelectTrigger id={`${isNewItem ? "new" : "edit"}-category`} className="w-full sm:col-span-3">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid sm:grid-cols-4 items-center gap-4">
          <Label htmlFor={`${isNewItem ? "new" : "edit"}-supplier`} className="sm:text-right">
            Supplier
          </Label>
          <Select value={item.supplier || ""} onValueChange={(value) => setItem({ ...item, supplier: value })}>
            <SelectTrigger id={`${isNewItem ? "new" : "edit"}-supplier`} className="w-full sm:col-span-3">
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier} value={supplier}>
                  {supplier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid sm:grid-cols-4 items-center gap-4">
          <Label htmlFor={`${isNewItem ? "new" : "edit"}-units-per-case`} className="sm:text-right">
            Units per Case
          </Label>
          <Input
            id={`${isNewItem ? "new" : "edit"}-units-per-case`}
            name="unitsPerCase"
            type="number"
            value={item.unitsPerCase || ""}
            onChange={handleInputChange}
            className="w-full sm:col-span-3"
          />
        </div>
        <div className="grid sm:grid-cols-4 items-center gap-4">
          <Label htmlFor={`${isNewItem ? "new" : "edit"}-case-cost`} className="sm:text-right">
            Case Cost
          </Label>
          <Input
            id={`${isNewItem ? "new" : "edit"}-case-cost`}
            name="caseCost"
            type="number"
            value={item.caseCost?.toFixed(2) || ""}
            readOnly
            className="w-full sm:col-span-3 bg-gray-100"
          />
        </div>
        <div className="grid sm:grid-cols-4 items-center gap-4">
          <Label htmlFor={`${isNewItem ? "new" : "edit"}-rank`} className="sm:text-right">
            Rank
          </Label>
          <Input
            id={`${isNewItem ? "new" : "edit"}-rank`}
            name="rank"
            type="number"
            value={item.rank || ""}
            onChange={handleInputChange}
            className="w-full sm:col-span-3"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-6">Inventory Management</h2>
      <Tabs defaultValue="items" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>
        <TabsContent value="items">
          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
            <div className="w-full sm:w-auto">
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                </DialogHeader>
                <ItemForm item={newItem} setItem={setNewItem} isNewItem={true} />
                <DialogFooter>
                  <Button onClick={handleAddItem}>Add Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>QTY On Hand</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Avg Cost</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Units per Case</TableHead>
                  <TableHead>Case Cost</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.barcode}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{`${item.qtyOnHand.items} (${item.qtyOnHand.cases} cases)`}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>${item.avgCost.toFixed(2)}</TableCell>
                    <TableCell>{item.margin.toFixed(2)}%</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{item.unitsPerCase}</TableCell>
                    <TableCell>${item.caseCost.toFixed(2)}</TableCell>
                    <TableCell>{item.rank}</TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" onClick={() => setEditingItem(item)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[800px]">
                            <DialogHeader>
                              <DialogTitle>Edit Item</DialogTitle>
                            </DialogHeader>
                            {editingItem && <ItemForm item={editingItem} setItem={setEditingItem} />}
                            <DialogFooter>
                              <Button onClick={handleEditItem}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="categories">
          <CategoryManager categories={categories} setCategories={setCategories} />
        </TabsContent>
        <TabsContent value="suppliers">
          <SupplierManager suppliers={suppliers} setSuppliers={setSuppliers} />
        </TabsContent>
      </Tabs>
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to save these changes?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setItems(items.map((item) => (item.id === editingItem?.id ? editingItem : item)))
                setEditingItem(null)
                setShowConfirmation(false)
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CategoryManager({ categories, setCategories }) {
  const [newCategory, setNewCategory] = useState("")

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setNewCategory("")
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Manage Categories</h3>
      <div className="flex space-x-2 mb-4">
        <Input placeholder="New category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
        <Button onClick={addCategory}>Add Category</Button>
      </div>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category} className="flex justify-between items-center">
            <span>{category}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setCategories(categories.filter((c) => c !== category))}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SupplierManager({ suppliers, setSuppliers }) {
  const [newSupplier, setNewSupplier] = useState("")

  const addSupplier = () => {
    if (newSupplier && !suppliers.includes(newSupplier)) {
      setSuppliers([...suppliers, newSupplier])
      setNewSupplier("")
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Manage Suppliers</h3>
      <div className="flex space-x-2 mb-4">
        <Input placeholder="New supplier name" value={newSupplier} onChange={(e) => setNewSupplier(e.target.value)} />
        <Button onClick={addSupplier}>Add Supplier</Button>
      </div>
      <ul className="space-y-2">
        {suppliers.map((supplier) => (
          <li key={supplier} className="flex justify-between items-center">
            <span>{supplier}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setSuppliers(suppliers.filter((s) => s !== supplier))}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

