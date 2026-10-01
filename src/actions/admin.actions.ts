'use server';

import { getAccessToken } from '@/types/utilities';
import { ApiListResponse, ApiSingleResponse, Product } from '@/types';
import { Category, SubCategory, Coupon } from '@/types/category';

const BASE = 'https://backend-lamsa.vercel.app/api';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

/** GET /api/products — all products (admin view) */
export async function getAllProductsAdmin(): Promise<Product[] | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/products`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const data: ApiListResponse<Product> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** GET /api/products/:id */
export async function getProductByIdAdmin(id: string): Promise<Product | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const data: ApiSingleResponse<Product> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/**
 * POST /api/products — create new product
 * Sends FormData (name, description, price, discountPrice, category, subCategory, images[])
 */
export async function createProduct(
  formData: FormData,
): Promise<{ success: boolean; data?: Product; message?: string }> {
  try {
    const token = await getAccessToken();

    const res = await fetch(`${BASE}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseText = await res.text();
    console.log("CREATE PRODUCT STATUS:", res.status);
    console.log("CREATE PRODUCT RESPONSE:", responseText);

    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = null;
    }

    if (!res.ok) {
      console.error("CREATE PRODUCT ERROR:", responseText);
      return {
        success: false,
        message: parsed?.message || 'Failed to create product',
      };
    }

    return {
      success: true,
      data: parsed?.data,
      message: parsed?.message,
    };
  } catch (err) {
    console.error("[createProduct] ERROR:", err);
    return {
      success: false,
      message: (err as Error).message || 'An unexpected error occurred',
    };
  }
}

/** PUT /api/products/:id — update existing product */
export async function updateProduct(
  id: string,
  formData: FormData
): Promise<{ success: boolean; data?: Product; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const responseText = await res.text();
    console.log("UPDATE PRODUCT STATUS:", res.status);
    console.log("UPDATE PRODUCT RESPONSE:", responseText);

    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = null;
    }

    if (!res.ok) {
      console.error('[updateProduct] Error:', responseText);
      return {
        success: false,
        message: parsed?.message || 'Failed to update product',
      };
    }

    return {
      success: true,
      data: parsed?.data,
      message: parsed?.message,
    };
  } catch (err) {
    console.error('[updateProduct] Error:', err);
    return {
      success: false,
      message: (err as Error).message || 'An unexpected error occurred',
    };
  }
}

/** DELETE /api/products/:id */
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/products/${id}`, {
      method: 'DELETE',
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
    const res = await fetch(`${BASE}/categories`, { cache: 'no-store' });
    const data: ApiListResponse<Category> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** GET /api/sub-categories */
export async function getSubCategoriesAdmin(): Promise<SubCategory[] | undefined> {
  try {
    const res = await fetch(`${BASE}/sub-categories`, { cache: 'no-store' });
    const data: ApiListResponse<SubCategory> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** POST /api/categories — create a new category (name + optional image) */
export async function createCategory(formData: FormData): Promise<Category | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/categories`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data: ApiSingleResponse<Category> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** PUT /api/categories/:id — update category */
export async function updateCategory(id: string, formData: FormData): Promise<Category | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data: ApiSingleResponse<Category> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** DELETE /api/categories/:id */
export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

/** POST /api/sub-categories — create a new sub-category */
export async function createSubCategory(body: {
  name: string;
  category?: string;
}): Promise<SubCategory | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/sub-categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data: ApiSingleResponse<SubCategory> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** PUT /api/sub-categories/:id */
export async function updateSubCategory(
  id: string,
  body: { name?: string; category?: string }
): Promise<SubCategory | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/sub-categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data: ApiSingleResponse<SubCategory> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** DELETE /api/sub-categories/:id */
export async function deleteSubCategory(id: string): Promise<boolean> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/sub-categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminOrder {
  _id: string;
  orderNumber?: string;
  user?: { _id: string; name: string; email: string };
  contactEmail?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total?: number;
  totalPrice?: number;
  createdAt: string;
  items?: unknown[];
  shippingAddress?: {
    fullName?: string;
    address?: string;
    city?: string;
    country?: string;
  };
}

/** GET /api/orders — all orders (admin) */
export async function getAllOrdersAdmin(): Promise<AdminOrder[] | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
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
  status: AdminOrder['status']
): Promise<boolean> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMERS
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminCustomer {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  ordersCount?: number;
}

/** GET /api/users — all users (admin) */
export async function getAllCustomers(): Promise<AdminCustomer[] | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
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

  const productList = products.status === 'fulfilled' ? products.value ?? [] : [];
  const orderList = orders.status === 'fulfilled' ? orders.value ?? [] : [];
  const customerList = customers.status === 'fulfilled' ? customers.value ?? [] : [];

  const revenue = orderList.reduce((sum, o) => sum + (o.total ?? o.totalPrice ?? 0), 0);

  const statusCounts = orderList.reduce((acc, o) => {
    const st = (o.status || 'pending').toLowerCase();
    acc[st] = (acc[st] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalProducts: productList.length,
    totalOrders: orderList.length,
    totalCustomers: customerList.length,
    revenue,
    statusCounts,
    recentOrders: orderList.slice(0, 5),
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
      cache: 'no-store',
    });
    const data: ApiListResponse<Coupon> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** POST /api/coupons */
export async function createCoupon(body: {
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  expiresAt?: string;
  usageLimit?: number;
}): Promise<Coupon | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data: ApiSingleResponse<Coupon> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** PUT /api/coupons/:id */
export async function updateCoupon(
  id: string,
  body: Partial<{
    code: string;
    discount: number;
    discountType: 'percentage' | 'fixed';
    expiresAt: string;
    isActive: boolean;
    usageLimit: number;
  }>
): Promise<Coupon | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/coupons/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data: ApiSingleResponse<Coupon> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** DELETE /api/coupons/:id */
export async function deleteCoupon(id: string): Promise<boolean> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/coupons/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}