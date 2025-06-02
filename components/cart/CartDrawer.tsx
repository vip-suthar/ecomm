"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { calculateOrderTotals } from "@/lib/utils";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/lib/types";
import { getProductById } from "@/lib/api";

export function CartDrawer() {
  const { cart, isCartOpen, toggleCart, updateQuantity, removeFromCart } =
    useCart();
  const [product, setProduct] = useState<IProduct | null>(null);
  const { subtotal, tax, shipping, total } = calculateOrderTotals(cart);

  useEffect(() => {
    if (cart.length === 0) return;
    getProductById(cart[0].productId).then((product) => {
      setProduct(product);
    });
  }, [cart]);

  if (!product) return null;

  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="pb-4">
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow py-8">
            <p className="text-muted-foreground mb-6">Your cart is empty</p>
            <SheetClose asChild>
              <Button variant="outline">Continue Shopping</Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-grow pr-4">
              {cart.map((item) => (
                <div key={item.productId} className="py-4">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden bg-secondary">
                      <Image
                        src={product?.image}
                        alt={product?.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {product.title}
                      </h4>

                      {/* Variant */}
                      <div className="mt-1 space-y-1">{item.variant}</div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                          >
                            <MinusIcon className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                Math.min(10, item.quantity + 1)
                              )
                            }
                          >
                            <PlusIcon className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="font-medium">
                          {formatCurrency(product.price * item.quantity)}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </ScrollArea>

            <div className="pt-4 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : formatCurrency(shipping)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
