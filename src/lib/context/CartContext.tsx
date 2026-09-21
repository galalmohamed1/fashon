/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useSession } from "next-auth/react";
import { getLoggedUserCart } from "@/actions/cart.actions";


type CartContextType = {
  numOfCartItems: number;
  setnumOfCartItems: React.Dispatch<React.SetStateAction<number>>;
  refreshCart: () => Promise<void>;
  updateCartCount: (delta: number) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

export default function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  const [numOfCartItems, setnumOfCartItems] = useState(0);

  const refreshCart = useCallback(async () => {
    try {
      const res = await getLoggedUserCart();

      if (res?.status === "success" && Array.isArray(res.data?.products)) {
        const totalItems = res.data.products.reduce(
          (
            total: number,
            product: {
              quantity?: number;
            }
          ) => total + (product.quantity ?? 0),
          0
        );

        setnumOfCartItems(totalItems);
      } else {
        setnumOfCartItems(0);
      }
    } catch (error) {
      console.error(
        "Failed to get cart count:",
        error instanceof Error ? error.message : error
      );

      setnumOfCartItems(0);
    }
  }, []);

  /** Optimistically update the cart badge count by a delta (+1 or -1) */
  const updateCartCount = (delta: number) => {
    setnumOfCartItems((prev) => Math.max(0, prev + delta));
  };

  useEffect(() => {
    if (status === "authenticated") {
      refreshCart();
    }

    if (status === "unauthenticated") {
      setnumOfCartItems(0);
    }
  }, [status, refreshCart]);

  return (
    <CartContext.Provider
      value={{
        numOfCartItems,
        setnumOfCartItems,
        refreshCart,
        updateCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}