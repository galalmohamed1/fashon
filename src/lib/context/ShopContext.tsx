'use client';
import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Product, CartItem, ProductColor, FilterState, ToastMessage, PageView, Category } from '../../types';
import { PRODUCTS } from '../data/products';


interface ShopContextType {
  // Navigation & Page State
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  selectedProductId: string | null;
  openProductDetail: (productId: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, color: ProductColor, size: string, quantity?: number, customDesign?: 'kiikii-cat' | 'threadx-logo' | 'minimal-logo' | 'no-logo', customColorHex?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Modals & Drawers
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Helper product queries
  products: Product[];
  getProductById: (id: string) => Product | undefined;
}

const initialFilters: FilterState = {
  category: 'all',
  minPrice: 0,
  maxPrice: 300,
  sizes: [],
  colors: [],
  collection: 'all',
  sortBy: 'featured',
  searchQuery: '',
  onlyInStock: false
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  // Navigation State
  const [activePage, setActivePage] = useState<PageView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('tx-tee-01');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filters
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Cart State (Persisted in localStorage with safe SSR fallback)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('threadx_cart');
        return saved ? JSON.parse(saved) : [];
      }
    } catch {
      return [];
    }
    return [];
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('threadx_wishlist');
        return saved ? JSON.parse(saved) : ['tx-tee-01', 'tx-jacket-01'];
      }
    } catch {
      return ['tx-tee-01', 'tx-jacket-01'];
    }
    return ['tx-tee-01', 'tx-jacket-01'];
  });

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('threadx_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('threadx_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Toast handlers
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Open Product Detail
  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    router.push(`/product/${productId}`);
  };

  // Add To Cart
  const addToCart = (
    product: Product,
    color: ProductColor,
    size: string,
    quantity = 1,
    customDesign?: 'kiikii-cat' | 'threadx-logo' | 'minimal-logo' | 'no-logo',
    customColorHex?: string
  ) => {
    const itemId = `${product.id}-${color.name}-${size}-${customDesign || 'default'}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }
      return [
        ...prevCart,
        {
          id: itemId,
          product,
          selectedColor: customColorHex ? { ...color, hex: customColorHex } : color,
          selectedSize: size,
          quantity,
          customDesign,
          customColorHex
        }
      ];
    });

    addToast({
      title: 'Added to Bag',
      message: `${product.name} (${size} / ${color.name})`,
      type: 'cart',
      image: product.image
    });
  };

  // Remove from Cart
  const removeFromCart = (itemId: string) => {
    const item = cart.find((i) => i.id === itemId);
    setCart((prev) => prev.filter((i) => i.id !== itemId));
    if (item) {
      addToast({
        title: 'Removed from Bag',
        message: `${item.product.name}`,
        type: 'info'
      });
    }
  };

  // Update Quantity
  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Clear Cart
  const clearCart = () => {
    setCart([]);
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    const wasWishlisted = wishlist.includes(productId);

    if (wasWishlisted) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      addToast({
        title: 'Removed from Wishlist',
        message: product ? product.name : undefined,
        type: 'info'
      });
    } else {
      setWishlist((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
      addToast({
        title: 'Saved to Wishlist',
        message: product ? product.name : undefined,
        type: 'success',
        image: product?.image
      });
    }
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Cart Metrics
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const getProductById = (id: string) => {
    return PRODUCTS.find((p) => p.id === id);
  };

  return (
    <ShopContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedProductId,
        openProductDetail,
        selectedCategory,
        setSelectedCategory,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        isSearchOpen,
        setIsSearchOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        quickViewProduct,
        setQuickViewProduct,
        filters,
        setFilters,
        resetFilters,
        toasts,
        addToast,
        removeToast,
        products: PRODUCTS,
        getProductById
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
