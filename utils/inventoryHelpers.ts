import supabase from "../lib/supabaseClient";

export const handleSale = async (productId, quantity, isCaseSale) => {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("qty_on_hand_items, qty_on_hand_cases, units_per_case, price")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    console.error("Product not found:", productError);
    return;
  }

  let newQtyItems = product.qty_on_hand_items;
  let newQtyCases = product.qty_on_hand_cases;

  if (isCaseSale) {
    if (newQtyCases < quantity) {
      alert("Not enough cases in stock!");
      return;
    }
    newQtyCases -= quantity;
  } else {
    if (newQtyItems < quantity) {
      if (newQtyCases > 0) {
        newQtyCases -= 1;
        newQtyItems += product.units_per_case;
      } else {
        alert("Not enough stock!");
        return;
      }
    }
    newQtyItems -= quantity;
  }

  const { error: stockError } = await supabase
    .from("products")
    .update({
      qty_on_hand_items: newQtyItems,
      qty_on_hand_cases: newQtyCases,
    })
    .eq("id", productId);

  if (stockError) {
    console.error("Error updating stock:", stockError);
    return;
  }

  alert(`Sale completed! ${isCaseSale ? "Case" : "Bottle"} sold.`);
};

