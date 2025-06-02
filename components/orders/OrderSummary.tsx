"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TSelectedProductDetails } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { calculateOrderTotals } from "@/lib/utils";
import Image from "next/image";

interface OrderSummaryProps {
  cart: TSelectedProductDetails[];
}

export function OrderSummary({ cart }: OrderSummaryProps) {
  const { subtotal, tax, shipping, total } = calculateOrderTotals(cart);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart items */}
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.productId} className="flex items-start space-x-4">
              <div className="relative h-16 w-16 rounded overflow-hidden bg-secondary/20 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium line-clamp-1">
                  {item.title}
                </h4>
                <div className="mt-1 text-xs text-muted-foreground space-y-1">
                  {item.variant && <p>Variant: {item.variant}</p>}
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
              <div className="text-sm font-medium">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Order calculations */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
