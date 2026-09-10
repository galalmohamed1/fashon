'use server';

import { getAccessToken } from "@/types/utilities";

export async function AddToWishlist(productId: string) {
  const token = await getAccessToken();
  if (!token) {
    return {
      status: "unauthenticated",
      message: "Hey 👋, please login to start add items to your cart",
    };
    // return toast.error("Hey 👋, please login to start add items to your cart");
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/`, {
    method: 'POST',
    headers: { token: token as string, 'content-type': 'application/json' },
    body: JSON.stringify({ productId: productId }),
  });
  const data = await res.json();
  return data;
}
export async function getLoggedUserWishlist() {
  const token = await getAccessToken();

  if (!token) {
    return {
      status: "unauthenticated",
      count: 0,
      data: [],
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/`,
    {
      method: "GET",
      headers: {
        token,
        "content-type": "application/json",
      },
      cache: "no-store",
    }
  );
  const data = await res.json();
  return data;
}
export async function RemoveFromWishlist(productId: string) {
  const token = await getAccessToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/${productId}`, {
    method: 'DELETE',
    headers: { token: token as string, 'content-type': 'application/json' },
  });
  const data = await res.json();
  return data;
}