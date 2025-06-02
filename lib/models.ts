import mongoose, { Schema, Document } from "mongoose";
import {
  IProduct,
  IInventoryItem,
  IOrder,
  ITransaction,
  EOrderStatus,
  ETransactionStatus,
} from "./types";

// Model Registry
const modelRegistry: { [key: string]: mongoose.Model<any> } = {};

// Product Schema
export interface IProductDocument extends Omit<IProduct, "_id">, Document {}

const ProductSchema = new Schema<IProductDocument>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    rating: {
      rate: { type: Number, required: true },
      count: { type: Number, required: true },
    },
    variants: [{ type: String, required: true }],
    inventoryStatus: {
      type: String,
      enum: ["in_stock", "low_stock", "out_of_stock"],
      required: true,
    },
  },
  { timestamps: true }
);

// Inventory Schema
export interface IInventoryDocument
  extends Omit<IInventoryItem, "_id">,
    Document {}

const InventorySchema = new Schema<IInventoryDocument>(
  {
    // @ts-ignore
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    variant: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    lowStockThreshold: { type: Number, required: true },
  },
  { timestamps: true }
);

// Order Schema
export interface IOrderDocument extends Omit<IOrder, "_id">, Document {}

const OrderSchema = new Schema<IOrderDocument>(
  {
    product: {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      variant: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
    customerInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    status: {
      type: String,
      enum: Object.values(EOrderStatus),
      default: EOrderStatus.PENDING,
      required: true,
    },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

// Transaction Schema
export interface ITransactionDocument
  extends Omit<ITransaction, "_id">,
    Document {}

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    // @ts-ignore
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paymentDetails: {
      cardNumber: { type: String, required: true },
      cardholderName: { type: String, required: true },
      expiryDate: { type: String, required: true },
      cvv: { type: String, required: true },
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(ETransactionStatus),
      default: ETransactionStatus.SUCCESS,
      required: true,
    },
    message: { type: String },
  },
  { timestamps: true }
);

// Model getter functions
const getProductModel = () => {
  if (!modelRegistry.Product) {
    modelRegistry.Product =
      mongoose.models.Product ||
      mongoose.model<IProductDocument>("Product", ProductSchema);
  }
  return modelRegistry.Product;
};

const getInventoryModel = () => {
  if (!modelRegistry.Inventory) {
    modelRegistry.Inventory =
      mongoose.models.Inventory ||
      mongoose.model<IInventoryDocument>("Inventory", InventorySchema);
  }
  return modelRegistry.Inventory;
};

const getOrderModel = () => {
  if (!modelRegistry.Order) {
    modelRegistry.Order =
      mongoose.models.Order ||
      mongoose.model<IOrderDocument>("Order", OrderSchema);
  }
  return modelRegistry.Order;
};

const getTransactionModel = () => {
  if (!modelRegistry.Transaction) {
    modelRegistry.Transaction =
      mongoose.models.Transaction ||
      mongoose.model<ITransactionDocument>("Transaction", TransactionSchema);
  }
  return modelRegistry.Transaction;
};

// Export models
export const Product = getProductModel();
export const Inventory = getInventoryModel();
export const Order = getOrderModel();
export const Transaction = getTransactionModel();
