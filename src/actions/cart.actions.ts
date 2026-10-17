"use server";

import { AddToCartPayload, ApiSingleResponse, Cart, CartItem } from "@/types";
import { getAccessToken } from "@/types/utilities";

export async function AddToCart({
  productId,
  quantity = 1,
  size,
  color,
}: AddToCartPayload) {
  const token = await getAccessToken();
  if (!token) {
    return Error("Hey 👋, please login to start add items to your cart");
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity, size, color }),
  });
  const data: ApiSingleResponse<Cart> = await res.json();
  return data.data;
}
export async function getLoggedUserCart(): Promise<
  ApiSingleResponse<Cart> | undefined
> {
  try {
    const token = await getAccessToken();

    if (!token) {
      return undefined;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data: ApiSingleResponse<Cart> = await res.json();
    return data;
  } catch (error) {
    console.error("[getLoggedUserCart]", error);
    return undefined;
  }
}

export async function RemoveProduct(productId: string) {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, message: "Please login to remove items from your cart" };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/item/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
      },
    );

    if (!res.ok) {
      let message = "Could not remove item";
      try {
        const errData = await res.json();
        message = errData?.message ?? message;
      } catch {
        // ignore parse errors
      }
      return { success: false, message };
    }

    return { success: true };
  } catch (error) {
    console.error("[RemoveProduct]", error);
    return { success: false, message: "Could not remove item" };
  }
}

export async function UpdateProductQuantity(
  cartId: string,
  productId: string,
  quantity: number,
) {
  const token = await getAccessToken();

  if (!token) {
    return { success: false, message: "Please login to update your cart" };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/${cartId}`, 
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }), 
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("[UpdateProductQuantity]", error);
    return { success: false, message: "Failed to update quantity" };
  }
}