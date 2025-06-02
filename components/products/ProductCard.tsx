import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { IProduct } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const getInventoryStatusColor = (inventoryStatus: string) => {
    if (inventoryStatus === "out_of_stock") return "bg-red-500";
    if (inventoryStatus === "low_stock") return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Link href={`/products/${product._id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="relative aspect-square bg-secondary/20 rounded-lg overflow-hidden mb-4">
            {product.image && (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline">
              {product.category}
            </Badge>
            <Badge className={getInventoryStatusColor(product.inventoryStatus)}>
              {product.inventoryStatus}
            </Badge>
          </div>
          <h3 className="font-semibold line-clamp-2 mb-2">{product.title}</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating.rate)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.rating.count})
            </span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
        </CardFooter>
      </Card>
    </Link>
  );
} 