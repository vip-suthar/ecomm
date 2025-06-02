"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { IProduct, TSelectedProductDetails } from "@/lib/types";
import { saveCartToLocalStorage, getCartFromLocalStorage } from "@/lib/utils";

interface CartContextType {
  cart: TSelectedProductDetails[];
  addToCart: (
    product: IProduct,
    quantity: number,
    selectedVariant: string
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<TSelectedProductDetails[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize cart from localStorage
  useEffect(() => {
    const savedCart = getCartFromLocalStorage();
    if (savedCart.length > 0) {
      setCart(savedCart);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      saveCartToLocalStorage(cart);
    }
  }, [cart, isInitialized]);

  const addToCart = (
    product: IProduct,
    quantity: number,
    selectedVariant: string
  ) => {
    setCart((prevCart) => {
      // Check if product is already in cart
      const existingItemIndex = prevCart.findIndex(
        (item) => item.productId === product._id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if product exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        updatedCart[existingItemIndex].variant = selectedVariant;
        return updatedCart;
      } else {
        // Add new item if product doesn't exist
        // add only 1 item for now
        return [
          // ...prevCart,
          {
            productId: product._id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity,
            variant: selectedVariant,
          },
        ];
      }
    });

    // Show cart when adding items
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
