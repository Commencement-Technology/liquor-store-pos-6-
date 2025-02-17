"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function ReportsPage() {
  const [reportType, setReportType] = useState("sales")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [minSales, setMinSales] = useState("")
  const [itemFilter, setItemFilter] = useState("")
  const [userFilter, setUserFilter] = useState("")
  const [loading, setLoading] = useState(false)
  const [filteredData, setFilteredData] = useState([])

  // Dummy data for different reports
  const salesData = [
    { date: "2023-06-01", totalSales: 1234.56, itemsSold: 45 },
    { date: "2023-06-02", totalSales: 2345.67, itemsSold: 67 },
    { date: "2023-06-03", totalSales: 3456.78, itemsSold: 89 },
    { date: "2023-06-04", totalSales: 4567.89, itemsSold: 101 },
    { date: "2023-06-05", totalSales: 5678.9, itemsSold: 123 },
  ]

  const inventoryChanges = [
    { date: "2023-06-01", item: "Red Wine", changeType: "Restock", quantity: 50, user: "John Doe" },
    { date: "2023-06-02", item: "Vodka", changeType: "Manual Adjustment", quantity: -5, user: "Jane Smith" },
    { date: "2023-06-03", item: "Whiskey", changeType: "Sale", quantity: -2, user: "System" },
    { date: "2023-06-04", item: "Beer", changeType: "Restock", quantity: 100, user: "John Doe" },
    { date: "2023-06-05", item: "Gin", changeType: "Manual Adjustment", quantity: 10, user: "Jane Smith" },
  ]

  const priceChanges = [
    { date: "2023-06-01", item: "Red Wine", oldPrice: 19.99, newPrice: 21.99, user: "John Doe" },
    { date: "2023-06-02", item: "Vodka", oldPrice: 24.99, newPrice: 22.99, user: "Jane Smith" },
    { date: "2023-06-03", item: "Whiskey", oldPrice: 29.99, newPrice: 31.99, user: "John Doe" },
    { date: "2023-06-04", item: "Beer", oldPrice: 9.99, newPrice: 8.99, user: "Jane Smith" },
    { date: "2023-06-05", item: "Gin", oldPrice: 27.99, newPrice: 26.99, user: "John Doe" },
  ]

  const manualDiscounts = [
    { date: "2023-06-01", item: "Red Wine", discount: 2.0, reason: "Damaged Label", user: "John Doe" },
    { date: "2023-06-02", item: "Vodka", discount: 3.0, reason: "Customer Loyalty", user: "Jane Smith" },
    { date: "2023-06-03", item: "Whiskey", discount: 5.0, reason: "Bulk Purchase", user: "John Doe" },
    { date: "2023-06-04", item: "Beer", discount: 1.0, reason: "Customer Complaint", user: "Jane Smith" },
    { date: "2023-06-05", item: "Gin", discount: 2.5, reason: "Manager's Special", user: "John Doe" },
  ]

  const promotionsData = [
    { date: "2023-06-01", promotion: "Wine Duo", discountedAmount: 10.0, totalSales: 50.0 },
    { date: "2023-06-02", promotion: "Party Pack", discountedAmount: 15.0, totalSales: 75.0 },
    { date: "2023-06-03", promotion: "Beer Bundle", discountedAmount: 8.0, totalSales: 40.0 },
  ]

  const filterData = () => {
    setLoading(true)
    setTimeout(() => {
      let data
      switch (reportType) {
        case "sales":
          data = salesData
          break
        case "inventory":
          data = inventoryChanges
          break
        case "prices":
          data = priceChanges
          break
        case "discounts":
          data = manualDiscounts
          break
        case "promotions":
          data = promotionsData
          break
        default:
          data = []
      }

      const filtered = data.filter((item) => {
        const dateInRange = (!startDate || item.date >= startDate) && (!endDate || item.date <= endDate)
        const meetsMinSales = !minSales || (item.totalSales && item.totalSales >= Number.parseFloat(minSales))
        const matchesItem = !itemFilter || (item.item && item.item.toLowerCase().includes(itemFilter.toLowerCase()))
        const matchesUser = !userFilter || (item.user && item.user.toLowerCase().includes(userFilter.toLowerCase()))
        return dateInRange && meetsMinSales && matchesItem && matchesUser
      })

      setFilteredData(filtered)
      setLoading(false)
    }, 500) // Simulating API call delay
  }

  useEffect(() => {
    filterData()
  }, [reportType, startDate, endDate, minSales, itemFilter, userFilter])

  const resetFilters = () => {
    setStartDate("")
    setEndDate("")
    setMinSales("")
    setItemFilter("")
    setUserFilter("")
  }

  const generateFullReport = () => {
    // This would typically involve calling an API to generate a full report
    alert("Generating full report... This would typically download a comprehensive PDF report.")
  }

  const exportToCSV = () => {
    // Convert filteredData to CSV
    const headers = Object.keys(filteredData[0]).join(",")
    const csv = [headers, ...filteredData.map((row) => Object.values(row).join(","))].join("\n")

    // Create a Blob with the CSV data
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    // Create a link to download the CSV file
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `${reportType}_report.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderReportTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
    }

    if (filteredData.length === 0) {
      return <p>No data available for the selected filters.</p>
    }

    switch (reportType) {
      case "sales":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Items Sold</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((day, index) => (
                <TableRow key={index}>
                  <TableCell>{day.date}</TableCell>
                  <TableCell>${day.totalSales.toFixed(2)}</TableCell>
                  <TableCell>{day.itemsSold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      case "inventory":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Change Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((change, index) => (
                <TableRow key={index}>
                  <TableCell>{change.date}</TableCell>
                  <TableCell>{change.item}</TableCell>
                  <TableCell>{change.changeType}</TableCell>
                  <TableCell>{change.quantity}</TableCell>
                  <TableCell>{change.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      case "prices":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Old Price</TableHead>
                <TableHead>New Price</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((change, index) => (
                <TableRow key={index}>
                  <TableCell>{change.date}</TableCell>
                  <TableCell>{change.item}</TableCell>
                  <TableCell>${change.oldPrice.toFixed(2)}</TableCell>
                  <TableCell>${change.newPrice.toFixed(2)}</TableCell>
                  <TableCell>{change.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      case "discounts":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((discount, index) => (
                <TableRow key={index}>
                  <TableCell>{discount.date}</TableCell>
                  <TableCell>{discount.item}</TableCell>
                  <TableCell>${discount.discount.toFixed(2)}</TableCell>
                  <TableCell>{discount.reason}</TableCell>
                  <TableCell>{discount.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      case "promotions":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Promotion</TableHead>
                <TableHead>Discounted Amount</TableHead>
                <TableHead>Total Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((promo, index) => (
                <TableRow key={index}>
                  <TableCell>{promo.date}</TableCell>
                  <TableCell>{promo.promotion}</TableCell>
                  <TableCell>${promo.discountedAmount.toFixed(2)}</TableCell>
                  <TableCell>${promo.totalSales.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-semibold">Reports</h2>
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="mb-2 text-lg font-medium">Total Sales (Last 30 days)</h3>
          <p className="text-3xl font-bold">$45,678.90</p>
        </Card>
        <Card className="p-6">
          <h3 className="mb-2 text-lg font-medium">Items Sold (Last 30 days)</h3>
          <p className="text-3xl font-bold">1,234</p>
        </Card>
        <Card className="p-6">
          <h3 className="mb-2 text-lg font-medium">Average Transaction Value</h3>
          <p className="text-3xl font-bold">$37.50</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="mb-2 text-lg font-medium">Report Type</h3>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales Report</SelectItem>
              <SelectItem value="inventory">Inventory Changes</SelectItem>
              <SelectItem value="prices">Price Changes</SelectItem>
              <SelectItem value="discounts">Manual Discounts</SelectItem>
              <SelectItem value="promotions">Promotions</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-4">
          <h3 className="mb-2 text-lg font-medium">Date Range</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-2 text-lg font-medium">Sales Filter</h3>
          <Label htmlFor="min-sales">Minimum Sales</Label>
          <Input
            id="min-sales"
            type="number"
            placeholder="Enter minimum sales"
            value={minSales}
            onChange={(e) => setMinSales(e.target.value)}
          />
        </Card>

        <Card className="p-4">
          <h3 className="mb-2 text-lg font-medium">Item Filter</h3>
          <Label htmlFor="item-filter">Item Name</Label>
          <Input
            id="item-filter"
            type="text"
            placeholder="Enter item name"
            value={itemFilter}
            onChange={(e) => setItemFilter(e.target.value)}
          />
        </Card>

        <Card className="p-4">
          <h3 className="mb-2 text-lg font-medium">User Filter</h3>
          <Label htmlFor="user-filter">User Name</Label>
          <Input
            id="user-filter"
            type="text"
            placeholder="Enter user name"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          />
        </Card>
      </div>

      <div className="flex justify-between mb-6">
        <Button onClick={resetFilters}>Reset Filters</Button>
        <div className="space-x-2">
          <Button onClick={generateFullReport}>Generate Full Report</Button>
          <Button onClick={exportToCSV}>Export to CSV</Button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-2 text-xl font-semibold">
          {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
        </h3>
        {renderReportTable()}
      </div>
    </div>
  )
}

