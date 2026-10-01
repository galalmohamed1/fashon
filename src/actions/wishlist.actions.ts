'use server';

import { authOptions } from "@/app/next-auth/authOptions";
import { getAccessToken } from "@/types/utilities";
import { getServerSession } from "next-auth";

export async function AddToWishlist(productId: string) {
  const session = await getServerSession(authOptions);
  const token = await getAccessToken();

  if (!session || !token) {
   return {
     status: "unauthenticated",
     message: "Hey 👋, please login to start add items to your cart",
   };
  }
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user: session.id, 
      productId: productId,
    }),
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

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    cache: "no-store",
  });
  const data = await res.json();
  return data;
}
export async function RemoveFromWishlist(productId: string) {
  const token = await getAccessToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    },
  );
  const data = await res.json();
  return data;
}