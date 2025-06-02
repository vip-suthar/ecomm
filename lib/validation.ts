import { z } from "zod";

// Customer Information Validation Schema
export const customerSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, { 
      message: "Phone number must be in E.164 format (e.g., +12125551234)" 
    }),
});

// Address Validation Schema
export const addressSchema = z.object({
  street: z
    .string()
    .min(5, { message: "Street address must be at least 5 characters" })
    .max(100, { message: "Street address must be less than 100 characters" }),
  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters" })
    .max(50, { message: "City must be less than 50 characters" }),
  state: z
    .string()
    .min(2, { message: "State must be at least 2 characters" })
    .max(50, { message: "State must be less than 50 characters" }),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, { 
      message: "Zip code must be in the format 12345 or 12345-6789" 
    }),
  country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters" })
    .max(50, { message: "Country must be less than 50 characters" }),
});

// Payment Validation Schema
export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^[0-9]{16}$/, { 
      message: "Card number must be 16 digits without spaces" 
    }),
  cardholderName: z
    .string()
    .min(2, { message: "Cardholder name must be at least 2 characters" })
    .max(50, { message: "Cardholder name must be less than 50 characters" }),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([2-9][0-9])$/, { 
      message: "Expiry date must be in MM/YY format" 
    })
    .refine((date) => {
      const [month, year] = date.split('/').map(Number);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (year > currentYear) return true;
      if (year === currentYear && month >= currentMonth) return true;
      return false;
    }, {
      message: "Expiry date must be in the future"
    }),
  cvv: z
    .string()
    .regex(/^[0-9]{3,4}$/, { 
      message: "CVV must be 3 or 4 digits" 
    }),
});

// Complete Checkout Form Validation Schema
export const checkoutFormSchema = z.object({
  customer: customerSchema,
  address: addressSchema,
  payment: paymentSchema,
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;