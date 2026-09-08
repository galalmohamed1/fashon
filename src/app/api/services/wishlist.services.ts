import { ApiListResponse, ApiSingleResponse } from "@/types/product";
import { AddToWishlistPayload, WishlistItem } from "@/types/wishlist";

// GET /api/wishlist/
export async function getWishlist(token: string): Promise<WishlistItem[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: ApiListResponse<WishlistItem> = await res.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to fetch wishlist');
  }
}
 
// POST /api/wishlist/
export async function addToWishlist(payload: AddToWishlistPayload, token: string): Promise<WishlistItem> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data: ApiSingleResponse<WishlistItem> = await res.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to add item to wishlist');
  }
}
 
// DELETE /api/wishlist/:id
export async function removeFromWishlist(id: string, token: string): Promise<void> {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error('Failed to remove item from wishlist');
  }
}