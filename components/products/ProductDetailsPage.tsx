"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getProductById } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StarIcon, MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { IProduct } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function ProductPage({ productId }: { productId: string }) {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    getProductById(productId).then((product) => {
      setProduct(product);
      setSelectedVariant(product.variants?.[0] || null);
    });
  }, []);

  const handleQuantityChange = (increment: number) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + increment));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addToCart(product, quantity, selectedVariant);
  };

  if (!product) return null;
  return (
    <div className="grid md:grid-cols-2 gap-8 py-10">
      <div className="relative aspect-square bg-secondary/20 rounded-lg overflow-hidden">
        {product.image && (
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}
      </div>

      <div className="flex flex-col">
        <div>
          <Badge variant="outline" className="mb-2">
            {product.category}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating.rate)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating.rate} ({product.rating.count} reviews)
            </span>
          </div>

          <div className="mt-6">
            <h2 className="text-3xl font-bold">
              {formatCurrency(product.price)}
            </h2>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {/* Variant selector */}
          <div>
            <label className="text-sm font-medium leading-none mb-2 block">
              Variant
            </label>
            <Select
              value={selectedVariant || ""}
              onValueChange={(value) => setSelectedVariant(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>
              <SelectContent>
                {product.variants?.map((variant) => (
                  <SelectItem key={variant} value={variant}>
                    {variant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity selector */}
          <div>
            <label className="text-sm font-medium leading-none mb-2 block">
              Quantity
            </label>
            <div className="flex items-center w-32 border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="flex-1 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to cart button */}
          <Button size="lg" className="w-full mt-8" onClick={handleAddToCart}>
            <ShoppingCartIcon className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>

          {/* Product description */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="font-medium mb-2">Product Description</h3>
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
