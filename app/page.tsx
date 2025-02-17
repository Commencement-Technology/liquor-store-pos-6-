"use client"
import { useEffect, useState } from "react"
import supabase from "../lib/supabaseClient"
import ProductList from "../components/ProductList"

export default function POSPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*")

      if (error) {
        console.error("Error fetching products:", error)
      } else {
        setProducts(data)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="container">
      <h1 className="text-xl font-bold">Liquor Store POS</h1>
      <ProductList products={products} />
    </div>
  )
}

