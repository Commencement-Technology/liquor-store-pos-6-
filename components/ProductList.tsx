import React from "react";
import supabase from "../lib/supabaseClient";
import { handleSale } from "../utils/inventoryHelpers";

export default function ProductList({ products }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <div key={product.id} className="p-4 border rounded">
          <h3 className="font-bold">{product.name}</h3>
          <p>Price per Bottle: ${product.price}</p>
          <p>Price per Case: ${product.case_cost} ({product.units_per_case} bottles)</p>
          <p>Stock: {product.qty_on_hand_items} bottles / {product.qty_on_hand_cases} cases</p>

          <button
            className="bg-blue-500 text-white p-2 mt-2"
            onClick={() => handleSale(product.id, 1, false)}
          >
            Sell Bottle
          </button>
          <button
            className="bg-green-500 text-white p-2 mt-2"
            onClick={() => handleSale(product.id, 1, true)}
          >
            Sell Case
          </button>
        </div>
      ))}
    </div>
  );
}

