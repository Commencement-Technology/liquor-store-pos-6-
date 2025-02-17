import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SalesChart({ sales }) {
  const dailySales = sales.reduce((acc, sale) => {
    const date = new Date(sale.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + sale.total_price;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(dailySales),
    datasets: [
      {
        label: "Daily Sales ($)",
        data: Object.values(dailySales),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  return (
    <div className="my-4 p-4 border rounded">
      <h2 className="text-lg font-semibold">Sales Chart</h2>
      <Bar data={data} />
    </div>
  );
}

