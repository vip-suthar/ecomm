import { Metadata } from "next";
import OrdersTable from "@/components/orders/OrdersTable";

export const metadata: Metadata = {
  title: "Order History | Your Store",
  description: "View your complete order history",
};

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      <OrdersTable />
    </div>
  );
} 