'use client';
// ============================================================
// hooks/useCart.ts — Cart state & actions via ShopContext
// Usage: const { cart, addToCart, removeFromCart } = useCart()
// ============================================================
import { useShop } from '../lib/context/ShopContext';

export function useCart() {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
  } = useShop();

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
  };
}
