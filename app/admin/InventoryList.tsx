import React from "react";

export default function InventoryList({ inventory }) {
  return (
    <div className="my-4 p-4 border rounded">
      <h2 className="text-lg font-semibold">Inventory Status</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Product</th>
            <th className="border p-2">Stock (Bottles)</th>
            <th className="border p-2">Stock (Cases)</th>
            <th className="border p-2">Restock Needed?</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((product) => (
            <tr key={product.id} className="text-center">
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.qty_on_hand_items}</td>
              <td className="border p-2">{product.qty_on_hand_cases}</td>
              <td className="border p-2">
                {product.qty_on_hand_items < 10 ? "⚠️ Yes" : "✅ No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

