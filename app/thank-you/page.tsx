"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { EOrderStatus, IOrder, IProduct } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { formatDate, generateTrackingNumber } from "@/lib/utils";
import {
  CheckCircle,
  ChevronRight,
  ClipboardCopy,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { getOrderById } from "@/lib/api";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackingNumber] = useState(generateTrackingNumber());

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }
    getOrderById(orderId)
      .then((order) => {
        setOrder(order);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  const handleCopyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      toast.success("Order ID copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold">Loading order details...</h1>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-8">
          {error || "Could not find the requested order"}
        </p>
        <Button asChild>
          <Link href="/">Return to Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
        <p className="text-muted-foreground">
          Order #{order._id} has been placed successfully
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order Details</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyOrderId}
                  title="Copy Order ID"
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Order Number</p>
                  <p className="font-medium">{order._id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {formatDate(new Date(order.createdAt))}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Status</p>
                  <p className="font-medium flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    {order.status === EOrderStatus.SUCCESS
                      ? "Paid"
                      : "Processing"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tracking Number</p>
                  <p className="font-medium">{trackingNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="relative h-20 w-20 rounded overflow-hidden bg-secondary/20 flex-shrink-0">
                  <Image
                    src={order.product.image}
                    alt={order.product.title}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{order.product.title}</h4>
                  <div className="mt-1 text-sm text-muted-foreground space-y-1">
                    {order.product.variant && (
                      <p>Variant: {order.product.variant}</p>
                    )}
                    <p>Quantity: {order.product.quantity}</p>
                  </div>
                </div>
                <div className="font-medium">
                  {formatCurrency(order.totalAmount)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Track Your Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-6 top-0 h-full w-0.5 bg-primary/20"></div>

                <div className="relative flex mb-8">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="ml-4 flex flex-col justify-center">
                    <h4 className="font-medium">Order Created</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(new Date(order.createdAt))}
                    </p>
                  </div>
                </div>

                <div className="relative flex mb-8">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="ml-4 flex flex-col justify-center">
                    <h4 className="font-medium">Payment Completed</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(new Date(order.createdAt))}
                    </p>
                  </div>
                </div>

                <div className="relative flex">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="ml-4 flex flex-col justify-center">
                    <h4 className="font-medium">Successfully Completed</h4>
                    <p className="text-sm text-muted-foreground">
                      Your order is completed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button variant="outline" className="w-full">
                  <span>Track Order</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">
                    Contact Information
                  </h4>
                  <p className="text-sm">{order.customerInfo.fullName}</p>
                  <p className="text-sm">{order.customerInfo.email}</p>
                  <p className="text-sm">{order.customerInfo.phone}</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">Shipping Address</h4>
                  <p className="text-sm">{order.shippingAddress.street}</p>
                  <p className="text-sm">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-sm">{order.shippingAddress.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button asChild className="w-full">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
