"use server";

import { getAccessToken } from "@/types/utilities";
import { ApiListResponse, ApiSingleResponse, Product } from "@/types";
import { Category, SubCategory, Coupon } from "@/types/category";
import { AdminCustomer } from "@/types/admin/adminCustomer";
import { AdminOrder } from "@/types/admin/adminOrders";

const BASE = "https://backend-lamsa.vercel.app/api";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

/** GET /api/products — all products (admin view) */
export async function getAllProductsAdmin(): Promise<Product[] | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/products`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data: ApiListResponse<Product> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** GET /api/products/:id */
export async function getProductByIdAdmin(
  id: string,
): Promise<Product | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data: ApiSingleResponse<Product> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

export interface ProductPayload {
  name: string;
  description: string;
  price: string;
  stock: string;
  discountPrice?: string;
  category?: string;
  subCategory?: string;
  coupon?: string;
  /** Available sizes, e.g. ["S","M","L"] */
  sizes?: string[];
  /** Available colors, e.g. ["Red","Blue"] */
  colors?: string[];
  /** base64 encoded image strings, e.g. "data:image/jpeg;base64,..." */
  images?: string[];
}

export async function createProduct(
  payload: ProductPayload,
): Promise<{ success: boolean; data?: Product; message?: string }> {
  try {
    const token = await getAccessToken();

    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("description", payload.description);
    formData.append("price", payload.price);
    formData.append("stock", payload.stock);
    if (payload.discountPrice) formData.append("discountPrice", payload.discountPrice);
    if (payload.category) formData.append("category", payload.category);
    if (payload.subCategory) formData.append("subCategory", payload.subCategory);
    if (payload.coupon) formData.append("coupon", payload.coupon);
    payload.sizes?.forEach((s) => formData.append("sizes", s));
    payload.colors?.forEach((c) => formData.append("colors", c));

    if (payload.images?.length) {
      for (let i = 0; i < payload.images.length; i++) {
        const base64 = payload.images[i];
        const mimeMatch = base64.match(/data:([^;]+);base64,/);
        const mime = mimeMatch?.[1] ?? "image/jpeg";
        const ext = mime.split("/")[1] ?? "jpg";
        const byteStr = atob(base64.split(",")[1]);
        const bytes = new Uint8Array(byteStr.length);
        for (let j = 0; j < byteStr.length; j++) bytes[j] = byteStr.charCodeAt(j);
        const blob = new Blob([bytes], { type: mime });
        formData.append("images", blob, `image_${i}.${ext}`);
      }
    }

    const res = await fetch(`${BASE}/products`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const responseText = await res.text();
    console.log("CREATE PRODUCT STATUS:", res.status);
    console.log("CREATE PRODUCT RESPONSE:", responseText);

    let parsed: any;
    try { parsed = JSON.parse(responseText); } catch { parsed = null; }

    if (!res.ok) {
      console.error("CREATE PRODUCT ERROR:", responseText);
      return { success: false, message: parsed?.message || "Failed to create product" };
    }

    return { success: true, data: parsed?.data, message: parsed?.message };
  } catch (err) {
    console.error("[createProduct] ERROR:", err);
    return { success: false, message: (err as Error).message || "An unexpected error occurred" };
  }
}

/** PUT /api/products/:id — update existing product */
export async function updateProduct(
  id: string,
  payload: ProductPayload,
): Promise<{ success: boolean; data?: Product; message?: string }> {
  try {
    const token = await getAccessToken();

    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("description", payload.description);
    formData.append("price", payload.price);
    formData.append("stock", payload.stock);
    if (payload.discountPrice) formData.append("discountPrice", payload.discountPrice);
    if (payload.category) formData.append("category", payload.category);
    if (payload.subCategory) formData.append("subCategory", payload.subCategory);
    if (payload.coupon) formData.append("coupon", payload.coupon);
    payload.sizes?.forEach((s) => formData.append("sizes", s));
    payload.colors?.forEach((c) => formData.append("colors", c));

    if (payload.images?.length) {
      for (let i = 0; i < payload.images.length; i++) {
        const base64 = payload.images[i];
        const mimeMatch = base64.match(/data:([^;]+);base64,/);
        const mime = mimeMatch?.[1] ?? "image/jpeg";
        const ext = mime.split("/")[1] ?? "jpg";
        const byteStr = atob(base64.split(",")[1]);
        const bytes = new Uint8Array(byteStr.length);
        for (let j = 0; j < byteStr.length; j++) bytes[j] = byteStr.charCodeAt(j);
        const blob = new Blob([bytes], { type: mime });
        formData.append("images", blob, `image_${i}.${ext}`);
      }
    }

    const res = await fetch(`${BASE}/products/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const responseText = await res.text();
    console.log("UPDATE PRODUCT STATUS:", res.status);
    console.log(
      "[updateProduct] payload keys:",
      Object.keys(payload ?? {}),
      "price:",
      payload?.price,
    );
    console.log("[updateProduct] stock sent:", formData.get("stock"));
    console.log("UPDATE PRODUCT RESPONSE:", responseText);

    let parsed: any;
    try { parsed = JSON.parse(responseText); } catch { parsed = null; }

    if (!res.ok) {
      console.error("[updateProduct] Error:", responseText);
      return { success: false, message: parsed?.message || "Failed to update product" };
    }

    return { success: true, data: parsed?.data, message: parsed?.message };
  } catch (err) {
    console.error("[updateProduct] Error:", err);
    return { success: false, message: (err as Error).message || "An unexpected error occurred" };
  }
}

/** DELETE /api/products/:id */
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

/** GET /api/categories */
export async function getCategoriesAdmin(): Promise<Category[] | undefined> {
  try {
    const res = await fetch(`${BASE}/categories`, { cache: "no-store" });
    const data: ApiListResponse<Category> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** GET /api/sub-categories */
export async function getSubCategoriesAdmin(): Promise<
  SubCategory[] | undefined
> {
  try {
    const res = await fetch(`${BASE}/sub-categories`, { cache: "no-store" });
    const data: ApiListResponse<SubCategory> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** POST /api/categories — create a new category (name + optional image) */
export async function createCategory(
  formData: FormData,
): Promise<{ success: boolean; data?: Category; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/categories`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to create category",
      };
    }
    return {
      success: true,
      data: data?.data || data,
      message: data?.message,
    };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

/** PUT /api/categories/:id — update category */
export async function updateCategory(
  id: string,
  formData: FormData,
): Promise<{ success: boolean; data?: Category; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/categories/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to update category",
      };
    }
    return {
      success: true,
      data: data?.data || data,
      message: data?.message,
    };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

/** DELETE /api/categories/:id */
export async function deleteCategory(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to delete category",
      };
    }
    return {
      success: true,
      message: data?.message,
    };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

/** POST /api/sub-categories — create a new sub-category */
export async function createSubCategory(body: {
  name: string;
  category?: string;
}): Promise<{ success: boolean; data?: SubCategory; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/sub-categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to create sub-category",
      };
    }
    return {
      success: true,
      data: data?.data || data,
      message: data?.message,
    };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

/** PUT /api/sub-categories/:id */
export async function updateSubCategory(
  id: string,
  body: { name?: string; category?: string },
): Promise<{ success: boolean; data?: SubCategory; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/sub-categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to update sub-category",
      };
    }
    return {
      success: true,
      data: data?.data || data,
      message: data?.message,
    };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

/** DELETE /api/sub-categories/:id */
export async function deleteSubCategory(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/sub-categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to delete sub-category",
      };
    }
    return {
      success: true,
      message: data?.message,
    };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────────

/** GET /api/orders — all orders (admin) */
export async function getAllOrdersAdmin(): Promise<AdminOrder[] | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data: ApiListResponse<AdminOrder> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** PUT /api/orders/:id — update order status */
export async function updateOrderStatus(
  orderId: string,
  orderStatus: AdminOrder["orderStatus"],
): Promise<{ success: boolean; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderStatus }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("updateOrderStatus failed:", res.status, data);
      return {
        success: false,
        message: data?.message || "Failed to update order status",
      };
    }
    return {
      success: true,
      message: data?.message,
    };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMERS
// ─────────────────────────────────────────────────────────────────────────────

/** GET /api/users — all users (admin) */
export async function getAllCustomers(): Promise<AdminCustomer[] | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data: ApiListResponse<AdminCustomer> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// OVERVIEW STATS
// ─────────────────────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const [products, orders, customers] = await Promise.allSettled([
    getAllProductsAdmin(),
    getAllOrdersAdmin(),
    getAllCustomers(),
  ]);

  const productList =
    products.status === "fulfilled" ? (products.value ?? []) : [];
  const orderList = orders.status === "fulfilled" ? (orders.value ?? []) : [];
  const customerList =
    customers.status === "fulfilled" ? (customers.value ?? []) : [];

  // الإيراد = مجموع finalPrice (بعد الكوبون) للأوردرات غير الملغية وغير المحذوفة
  const revenue = orderList.reduce((sum, o) => {
    if (o.isDeleted) return sum;
    if ((o.orderStatus ?? "").toLowerCase() === "cancelled") return sum;
    return sum + (o.finalPrice ?? o.totalPrice ?? 0);
  }, 0);

  const statusCounts = orderList.reduce(
    (acc, o) => {
      const st = (o.orderStatus || "pending").toLowerCase();
      acc[st] = (acc[st] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // الأحدث أولاً
  const recentOrders = [...orderList]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);

  return {
    totalProducts: productList.length,
    totalOrders: orderList.length,
    totalCustomers: customerList.length,
    revenue,
    statusCounts,
    recentOrders,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COUPONS
// ─────────────────────────────────────────────────────────────────────────────

/** GET /api/coupons */
export async function getCouponsAdmin(): Promise<Coupon[] | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/coupons`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data: ApiListResponse<Coupon> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** Validate a promo code against backend coupons — callable from client components */
export async function validateCoupon(
  code: string,
  subtotal: number,
): Promise<
  | {
      valid: true;
      discount: number;
      discountType: "percentage" | "fixed";
      code: string;
    }
  | { valid: false; message: string }
> {
  try {
    const token = await getAccessToken();

    const res = await fetch(`${BASE}/coupons/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: code.trim(), subtotal }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("validateCoupon failed:", res.status, data);
      return {
        valid: false,
        message: data?.message || "Invalid coupon code.",
      };
    }

    console.log("validateCoupon response:", data);

    const coupon = data?.data?.coupon;
    const discountAmount = data?.data?.discountAmount;

    if (!coupon || discountAmount == null) {
      return { valid: false, message: "Could not read the coupon discount." };
    }

    return {
      valid: true,
      discount: Number(discountAmount),
      discountType: "fixed", // مبلغ جاهز من الباك إند
      code: coupon.code,
    };
  } catch (err) {
    console.error("validateCoupon error:", err);
    return { valid: false, message: "Something went wrong. Try again." };
  }
}

/** POST /api/coupons */
export async function createCoupon(body: {
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  expiresAt?: string;
  usageLimit?: number;
}): Promise<{ success: boolean; data?: Coupon; message?: string }> {
  try {
    const token = await getAccessToken();
    const payload = {
      code: body.code,
      discountPercentage: body.discount,
      expireDate: new Date(body.expiresAt).toISOString(),
      usageLimit: body.usageLimit,
    };
    const res = await fetch(`${BASE}/coupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to create coupon",
      };
    }
    return {
      success: true,
      data: data?.data || data,
      message: data?.message,
    };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

/** PUT /api/coupons/:id */
export async function updateCoupon(
  id: string,
  body: Partial<{
    code: string;
    discount: number;
    discountType: "percentage" | "fixed";
    expiresAt: string;
    isActive: boolean;
    usageLimit: number;
  }>,
): Promise<{ success: boolean; data?: Coupon; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/coupons/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to update coupon",
      };
    }
    return {
      success: true,
      data: data?.data || data,
      message: data?.message,
    };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

/** DELETE /api/coupons/:id */
export async function deleteCoupon(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/coupons/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to delete coupon",
      };
    }
    return {
      success: true,
      message: data?.message,
    };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}
