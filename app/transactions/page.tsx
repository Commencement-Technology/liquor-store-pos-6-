"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, ArrowUpDown, Printer, Search } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"

// Mock data for transactions
const mockTransactions = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  date: new Date(2023, 5, Math.floor(i / 3) + 1).toISOString().split("T")[0],
  time: `${Math.floor(Math.random() * 24)
    .toString()
    .padStart(2, "0")}:${Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, "0")}`,
  total: +(Math.random() * 100 + 10).toFixed(2),
  items: Math.floor(Math.random() * 10) + 1,
  paymentMethod: ["Cash", "Credit Card", "Debit Card"][Math.floor(Math.random() * 3)],
  cashier: ["John Doe", "Jane Smith", "Alice Johnson", "Bob Wilson"][Math.floor(Math.random() * 4)],
}))

// Mock data for transaction details
const mockTransactionDetails = {}
mockTransactions.forEach((transaction) => {
  mockTransactionDetails[transaction.id] = Array.from({ length: transaction.items }, (_, i) => ({
    id: i + 1,
    name: ["Red Wine", "White Wine", "Beer", "Vodka", "Whiskey", "Gin", "Rum", "Tequila"][
      Math.floor(Math.random() * 8)
    ],
    quantity: Math.floor(Math.random() * 3) + 1,
    price: +(Math.random() * 20 + 5).toFixed(2),
  }))
})

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(mockTransactions)
  const [loading, setLoading] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" })
  const [filters, setFilters] = useState({
    dateRange: { from: undefined, to: undefined },
    minTotal: "",
    maxTotal: "",
    paymentMethod: "",
    cashier: "",
  })
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const itemsPerPage = 10

  useEffect(() => {
    filterAndSortTransactions()
  }, [filters, sortConfig, searchQuery])

  const filterAndSortTransactions = () => {
    setLoading(true)
    setTimeout(() => {
      let filteredTransactions = [...mockTransactions]

      // Apply filters
      if (filters.dateRange.from) {
        filteredTransactions = filteredTransactions.filter(
          (t) => t.date >= filters.dateRange.from.toISOString().split("T")[0],
        )
      }
      if (filters.dateRange.to) {
        filteredTransactions = filteredTransactions.filter(
          (t) => t.date <= filters.dateRange.to.toISOString().split("T")[0],
        )
      }
      if (filters.minTotal) {
        filteredTransactions = filteredTransactions.filter((t) => t.total >= Number.parseFloat(filters.minTotal))
      }
      if (filters.maxTotal) {
        filteredTransactions = filteredTransactions.filter((t) => t.total <= Number.parseFloat(filters.maxTotal))
      }
      if (filters.paymentMethod) {
        filteredTransactions = filteredTransactions.filter((t) => t.paymentMethod === filters.paymentMethod)
      }
      if (filters.cashier) {
        filteredTransactions = filteredTransactions.filter((t) =>
          t.cashier.toLowerCase().includes(filters.cashier.toLowerCase()),
        )
      }

      // Apply search
      if (searchQuery) {
        filteredTransactions = filteredTransactions.filter((t) =>
          Object.values(t).some((value) => value.toString().toLowerCase().includes(searchQuery.toLowerCase())),
        )
      }

      // Apply sorting
      filteredTransactions.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })

      setTransactions(filteredTransactions)
      setLoading(false)
    }, 500) // Simulating API delay
  }

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  const resetFilters = () => {
    setFilters({
      dateRange: { from: undefined, to: undefined },
      minTotal: "",
      maxTotal: "",
      paymentMethod: "",
      cashier: "",
    })
    setSearchQuery("")
    setCurrentPage(1)
  }

  const Receipt = ({ transaction }) => {
    const items = mockTransactionDetails[transaction.id]
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = subtotal * 0.08 // Assuming 8% tax
    const total = subtotal + tax

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Liquor Store POS</h2>
          <p>123 Main St, Anytown, USA</p>
          <p>Tel: (555) 123-4567</p>
        </div>
        <div className="mb-4">
          <p>
            <strong>Date & Time:</strong> {transaction.date} {transaction.time}
          </p>
          <p>
            <strong>Cashier:</strong> {transaction.cashier}
          </p>
          <p>
            <strong>Transaction ID:</strong> {transaction.id}
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 text-right">
          <p>
            <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
          </p>
          <p>
            <strong>Tax (8%):</strong> ${tax.toFixed(2)}
          </p>
          <p className="text-xl font-bold">
            <strong>Total:</strong> ${total.toFixed(2)}
          </p>
        </div>
        <div className="mt-6 text-center">
          <p>
            <strong>Payment Method:</strong> {transaction.paymentMethod}
          </p>
          <p className="mt-4">Thank you for your purchase!</p>
        </div>
      </div>
    )
  }

  const paginatedTransactions = transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-semibold">Transactions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <Card className="p-4 col-span-2">
          <Label htmlFor="date-range">Date Range</Label>
          <DateRangePicker
            id="date-range"
            value={filters.dateRange}
            onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
          />
        </Card>

        <Card className="p-4">
          <Label htmlFor="min-total">Min Total</Label>
          <Input
            id="min-total"
            type="number"
            placeholder="Min total"
            value={filters.minTotal}
            onChange={(e) => setFilters({ ...filters, minTotal: e.target.value })}
          />
        </Card>

        <Card className="p-4">
          <Label htmlFor="max-total">Max Total</Label>
          <Input
            id="max-total"
            type="number"
            placeholder="Max total"
            value={filters.maxTotal}
            onChange={(e) => setFilters({ ...filters, maxTotal: e.target.value })}
          />
        </Card>

        <Card className="p-4">
          <Label htmlFor="payment-method">Payment Method</Label>
          <Select
            value={filters.paymentMethod}
            onValueChange={(value) => setFilters({ ...filters, paymentMethod: value })}
          >
            <SelectTrigger id="payment-method">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
              <SelectItem value="Debit Card">Debit Card</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-4">
          <Label htmlFor="cashier">Cashier</Label>
          <Input
            id="cashier"
            placeholder="Cashier name"
            value={filters.cashier}
            onChange={(e) => setFilters({ ...filters, cashier: e.target.value })}
          />
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Button onClick={resetFilters}>Reset Filters</Button>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                  Date <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("time")}>
                  Time <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("total")}>
                  Total <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("items")}>
                  Items <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("paymentMethod")}>
                  Payment Method <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("cashier")}>
                  Cashier <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.time}</TableCell>
                  <TableCell>${transaction.total.toFixed(2)}</TableCell>
                  <TableCell>{transaction.items}</TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                  <TableCell>{transaction.cashier}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                          View Receipt
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Transaction Receipt</DialogTitle>
                        </DialogHeader>
                        {selectedTransaction && <Receipt transaction={selectedTransaction} />}
                        <div className="flex justify-end mt-4">
                          <Button variant="outline" size="sm" onClick={() => window.print()}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print Receipt
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <div>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, transactions.length)} of {transactions.length} entries
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(transactions.length / itemsPerPage)))
                }
                disabled={currentPage === Math.ceil(transactions.length / itemsPerPage)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

