import { faker } from "@faker-js/faker";
import { Product, Inventory, Order, Transaction } from "./models";
import { EOrderStatus, ETransactionStatus } from "./types";
import { calculateOrderTotals, generateMockVariants } from "./utils";
import { connectDB } from "./db-service";

// Fetch products from FakeStore API
const generateProductsData = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();

    const productsWithVariants = products.map((product: any) => ({
      ...product,
      variants: generateMockVariants(),
      inventoryStatus: "in_stock",
    }));

    const createdProducts = await Product.insertMany(productsWithVariants);
    console.log(`Created ${createdProducts.length} products`);
    return createdProducts.map((product) => product.toObject());
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Generate random inventory data
const generateInventoryData = async (products: any[]) => {
  try {
    const createdInventory = await Inventory.insertMany(
      products.flatMap((product: any) =>
        product.variants.map((variant: string) => ({
          productId: product._id,
          variant: variant,
          quantity: faker.number.int({ min: 6, max: 100 }),
          lastUpdated: new Date(),
          lowStockThreshold: faker.number.int({ min: 5, max: 20 }),
        }))
      )
    );
    console.log(`Created ${createdInventory.length} inventory items`);
    return createdInventory.map((inventory) => inventory.toObject());
  } catch (error) {
    console.error("Error fetching inventory:", error);
  }
};

// Generate random order data
const generateOrdersData = async (products: any[]) => {
  try {
    const orders = faker.helpers
      .arrayElements(products, { min: 1, max: products.length })
      .map((product: any) => {
        const orderQuantity = faker.number.int({ min: 1, max: 5 });
        const variant = faker.helpers.arrayElement(product.variants);
        return {
          product: {
            productId: product._id,
            title: product.title,
            price: product.price,
            image: product.image,
            variant,
            quantity: orderQuantity,
          },
          customerInfo: {
            fullName: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
          },
          shippingAddress: {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            country: faker.location.country(),
          },
          status: faker.helpers.arrayElement(Object.values(EOrderStatus)),
          totalAmount: calculateOrderTotals([product]),
        };
      });
    const createdOrders = await Order.insertMany(orders);
    console.log(`Created ${createdOrders.length} orders`);
    return createdOrders.map((order) => order.toObject());
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

// Generate random transaction data
const generateTransactionData = async (orders: any[]) => {
  const transactions = orders.map((order) => ({
    orderId: order._id,
    amount: order.totalAmount,
    status: faker.helpers.arrayElement(Object.values(ETransactionStatus)),
    paymentDetails: {
      cardNumber: faker.finance.creditCardNumber(),
      cardholderName: faker.person.fullName(),
      expiryDate: faker.date.future().toISOString().slice(0, 7),
      cvv: faker.finance.creditCardCVV(),
    },
    message: faker.helpers.maybe(() => faker.lorem.sentence()),
  }));
  const createdTransactions = await Transaction.insertMany(transactions);
  console.log(`Created ${createdTransactions.length} transactions`);
  return createdTransactions.map((transaction) => transaction.toObject());
};

// Main seeding function
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await Promise.all([
      Product.deleteMany({}),
      Inventory.deleteMany({}),
      Order.deleteMany({}),
      Transaction.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    // seed products data
    const createdProducts = await generateProductsData();
    if (!createdProducts) {
      throw new Error("Failed to create products");
    }

    // seed inventory data
    const inventoryData = await generateInventoryData(createdProducts);

    const createdOrders = await generateOrdersData(createdProducts);
    if (!createdOrders) {
      throw new Error("Failed to create orders");
    }

    const createdTransactions = await generateTransactionData(createdOrders);

    console.log("Seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seeding script
seedDatabase();
