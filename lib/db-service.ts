import mongoose from "mongoose";
import { Inventory, Order, Product, Transaction } from "./models";
import {
  EOrderStatus,
  ETransactionStatus,
  IOrder,
  ITransaction,
} from "./types";
import { calculateOrderTotals, getTransactionStatus } from "./utils";

const mongoURI = process.env.MONGODB_URI;

export const connectDB = async () => {
  if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined");
  }
  const existingConnection = mongoose.connection.readyState;
  if (existingConnection === 1) {
    console.log("Already connected to MongoDB");
    return;
  }
  console.log("Connecting to MongoDB...");
  await mongoose.connect(mongoURI);
  console.log("Connected to MongoDB");
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};

export const getProducts = async () => {
  const products = await Product.find();
  return products;
};

export const getProductById = async (id: string) => {
  const product = await Product.findById(id);
  return product;
};

export const updateInventoryStatus = async (productId: string) => {
  const product = await Product.findByIdAndUpdate(productId, {
    $set: {
      inventoryStatus: getInventoryStatus(productId),
    },
  });
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

export const getOrders = async () => {
  const orders = await Order.find();
  return orders;
};

export const getOrderById = async (id: string) => {
  const order = await Order.findById(id);
  return order;
};

export const createOrder = async (
  order: Omit<IOrder, "_id" | "status" | "totalAmount" | "createdAt">
) => {
  const session = await mongoose.startSession();
  try {
    const product = await Product.findById(order.product.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    let newOrder: IOrder | undefined;

    await session.withTransaction(async () => {
      const inventory = await getInventory(
        order.product.productId,
        order.product.variant
      );
      if (inventory.quantity < order.product.quantity) {
        throw new Error("Insufficient inventory");
      }
      const createdOrder = await Order.create({
        ...order,
        status: EOrderStatus.PENDING,
        totalAmount: calculateOrderTotals([order.product]),
        createdAt: new Date(),
      });
      newOrder = createdOrder.toObject() as IOrder;
      await updateInventory(
        order.product.productId,
        order.product.quantity,
        order.product.variant
      );
      await updateInventoryStatus(order.product.productId);
    });

    if (!newOrder) {
      throw new Error("Failed to create order");
    }

    return newOrder;
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getInventory = async (productId: string, variant?: string) => {
  const inventory = await Inventory.findOne({ productId, variant });
  if (!inventory) {
    throw new Error("Inventory not found");
  }
  return inventory;
};

export const updateInventory = async (
  productId: string,
  quantity: number,
  variant?: string
) => {
  const product = await Inventory.findOne({ productId, variant });
  if (!product) {
    throw new Error("Product not found");
  }
  product.quantity -= quantity;
  await product.save();
};

export const getInventoryStatus = async (productId: string) => {
  const product = await Inventory.findOne({ productId });
  if (!product) {
    throw new Error("Product not found");
  }
  return product.quantity <= product.lowStockThreshold
    ? "low_stock"
    : product.quantity > 0
    ? "in_stock"
    : "out_of_stock";
};

export const makePayment = async (
  paymentInfo: Omit<ITransaction, "_id" | "amount" | "status" | "message">
) => {
  // TODO: make payment status random
  const session = await mongoose.startSession();
  try {
    let transaction: ITransaction | undefined;
    await session.withTransaction(async () => {
      const order = await Order.findById(paymentInfo.orderId);
      if (!order) {
        throw new Error("Order not found");
      }

      const createdTransaction = await Transaction.create({
        ...paymentInfo,
        amount: order.totalAmount,
        status: getTransactionStatus(),
        createdAt: new Date(),
      });

      transaction = createdTransaction.toObject() as ITransaction;

      if (transaction.status === ETransactionStatus.FAILED) {
        await updateInventory(
          order.product.productId,
          order.product.quantity,
          order.product.variant
        );
        await updateInventoryStatus(order.product.productId);

        order.status = EOrderStatus.FAILED;
      } else {
        order.status = EOrderStatus.SUCCESS;
      }
      await order.save();
    });

    if (!transaction) {
      throw new Error("Failed to create transaction");
    }

    return transaction;
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getTransaction = async (transactionId: string) => {
  const transaction = await Transaction.findById(transactionId).select("-__v");
  if (!transaction) {
    throw new Error("Transaction not found");
  }
  return transaction;
};

export const hasAlreadyPaid = async (orderId: string) => {
  const transaction = await Transaction.findOne({
    orderId,
    status: ETransactionStatus.SUCCESS,
  });
  return transaction ? true : false;
};
