// Product Types
export interface IProduct {
  _id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  variants?: string[];
  inventoryStatus: "in_stock" | "low_stock" | "out_of_stock";
}

// Order Types
export type TOrderCustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
};

export type TOrderShippingAddress = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type TOrderPaymentDetails = {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
};

export type TSelectedProductDetails = {
  productId: string;
  title: string;
  price: number;
  image: string;
  variant?: string;
  quantity: number;
};

export enum EOrderStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

export interface IOrder {
  _id: string;
  product: TSelectedProductDetails;
  customerInfo: TOrderCustomerInfo;
  shippingAddress: TOrderShippingAddress;
  status: EOrderStatus;
  totalAmount: number;
  createdAt: Date;
}

// Transaction Types
export enum ETransactionStatus {
  SUCCESS = "success",
  FAILED = "failed",
}

export interface ITransaction {
  _id: string;
  orderId: string;
  amount: number;
  paymentDetails: TOrderPaymentDetails;
  status: ETransactionStatus;
  message?: string;
}

// Inventory Types
export interface IInventoryItem {
  _id: string;
  productId: string;
  variant: string;
  quantity: number;
  lastUpdated: Date;
  lowStockThreshold: number;
}

export type TInventoryUpdate = {
  productId: string;
  quantity: number;
  operation: "add" | "remove" | "set";
};
