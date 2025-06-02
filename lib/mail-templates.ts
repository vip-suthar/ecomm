import { IOrder, ITransaction } from "./types";
import { formatCurrency } from "./utils";
import { formatDate } from "./utils";

// Generate successful order email template
export const generateSuccessOrderEmail = (
  order: IOrder,
  transaction: ITransaction
) => {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .order-details { background-color: #f9f9f9; padding: 15px; margin: 15px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmation</h1>
            </div>
            <div class="content">
              <p>Dear ${order.customerInfo.fullName},</p>
              <p>Thank you for your order! We're pleased to confirm that your order has been successfully placed and payment has been processed.</p>
              
              <div class="order-details">
                <h2>Order Details</h2>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Order Date:</strong> ${formatDate(
                  order.createdAt
                )}</p>
                <p><strong>Total Amount:</strong> ${formatCurrency(
                  order.totalAmount
                )}</p>
                <p><strong>Payment Status:</strong> ${transaction.status}</p>
                
                <h3>Product Details</h3>
                <p><strong>Product:</strong> ${order.product.title}</p>
                <p><strong>Quantity:</strong> ${order.product.quantity}</p>
                <p><strong>Variant:</strong> ${order.product.variant}</p>
              </div>
  
              <div class="order-details">
                <h2>Shipping Information</h2>
                <p><strong>Address:</strong> ${order.shippingAddress.street}</p>
                <p><strong>City:</strong> ${order.shippingAddress.city}</p>
                <p><strong>State:</strong> ${order.shippingAddress.state}</p>
                <p><strong>ZIP Code:</strong> ${
                  order.shippingAddress.zipCode
                }</p>
                <p><strong>Country:</strong> ${
                  order.shippingAddress.country
                }</p>
              </div>
  
              <p>We'll notify you when your order ships. If you have any questions, please don't hesitate to contact our customer service team.</p>
              
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${
    order._id
  }" class="button">View Order Status</a>
              </p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
};

// Generate failed order email template
export const generateFailedOrderEmail = (
  order: IOrder,
  transaction: ITransaction
) => {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .order-details { background-color: #f9f9f9; padding: 15px; margin: 15px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background-color: #f44336; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Failed</h1>
            </div>
            <div class="content">
              <p>Dear ${order.customerInfo.fullName},</p>
              <p>We're sorry to inform you that your order could not be processed at this time. The payment transaction was unsuccessful.</p>
              
              <div class="order-details">
                <h2>Order Details</h2>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Order Date:</strong> ${formatDate(
                  order.createdAt
                )}</p>
                <p><strong>Total Amount:</strong> ${formatCurrency(
                  order.totalAmount
                )}</p>
                <p><strong>Payment Status:</strong> ${transaction.status}</p>
                <p><strong>Error Message:</strong> ${
                  transaction.message || "Payment processing failed"
                }</p>
                
                <h3>Product Details</h3>
                <p><strong>Product Id:</strong> ${order.product.title}</p>
                <p><strong>Quantity:</strong> ${order.product.quantity}</p>
                <p><strong>Variant:</strong> ${order.product.variant}</p>
              </div>
  
              <p>To resolve this issue, you can:</p>
              <ul>
                <li>Try placing the order again with a different payment method</li>
                <li>Contact our customer service team for assistance</li>
                <li>Check if your payment method has sufficient funds</li>
              </ul>
  
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${
    order._id
  }" class="button">View Order Details</a>
              </p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>If you need assistance, please contact our customer service team.</p>
            </div>
          </div>
        </body>
      </html>
    `;
};
