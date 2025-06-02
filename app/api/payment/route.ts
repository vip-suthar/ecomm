import {
  connectDB,
  getOrderById,
  getTransaction,
  hasAlreadyPaid,
  makePayment,
} from "@/lib/db-service";
import { ETransactionStatus } from "@/lib/types";
import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/mail-service";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transactionId");
    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }
    const transaction = await getTransaction(transactionId);
    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const paymentInfo = body;
    console.log("Making payment for order", paymentInfo);
    if (!paymentInfo.orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    if (!paymentInfo.paymentDetails) {
      return NextResponse.json(
        { error: "Payment details are required" },
        { status: 400 }
      );
    }

    const isOrderPaid = await hasAlreadyPaid(paymentInfo.orderId);
    if (isOrderPaid) {
      return NextResponse.json(
        { error: "Order already paid" },
        { status: 400 }
      );
    }

    const random = Math.random();
    // 10% chance of gateway failure
    if (random < 0.1) {
      return NextResponse.json(
        { error: "Payment gateway failed" },
        { status: 500 }
      );
    }

    const transaction = await makePayment(paymentInfo);
    const order = await getOrderById(paymentInfo.orderId);
    try {
      sendOrderConfirmationEmail(order, transaction);
    } catch (error) {
      console.error("Error sending order confirmation email:", error);
    }
    if (transaction.status === ETransactionStatus.SUCCESS) {
      return NextResponse.json(transaction, { status: 200 });
    } else {
      return NextResponse.json({ error: "Payment failed" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
