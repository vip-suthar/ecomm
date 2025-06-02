"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import { IProduct } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const { toast } = useToast();
  useEffect(() => {
    getProducts()
      .then((products) => {
        setProducts(products);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Failed to fetch products",
          description: "Please try again later",
          variant: "destructive",
        });
      });
  }, []);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: IProduct) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
