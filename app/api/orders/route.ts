import { NextResponse } from "next/server";
import { createOrder, getOrderById, getOrders } from "@/lib/db-service";
import { connectDB } from "@/lib/db-service";
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const order = await createOrder(body);
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process order",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      const orders = await getOrders();
      return NextResponse.json(orders, { status: 200 });
    } else {
      const order = await getOrderById(orderId);
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json(order, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
