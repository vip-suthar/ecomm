import nodemailer from "nodemailer";
import { IOrder, ITransaction } from "./types";
import {
  generateSuccessOrderEmail,
  generateFailedOrderEmail,
} from "./mail-templates";
// Create a transporter using Mailtrap credentials
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
  port: parseInt(process.env.MAILTRAP_PORT || "2525"),
  auth: {
    user: process.env.MAILTRAP_USER || "",
    pass: process.env.MAILTRAP_PASS || "",
  },
});

let isConnected = false;

const connectMailtrap = async () => {
  try {
    if (!isConnected) {
      await transporter.verify();
      console.log("Mailtrap connection successful");
      isConnected = true;
    }
  } catch (error) {
    console.error("Mailtrap connection failed:", error);
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (
  order: IOrder,
  transaction: ITransaction
) => {
  try {
    await connectMailtrap();
    const isSuccess = transaction.status === "success";
    const subject = isSuccess ? "Order Confirmation" : "Order Failed";
    const html = isSuccess
      ? generateSuccessOrderEmail(order, transaction)
      : generateFailedOrderEmail(order, transaction);

    await transporter.sendMail({
      from: process.env.MAIL_FROM || '"E-Commerce Store" <noreply@estore.com>',
      to: order.customerInfo.email || "latejo3684@claspira.com",
      subject,
      html,
    });

    console.log(`Order confirmation email sent to ${order.customerInfo.email}`);
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
};
