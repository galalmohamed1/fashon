import { AddToCartPayload, Cart } from "@/types/cart";
import { ApiSingleResponse } from "@/types/product";

// GET /api/cart/
export async function getCart(token: string): Promise<Cart> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: ApiSingleResponse<Cart> = await res.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to fetch cart');
  }
}
 
// POST /api/cart/
export async function addToCart(payload: AddToCartPayload, token: string): Promise<Cart> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data: ApiSingleResponse<Cart> = await res.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to add item to cart');
  }
}