import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ETransactionStatus, TSelectedProductDetails, IProduct } from "./types";
import { faker } from "@faker-js/faker";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Local storage utils for cart
export function saveCartToLocalStorage(cart: TSelectedProductDetails[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

export function getCartFromLocalStorage(): TSelectedProductDetails[] {
  if (typeof window !== "undefined") {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }
  return [];
}

// TODO: Add tax and shipping to the totals
// Calculate order totals
export function calculateOrderTotals(cart: TSelectedProductDetails[]) {
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.0825; // 8.25% tax rate
  const shipping = subtotal > 100 ? 0 : 12.99; // Free shipping over $100
  const total = subtotal + tax + shipping;

  return {
    subtotal,
    tax,
    shipping,
    total,
  };
}

// Generate a tracking number
export function generateTrackingNumber(): string {
  return "TRK" + Math.random().toString().substring(2, 12);
}

// Format date for display
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// This function creates a delay for simulating API calls
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper function to generate mock variants based on category
export function generateMockVariants(): string[] {
  return Array.from(
    { length: faker.number.int({ min: 1, max: 5 }) },
    (_, i) => `variant-${i + 1}`
  );
}

export const getTransactionStatus = (): ETransactionStatus => {
  const random = Math.random();
  // 75% success, 25% failed
  if (random < 0.75) return ETransactionStatus.SUCCESS;
  return ETransactionStatus.FAILED;
};

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
