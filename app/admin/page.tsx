"use client";
import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
import SalesChart from "./SalesChart";
import InventoryList from "./InventoryList";

export default function AdminDashboard() {
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    async function fetchData() {
      // Fetch Sales Data
      const { data: salesData, error: salesError } = await supabase
        .from("transactions")
        .select("*");

      if (!salesError) {
        setSales(salesData);
        const revenue = salesData.reduce((acc, sale) => acc + sale.total_price, 0);
        const profit = salesData.reduce((acc, sale) => acc + (sale.total_price - sale.product_cost), 0);
        setTotalRevenue(revenue);
        setTotalProfit(profit);
      }

      // Fetch Inventory Data
      const { data: inventoryData, error: inventoryError } = await supabase
        .from("products")
        .select("*");

      if (!inventoryError) setInventory(inventoryData);
    }

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold">Total Profit</h2>
          <p className="text-2xl font-bold">${totalProfit.toFixed(2)}</p>
        </div>
      </div>

      <SalesChart sales={sales} />
      <InventoryList inventory={inventory} />
    </div>
  );
}

