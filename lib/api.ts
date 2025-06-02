import { IOrder, ITransaction } from "./types";

const API_URL = `/api`;

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

export async function getProductById(id: string) {
  const response = await fetch(`${API_URL}/products?productId=${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
}

export async function createOrder(
  order: Omit<IOrder, "_id" | "status" | "totalAmount" | "createdAt">
) {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    body: JSON.stringify(order),
  });
  return response.json();
}

export async function makePayment(
  transaction: Omit<ITransaction, "_id" | "amount" | "status" | "message">
) {
  console.log("FE Making payment for order: ", transaction);
  const response = await fetch(`${API_URL}/payment`, {
    method: "POST",
    body: JSON.stringify(transaction),
  });
  if (!response.ok) {
    throw new Error("Failed to make payment");
  }
  return response.json();
}

export async function getOrders() {
  const response = await fetch(`${API_URL}/orders`);
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
}

export async function getOrderById(id: string) {
  const response = await fetch(`${API_URL}/orders?orderId=${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }
  return response.json();
}
