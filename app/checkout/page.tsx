"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/orders/OrderSummary";
import { CheckoutFormValues } from "@/lib/validation";
import { toast } from "sonner";
import { createOrder, makePayment } from "@/lib/api";
import { ETransactionStatus } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState<
    "success" | "failed" | undefined
  >();
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleSubmit = async (data: CheckoutFormValues) => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setIsSubmitting(true);

    try {
      const order = await createOrder({
        customerInfo: data.customer,
        shippingAddress: data.address,
        product: cart[0],
      });

      console.log("Order created: ", order);

      const payment = await makePayment({
        orderId: order._id,
        paymentDetails: data.payment,
      });

      console.log("Payment: ", payment);

      if (payment.status === ETransactionStatus.SUCCESS) {
        setOrderStatus("success");
        setOrderId(order._id);
        clearCart();
        setTimeout(() => {
          router.push(`/thank-you?orderId=${order._id}`);
        }, 2000);
      } else {
        setOrderStatus("failed");
        toast.error("Failed to process payment. Please try again.");
      }
    } catch (error) {
      setOrderStatus("failed");
      toast.error(
        (error as Error).message ||
          "An unexpected error occurred. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnimationComplete = () => {
    if (orderStatus === "success" && orderId) {
      router.push(`/thank-you?orderId=${orderId}`);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
      {cart.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="mb-6">
              <ShoppingCart className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some items to your cart to proceed with checkout.
            </p>
            <Button variant="outline" onClick={() => router.push("/")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <CheckoutForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              orderStatus={orderStatus}
              onAnimationComplete={handleAnimationComplete}
            />
          </div>
          <div>
            <OrderSummary cart={cart} />
          </div>
        </div>
      )}
    </div>
  );
}
