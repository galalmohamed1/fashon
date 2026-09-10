"use server";

import { ApiSingleResponse, Cart, CartItem } from "@/types";
import { getAccessToken } from "@/types/utilities";

export async function AddToCart(productId: string) {
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
    body: JSON.stringify({ productId: productId }),
  });
  const data: ApiSingleResponse<Cart> = await res.json();
  return data.data;
}
export async function getLoggedUserCart() {
  const token = await getAccessToken();

  if (!token) {
    return {
      status: "unauthenticated" as string,
      numOfCartItems: 0,
      data: {
        products: [] as CartItem[],
        totalCartPrice: 0,
      },
    };
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
  return {
    status: data.success ? "success" : "error",
    numOfCartItems: data.data?.items?.length ?? 0,
    data: {
      products: data.data?.items ?? [],
      totalCartPrice: data.data?.totalPrice ?? 0,
    },
  };
}
// export async function UpdateProductQuantity(productId: string, count: number) {
//   const token = await getAccessToken();
//   const res = await fetch(
//     `https://ecommerce.routemisr.com/api/v2/cart/${productId}`,
//     {
//       method: "PUT",
//       headers: { token: token as string, "content-type": "application/json" },
//       body: JSON.stringify({ count: count }),
//     },
//   );
//   const data = await res.json();
//   return data;
// }
// export async function RemoveProduct(productId: string) {
//   const token = await getAccessToken();
//   const res = await fetch(
//     `https://ecommerce.routemisr.com/api/v2/cart/${productId}`,
//     {
//       method: "DELETE",
//       headers: { token: token as string, "content-type": "application/json" },
//     },
//   );
//   const data = await res.json();
//   return data;
// }
// export async function RemoveAllProductsFromCart() {
//   const token = await getAccessToken();
//   const res = await fetch(`https://ecommerce.routemisr.com/api/v2/cart`, {
//     method: "DELETE",
//     headers: { token: token as string, "content-type": "application/json" },
//   });
//   const data = await res.json();
//   return data;
// }
