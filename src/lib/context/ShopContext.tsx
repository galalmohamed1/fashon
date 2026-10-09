"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { triggerRouteLoading } from "@/components/ui/RouteTransitionLoader";

import {
  Product,
  CartItem,
  ProductColor,
  FilterState,
  ToastMessage,
  PageView,
} from "@/types";

import { getAllProdects } from "@/app/api/services/prodect.services";

import {
  AddToCart,
  getLoggedUserCart,
  RemoveProduct,
  UpdateProductQuantity,
} from "@/actions/cart.actions";

import {
  AddToWishlist,
  getLoggedUserWishlist,
  RemoveFromWishlist,
} from "@/actions/wishlist.actions";

interface ShopContextType {
  // Navigation
  activePage: PageView;
  setActivePage: (page: PageView) => void;

  selectedProductId: string | null;
  openProductDetail: (productId: string) => void;

  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  // Products
  products: Product[];
  isProductsLoading: boolean;
  getProductById: (id: string) => Product | undefined;

  // Cart
  cart: CartItem[];
  cartId: string | null; 
  addToCart: (
    product: Product,
    color: ProductColor,
    size: string,
    quantity?: number,
    customDesign?:
      | "kiikii-cat"
      | "threadx-logo"
      | "minimal-logo"
      | "no-logo",
    customColorHex?: string
  ) => Promise<void>;

  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, delta: number) => Promise<void>;
  updatingItemId: string | null;

  refreshCart: () => Promise<void>;

  cartCount: number;
  cartSubtotal: number;

  // Coupon
  appliedCouponCode: string;
  discountFixed: number;
  discountPercent: number;
  discountAmount: number;
  setAppliedCoupon: (code: string, fixed: number, percent: number) => void;
  clearCoupon: () => void;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlistLoading: boolean;
  isWishlisted: (productId: string) => boolean;

  refreshWishlist: () => Promise<void>;
  wishlistCount: number;
  

  // Modals
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
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

const initialFilters: FilterState = {
  category: "all" as any,
  minPrice: 0,
  maxPrice: 3000,
  sizes: [],
  colors: [],
  collection: "all",
  sortBy: "featured",
  searchQuery: "",
  onlyInStock: false,
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export default function ShopProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { status } = useSession();

  // Products
  const [products, setProducts] = useState<Product[]>([]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>([]);
  // في ShopContext.tsx - ضيف state جديدة
const [isWishlistLoading, setIsWishlistLoading] = useState(true);
const [isProductsLoading, setIsProductsLoading] = useState(true);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await getAllProdects();
      if (Array.isArray(data)) setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsProductsLoading(false);
    }
  };
  fetchProducts();
}, []);

const refreshWishlist = useCallback(async () => {
  setIsWishlistLoading(true);
  try {
    const response = await getLoggedUserWishlist();
    if (response?.success && Array.isArray(response.data)) {
      const productIds = response.data
        .map((item: any) => (typeof item === "string" ? item : item?.product?._id ?? item?._id))
        .filter(Boolean);
      setWishlist(productIds);
    } else {
      setWishlist([]);
    }
  } catch (error) {
    console.error("Failed to fetch wishlist:", error);
    setWishlist([]);
  } finally {
    setIsWishlistLoading(false);
  }
}, []);

  // Navigation
  const [activePage, setActivePage] = useState<PageView>("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  // Coupon
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [discountFixed, setDiscountFixed] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);


  const setAppliedCoupon = (code: string, fixed: number, percent: number) => {
    setAppliedCouponCode(code);
    setDiscountFixed(fixed);
    setDiscountPercent(percent);
  };

  const clearCoupon = () => {
    setAppliedCouponCode('');
    setDiscountFixed(0);
    setDiscountPercent(0);
  };

  // Filters
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // =========================
  // Products
  // =========================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProdects();

        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // =========================
  // Cart
  // =========================

  const refreshCart = useCallback(async () => {
  try {
    const response = await getLoggedUserCart();

    if (response?.success && response.data) {
      setCart(response.data.items ?? []);
      setCartId(response.data._id ?? null);
    } else {
      setCart([]);
      setCartId(null);
    }
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    setCart([]);
    setCartId(null);
  }
}, []);
  

  // =========================
  // Wishlist
  // =========================

  // const refreshWishlist = useCallback(async () => {
  //   try {
  //     const response = await getLoggedUserWishlist();

  //     if (
  //       response?.status === "success" &&
  //       Array.isArray(response.data)
  //     ) {
  //       const productIds = response.data
  //         .map((item: any) => {
  //           if (typeof item === "string") {
  //             return item;
  //           }

  //           return item?.product?._id ?? item?._id;
  //         })
  //         .filter(Boolean);

  //       setWishlist(productIds);
  //     } else {
  //       setWishlist([]);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch wishlist:", error);
  //     setWishlist([]);
  //   }
  // }, []);

  // Load user data after login
  useEffect(() => {
    if (status === "authenticated") {
      refreshCart();
      refreshWishlist();
    }

    if (status === "unauthenticated") {
      setCart([]);
      setWishlist([]);
    }
  }, [status, refreshCart, refreshWishlist]);

  // =========================
  // Toast
  // =========================

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);

    setToasts((prev) => [
      ...prev,
      {
        ...toast,
        id,
      },
    ]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // =========================
  // Navigation
  // =========================

  const openProductDetail = (productId: string) => {
    triggerRouteLoading();
    setSelectedProductId(productId);
    router.push(`/product/${productId}`);
  };

  // =========================
  // Add To Cart
  // =========================

  const addToCart = async (
    product: Product,
    color: ProductColor,
    size: string,
    quantity = 1,
    customDesign?:
      | "kiikii-cat"
      | "threadx-logo"
      | "minimal-logo"
      | "no-logo",
    customColorHex?: string
  ) => {
    try {
      /*
       * Current API accepts only productId.
       * Other parameters are kept to avoid changing
       * the existing components.
       */

      const response = await AddToCart(product._id);

      if (!response) {
        return;
      }

      await refreshCart();

      addToast({
        title: "Added to Bag",
        message: product.name,
        type: "cart",
        image: product.images?.[0]?.secure_url,
      });
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  // =========================
  // Remove From Cart
  // =========================

  const removeFromCart = async (itemId: string) => {
  try {
    const response = await RemoveProduct(itemId);

    if (!response?.success) {
      addToast({
        title: "Could not remove item",
        message: response?.message ?? "Please try again.",
        type: "warning",
      });
      return;
    }

    await refreshCart();

    addToast({
      title: "Removed from Bag",
      type: "info",
    });
  } catch (error) {
    console.error("Failed to remove from cart:", error);
  }
  };

  // =========================
  // Update Cart Quantity
  // =========================

  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

const updateQuantity = async (itemId: string, delta: number) => {
  if (!cartId) return; // مفيش سلة أصلاً، منعملش حاجة

  // Find the current item to calculate new quantity
  const currentItem = cart.find(
    (item) => item.product._id === itemId || item._id === itemId
  );
  if (!currentItem) return;

  const newQty = (currentItem.quantity ?? 1) + delta;
  if (newQty < 1) return; // prevent going below 1

  setUpdatingItemId(itemId);
  try {
    const response = await UpdateProductQuantity(cartId, itemId, newQty);

    if (!response?.success) {
      addToast({
        title: "Could not update item",
        message: response?.message ?? "Please try again.",
        type: "warning",
      });
      return;
    }

    await refreshCart();
  } catch (error) {
    console.error("Failed to update cart:", error);
    addToast({ title: "Error updating quantity", type: "warning" });
  } finally {
    setUpdatingItemId(null);
  }
};


  // =========================
  // Wishlist
  // =========================

  const toggleWishlist = async (productId: string) => {
    const product = products.find(
      (item) => item._id === productId
    );

    const isAlreadyWishlisted = wishlist.includes(productId);

    try {
      if (isAlreadyWishlisted) {
        const response = await RemoveFromWishlist(productId);

        if (response?.status === "unauthenticated") {
          addToast({
            title: "Login Required",
            message: "Please login to manage your wishlist.",
            type: "info",
          });

          return;
        }

        setWishlist((prev) =>
          prev.filter((id) => id !== productId)
        );

        addToast({
          title: "Removed from Wishlist",
          message: product?.name,
          type: "info",
        });

        return;
      }

      const response = await AddToWishlist(productId);

      if (response?.status === "unauthenticated") {
        addToast({
          title: "Login Required",
          message: "Please login to manage your wishlist.",
          type: "info",
        });

        return;
      }

      setWishlist((prev) =>
        prev.includes(productId)
          ? prev
          : [...prev, productId]
      );

      addToast({
        title: "Saved to Wishlist",
        message: product?.name,
        type: "success",
        image: product?.images?.[0]?.secure_url,
      });
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  const isWishlisted = (productId: string) => {
    return wishlist.includes(productId);
  };

  // =========================
  // Cart Calculations
  // =========================

  const cartCount = useMemo(() => {
    return cart.reduce(
      (total, item) => total + (item.quantity ?? 0),
      0
    );
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + (item.price ?? 0) * (item.quantity ?? 0),
      0
    );
  }, [cart]);

  const discountAmount = discountFixed > 0
    ? discountFixed
    : (cartSubtotal * discountPercent) / 100;

  // =========================
  // Wishlist Count
  // =========================

  const wishlistCount = wishlist.length;

  // =========================
  // Filters
  // =========================

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // =========================
  // Product Helper
  // =========================

  const getProductById = (id: string) => {
    return products.find((product) => product._id === id);
  };

  return (
    <ShopContext.Provider
      value={{
        // Navigation
        activePage,
        setActivePage,
        selectedProductId,
        openProductDetail,
        selectedCategory,
        setSelectedCategory,

        // Products
        products,
        getProductById,

        // Cart
        cart,
        cartId,
        addToCart,
        removeFromCart,
        updateQuantity,
        updatingItemId,
        refreshCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,

        // Coupon
        appliedCouponCode,
        discountFixed,
        discountPercent,
        discountAmount,
        setAppliedCoupon,
        clearCoupon,

        // Wishlist
        wishlist,
        toggleWishlist,
        isWishlisted,
        refreshWishlist,
        wishlistCount,
        isProductsLoading,
        isWishlistLoading,

        // Modals
        isSearchOpen,
        setIsSearchOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        quickViewProduct,
        setQuickViewProduct,

        // Filters
        filters,
        setFilters,
        resetFilters,

        // Toasts
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error(
      "useShop must be used within a ShopProvider"
    );
  }

  return context;
};